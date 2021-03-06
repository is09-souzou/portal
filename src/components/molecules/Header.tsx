import { Avatar, Button, Popover, Typography } from "@material-ui/core";
import AppBar, { AppBarProps } from "@material-ui/core/AppBar";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Toolbar, { ToolbarProps } from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import gql from "graphql-tag";
import React, { useContext, useState, Fragment } from "react";
import { Query, QueryResult } from "react-apollo";
import { Redirect } from "react-router";
import GraphQLProgress from "src/components/atoms/GraphQLProgress";
import Link from "src/components/atoms/Link";
import LocationText from "src/components/atoms/LocationText";
import AuthContext, { AuthValue } from "src/contexts/AuthContext";
import DrawerContext from "src/contexts/DrawerContext";
import NotificationContext from "src/contexts/NotificationContext";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";
import { User } from "src/graphQL/type";
import styled from "styled-components";

export interface HeaderProps extends React.Props<{}> {
    title: JSX.Element;
}

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
            avatarUri
        }
    }
`);

export default (
    {
        title,
        ...props
    }: HeaderProps
) => {
    const [userMenuAnchorElement, setUserMenuAnchorElement] = useState<HTMLElement | undefined>(undefined);

    const auth = useContext(AuthContext);
    const drawer = useContext(DrawerContext);
    const routerHistory = useContext(RouterHistoryContext);
    const notification = useContext(NotificationContext);

    // const handleSearch = (e: React.KeyboardEvent) => {
    //     const value = (e.target as any).value;
    //     if (e.keyCode && e.keyCode === 13) {
    //         console.log(`if: ${value}`);
    //     }
    // };

    return (
        <StyledAppBar
            position="fixed"
            {...props}
        >
            <StyledToolbar>
                <MenuIconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={drawer.toggleDrawer}
                >
                    <MenuIcon/>
                </MenuIconButton>
                <Typography variant="h6" color="inherit">
                    {title}
                </Typography>
                <div>
                    {!auth.token ?
                        <Button onClick={() => routerHistory.history.push("?sign-in=true")} >
                            <LocationText text="Sign in"/>
                        </Button>
                :     (
                            <Query
                                query={QueryGetUser}
                                variables={{ id: auth.token!.payload.sub }}
                                fetchPolicy="cache-and-network"
                            >
                            {(query =>
                                (
                                    query.loading                       ? <GraphQLProgress size={24}/>
                                  : query.error                         ? (
                                        <Fragment>
                                            <div>?</div>
                                            <notification.ErrorComponent message={query.error.message}/>
                                        </Fragment>
                                    )
                                 : !(query.data && query.data.getUser) ? <Redirect to="/profile?initial-registration=true"/>
                                 :                                       (
                                        <HeaderUser
                                            auth={auth}
                                            closeMenu={() => setUserMenuAnchorElement(undefined)}
                                            handleMenu={e => setUserMenuAnchorElement(e.currentTarget)}
                                            userMenuAnchorElement={userMenuAnchorElement}
                                            query={query}
                                        />
                                    )
                                )
                            )}
                            </Query>
                        )
                    }
                </div>
            </StyledToolbar>
        </StyledAppBar>
    );
};

const HeaderUser = (
    {
        auth,
        closeMenu,
        handleMenu,
        userMenuAnchorElement,
        query: {
            data
        }
    }: {
        auth: AuthValue,
        closeMenu: () => void,
        handleMenu:  (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
        userMenuAnchorElement?:  HTMLElement,
        query: QueryResult<any, {
            id: any;
        }>
    }
) => {
    const user = data.getUser as User;
    return (
        <Fragment>
            <IconButton
                aria-owns={"menu-appbar"}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <Avatar
                    src={user.avatarUri}
                />
            </IconButton>
            <Popover
                id="menu-appbar"
                anchorEl={userMenuAnchorElement}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={!!userMenuAnchorElement}
                onClose={closeMenu}
            >
                <PopoverContent>
                    <div>
                        <div>
                            <Typography variant="caption"><LocationText text="Name"/></Typography>
                            <Typography gutterBottom>
                                {user.displayName}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="caption"><LocationText text="Mail address"/></Typography>
                            <Typography gutterBottom>
                                {user.email}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <Link
                            to={("/users/") + auth.token!.payload.sub}
                            onClick={closeMenu}
                        >
                            <Button>
                                <LocationText text="Profile"/>
                            </Button>
                        </Link>
                        <Button
                            onClick={auth.signOut}
                        >
                            <LocationText text="Sign out"/>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </Fragment>
    );
};

const StyledAppBar = styled(AppBar as React.SFC<AppBarProps>)`
    && {
        width: calc(100% - 17rem - 6rem);
        margin: 1rem 3rem 0 2rem;
        border-radius: 8px;
        color: #333;
        background-color: white;
        @media (max-width: 767px) {
            width: calc(100% - 6rem);
        }
    }
`;

const MenuIconButton = styled(IconButton as React.SFC<IconButtonProps>)`
    && {
        @media (min-width: 768px) {
            display: none;
        }
    }
`;

const StyledToolbar = styled(Toolbar as React.SFC<ToolbarProps>)`
    && {
        display: flex;
        > :nth-child(2) {
            flex-grow: 1;
        }
    }
`;

const PopoverContent = styled.div`
    padding: 1rem;
    > :nth-child(2) {
        display: flex;
    }
`;
