import { ApolloQueryResult, FetchMoreOptions, FetchMoreQueryOptions } from "apollo-client";
import { DocumentNode } from "apollo-link/lib/types";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import LocationText from "src/components/atoms/LocationText";
import StreamSpinner from "src/components/atoms/StreamSpinner";
import UserList from "src/components/atoms/UserList";
import Header from "src/components/molecules/Header";
import NotFound from "src/components/molecules/NotFound";
import Host from "src/components/pages/WorkListPage/Host";
import ErrorTemplate from "src/components/templates/ErrorTemplate";
import NotificationContext, { NotificationValue } from "src/contexts/NotificationContext";
import { User, UserConnection } from "src/graphQL/type";

const QueryGetUserList = gql(`
    query($limit: Int, $exclusiveStartKey: ID, ) {
        listUsers(limit: $limit, exclusiveStartKey: $exclusiveStartKey) {
            items {
                id
                displayName
                avatarUri
                works(limit: $limit) {
                    items {
                        id
                        userId
                    }
                }
            }
        }
    }
`);

export default (props: React.Props<{}>) => {
    const notification = useContext(NotificationContext);

    return (
        <Host
            ref={props.ref as any}
            {...props}
        >
            <Header
                title={<LocationText text="User list"/>}
            />
            <Query
                query={QueryGetUserList}
                variables={{ limit: 16 }}
                fetchPolicy="cache-and-network"
            >
                {query => (
                    query.loading                                                       ? <GraphQLProgress/>
                  : query.error                                                         ? (
                        <Fragment>
                            <ErrorTemplate/>
                            <notification.ErrorComponent message={query.error.message}/>
                        </Fragment>
                    )
                  : !(query.data && query.data.listUsers && query.data.listUsers.items) ? <NotFound/>
                  :                                                                       (
                        <UserListPage
                            notification={notification}
                            query={query}
                        />
                    )
                )}
            </Query>
        </Host>
    );
};

const UserListPage = (
    {
        query: {
            data,
            fetchMore
        }
    }: {
        notification: NotificationValue,
        query: QueryResult<any, {
            limit: number;
        }>
    }
) => {
    const [, setSelectedUser] = useState<User | undefined>(undefined);
    const userConnection = data.listUsers as UserConnection;
    const [userListRow, setUserListRow] = useState<number>(4);
    console.log(data);

    useEffect(
        () => {
            const resize = () => {
                const row = getRow();
                if (row !== userListRow)
                    setUserListRow(row);
                else
                    setUserListRow(userListRow);
            };
            resize();
            window.addEventListener("resize", resize);

            return () => window.removeEventListener("resize", resize);
        },
        []
    );
    return (
        <div>
                <UserList
                    users={userConnection.items}
                    userListRow={userListRow}
                    onUserItemClick={(x: User) => {
                        setSelectedUser(x);
                    }}
                />
                <StreamSpinner
                    key={`spinner-${userConnection && userConnection.exclusiveStartKey}.join("_")}`}
                    disable={!userConnection.exclusiveStartKey ? true : false}
                    onVisible={handleStreamSpinnerVisible(userConnection, fetchMore)}
                />
        </div>
    );
};

const getRow = () => (
    window.innerWidth > 767 ?
        window.innerWidth > 1020 ? 4
      : window.innerWidth > 840  ? 3
      :                            2
  :
        window.innerWidth > 600  ? 3
      : window.innerWidth > 480  ? 2
      :                            1
);

const handleStreamSpinnerVisible = (
    userConnection: UserConnection,
    fetchMore: (<K extends "limit">(fetchMoreOptions: FetchMoreQueryOptions<{
        limit: number;
    }, K> & FetchMoreOptions<any, {
        limit: number;
    }>) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
        query: DocumentNode;
    } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>)
) => () => {
    if (userConnection && userConnection.exclusiveStartKey)
        fetchMore<any>({
            variables: {
                exclusiveStartKey: userConnection.exclusiveStartKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) =>
                previousResult.listUsers.items.length ? ({
                    listUsers: {
                        __typename: previousResult.listUsers.__typename,
                        items: (
                            [
                                ...previousResult.listUsers.items,
                                ...fetchMoreResult.listUsers.items
                            ].filter((x, i, self) => (
                                self.findIndex(y => y.id === x.id) === i
                            ))
                        ),
                        exclusiveStartKey: fetchMoreResult.listUsers.exclusiveStartKey
                    }
                })                                    : previousResult
        });
};
