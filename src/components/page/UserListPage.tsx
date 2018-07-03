import React, { Fragment } from "react";
import { Query } from "react-apollo";
import {
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";
import { PageComponentProps } from "../../App";
import GraphQLProgress from "../GraphQLProgress";
import Header from "../Header";
import Page from "../Page";
import NotFound from "../NotFound";
import gql from "graphql-tag";

const QueryGetUserList = gql(`
    query($limit: Int, $nextToken: ID) {
        listUsers(limit: $limit, nextToken: $nextToken) {
            items {
                id
                displayName
            }
        }
    }
`);

export default class UserListPage extends React.Component<PageComponentProps<{id: string}>>{

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
                <Query query={QueryGetUserList} variables={{ limit: 20 }} fetchPolicy="cache-and-network">
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

                        if (!data.listUsers || !data.listUsers.items)
                            return <NotFound/>;

                        return (
                            <div>
                                <List>
                                    {data.listUsers.items.map((user: any) =>
                                        <ListItem key={user.id}>
                                            <ListItemText
                                                primary={user.displayName}
                                                secondary={user.id}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </div>
                        );
                    }}
                </Query>
            </Page>
        );
    }
}
