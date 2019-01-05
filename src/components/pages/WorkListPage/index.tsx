import AddIcon from "@material-ui/icons/Add";
import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import Fab from "src/components/atoms/Fab";
import Page from "src/components/atoms/Page";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import WorkList from "src/components/atoms/WorkList";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import WorkDialog from "src/components/organisms/WorkDialog";
import Host from "src/components/pages/WorkListPage/Host";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import { LocaleContext } from "src/components/wrappers/MainLayout";
import { Work, WorkConnection } from "src/graphQL/type";
import getTagsByURLQueryParam from "src/util/getTagsByURLQueryParam";
import { PageComponentProps } from "src/App";

interface State {
    selectedWork?: Work;
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    workDialogVisible: boolean;
    workListRow: number;
}

const QueryListWorks = gql(`
    query($limit: Int, $exclusiveStartKey: ID, $option: WorkQueryOption) {
        listWorks (
            limit: $limit,
            exclusiveStartKey: $exclusiveStartKey,
            option: $option
        ) {
            items {
                id
                userId
                imageUrl
                userId
                user {
                    displayName
                    message
                    avatarUri
                }
                title
                tags
                description
                createdAt
            }
            exclusiveStartKey
        }
    }
`);

export default class extends React.Component<PageComponentProps<{}>, State> {

    state: State = {
        selectedWork: undefined,
        userMenuAnchorEl: undefined,
        userMenuOpend: false,
        workDialogVisible: false,
        workListRow: 4,
    };

    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        const row = (
            window.innerWidth > 767 ?
                window.innerWidth > 1020 ? 4
              : window.innerWidth > 840  ? 3
              :                            2
          :
                window.innerWidth > 600  ? 3
              : window.innerWidth > 480  ? 2
              :                            1
        );
        if (row !== this.state.workListRow)
            this.setState({ workListRow: row });
    }

    handleClickOpen = (x: Work) => () => this.setState({
        workDialogVisible: true,
        selectedWork: x,
    })

    handleStreamSpinnerVisible = (
        workConnection: WorkConnection,
        fetchMore: (<K extends "option" | "limit" | "exclusiveStartKey">(fetchMoreOptions: FetchMoreQueryOptions<{
            limit: number;
            exclusiveStartKey: null;
            option: {
                tags: string[];
            };
        }, K> & FetchMoreOptions<any, {
            limit: number;
            exclusiveStartKey: null;
            option: {
                tags: string[];
            };
        }>) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
            query: DocumentNode;
        } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>)
    ) => () => {
        if (workConnection && workConnection.exclusiveStartKey)
            fetchMore<any>({
                variables: {
                    exclusiveStartKey: workConnection.exclusiveStartKey
                },
                updateQuery: (previousResult, { fetchMoreResult }) =>
                    previousResult.listWorks.items.length ? ({
                        listWorks: {
                            __typename: previousResult.listWorks.__typename,
                            items: (
                                [
                                    ...previousResult.listWorks.items,
                                    ...fetchMoreResult.listWorks.items
                                ].filter((x, i, self) => (
                                    self.findIndex(y => y.id === x.id) === i
                                ))
                            ),
                            exclusiveStartKey: fetchMoreResult.listWorks.exclusiveStartKey
                        }
                    })               : previousResult
            });
    }

    handleCloseWorkDialog = () => this.setState({ workDialogVisible: false });

    moveCreateWorkPage = () => this.props.history.push("/works/create-work");

    render() {

        const {
            auth,
            history,
            notificationListener,
        } = this.props;

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryListWorks}
                    variables={{
                        limit: 6,
                        exclusiveStartKey: null,
                        option: {
                            tags: getTagsByURLQueryParam(history)
                        }
                    }}
                    fetchPolicy="network-only"
                >
                    {({ data, loading, fetchMore, error }) => {
                        if (error)
                            return (
                                <Fragment>
                                    <ErrorTemplate/>
                                    <notificationListener.ErrorComponent message={error && error.message} key="error"/>
                                </Fragment>
                            );
                        else if (loading || !data.listWorks)
                            return (
                                <Host>
                                    <StreamSpinner
                                        disable={false}
                                    />
                                </Host>
                            );
                        else if (data.listWorks.items.length === 0 || !data.listWorks)
                            return <NotFound />;

                        const workConnection = data.listWorks as WorkConnection;

                        return(
                            <LocaleContext.Consumer>
                                {({ locale }) => (
                                    <Host>
                                        <WorkList
                                            works={workConnection.items}
                                            workListRow={this.state.workListRow}
                                            onWorkItemClick={this.handleClickOpen}
                                        />
                                        <WorkDialog
                                            history={history}
                                            open={this.state.workDialogVisible}
                                            onClose={this.handleCloseWorkDialog}
                                            work={this.state.selectedWork}
                                            locale={locale.location}
                                            userId={auth.token ? auth.token.payload.sub : ""}
                                        />
                                        <StreamSpinner
                                            key={`spinner-${workConnection && workConnection.exclusiveStartKey}-${getTagsByURLQueryParam(history).join("_")}`}
                                            disable={!workConnection.exclusiveStartKey ? true : false}
                                            onVisible={this.handleStreamSpinnerVisible(workConnection, fetchMore)}
                                        />
                                    </Host>
                                )}
                            </LocaleContext.Consumer>
                        );
                    }}
                </Query>
                <Fab
                    onClick={this.moveCreateWorkPage}
                >
                    <AddIcon />
                </Fab>
            </Page>
        );
    }
}