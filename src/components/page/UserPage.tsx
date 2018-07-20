import React, { Fragment } from "react";
import gql                 from "graphql-tag";
import { Query }           from "react-apollo";
import { PageComponentProps } from "../../App";
import ErrorPage              from "../ErrorPage";
import GraphQLProgress        from "../GraphQLProgress";
import Header                 from "../Header";
import NotFound               from "../NotFound";
import Page                   from "../Page";
import { User }               from "../../graphQL/type";

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
                    variables={{ id: this.props.match!.params.id }}
                    fetchPolicy="cache-and-network"
                >
                    {({ loading, error, data }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            return (
                                <Fragment>
                                    <ErrorPage/>
                                    <notificationListener.ErrorComponent error={error} key="error"/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return <NotFound />;

                        const user = data.getUser as User;

                        return (
                            <div>
                                <div>{user.id}</div>
                                <div>{user.avatarUri}</div>
                                <div>{user.career}</div>
                                <div>{user.displayName}</div>
                                <div>{user.email}</div>
                                <div>{user.message}</div>
                            </div>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}
