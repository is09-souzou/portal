import React, { Fragment } from "react";
import gql                 from "graphql-tag";
import { Query }           from "react-apollo";
import { PageComponentProps } from "../../App";
import GraphQLProgress        from "../GraphQLProgress";
import Header                 from "../Header";
import NotFound               from "../NotFound";
import Page                   from "../Page";

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            career
            avatarUri
            message
        }
    }
`);

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>> {

    render() {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: this.props.computedMatch!.params.id }}
                    fetchPolicy="cache-and-network"
                >
                    {({ loading, error, data }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <div>cry；；</div>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return <NotFound />;

                        return (
                            <div>
                                {data.getUser}
                            </div>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}
