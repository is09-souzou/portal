import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import * as H from "history";
import {
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
} from "@material-ui/icons";
import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    IconButton,
    InputAdornment,
    Input,
    Popover,
} from "@material-ui/core";

import { AuthProps } from "./wrapper/Auth";
import { DrawerContext } from "./wrapper/MainLayout";
import SignInDialog from "./SignInDialog";
import SignUpDialog from "./SignUpDialog";
import Link         from "./Link";
import GraphQLProgress from "./GraphQLProgress";
import toObjectFromURIQuery from "../api/toObjectFromURIQuery";
import { NotificationListener } from "./wrapper/NotificationListener";
import gql from "graphql-tag";
import { Redirect } from "react-router";

interface Props extends AuthProps {
    history: H.History;
    notificationListener: NotificationListener;
}

interface State {
    userMenuAnchorEl: HTMLElement | undefined;
    userMenuOpend: boolean;
}

const QueryGetUser = gql(`
    query($id: ID!) {
        getUser(id: $id) {
            id
            email
            displayName
        }
    }
`);

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
        });
    }

    handleMenu = (event: React.MouseEvent<HTMLElement>): void =>
        this.setState({ userMenuAnchorEl: event.currentTarget })

    handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const val = (e.target as any).value;
        if (e.keyCode && e.keyCode === 13) {
            console.log("if:" + val);
        }
    }
    menuClose = () => this.setState({ userMenuAnchorEl: undefined });

    signInDialogOpen = () => this.props.history.push("?sign-in=true");

    signUpDialogOpen = () => this.props.history.push("?sign-up=true");

    signInDialogClose = () => this.props.history.push("?sign-in=false");

    signUpDialogClose = () =>  this.props.history.push("?sign-up=false");

    signIn = async (email: string, password: string) => {
        await this.props.auth.signIn(email, password);
        this.signInDialogClose();
    }

    render () {

        const {
            auth,
            history,
            notificationListener
        } = this.props;

        const queryParam = toObjectFromURIQuery(history.location.search);
        const signInDialogVisible = queryParam ? queryParam["sign-in"] === "true" : false;
        const signUpDialogVisible = queryParam ? queryParam["sign-up"] === "true" : false;

        return (
            <StyledAppBar position="fixed">
                <StyledToolbar>
                    <DrawerContext.Consumer>
                        {({ toggleDrawer }) =>
                            <MenuIconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                            >
                                <MenuIcon />
                            </MenuIconButton>
                        }
                    </DrawerContext.Consumer>
                    <Typography variant="title" color="inherit">
                        Work List
                    </Typography>
                    <Input
                        type="text"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        onKeyDown={this.handleSearch}
                    />
                    <div>
                        {!auth.token ?
                            <Button onClick={this.signInDialogOpen} >
                                Sign In
                            </Button>
                      :     (
                                <Query
                                    query={QueryGetUser}
                                    variables={{ id: auth.token!.payload.sub }}
                                    fetchPolicy="cache-and-network"
                                >
                                    {({ loading, error, data }) => {
                                        if (loading) return <GraphQLProgress size={24} />;
                                        if (error) {
                                            console.error(error);
                                            return (
                                                <Fragment>
                                                    <div>cry；；</div>
                                                    <notificationListener.ErrorComponent error={error} />
                                                </Fragment>
                                            );
                                        }

                                        if (!data.getUser)
                                            return <Redirect to="initial-stem" />;

                                        return (
                                            <Fragment>
                                                <IconButton
                                                    aria-owns={this.state.userMenuOpend ? "menu-appbar" : undefined}
                                                    aria-haspopup="true"
                                                    onClick={this.handleMenu}
                                                    color="inherit"
                                                >
                                                    <AccountCircleIcon />
                                                </IconButton>
                                                <Popover
                                                    id="menu-appbar"
                                                    anchorEl={this.state.userMenuAnchorEl}
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                                    open={!!this.state.userMenuAnchorEl}
                                                    onClose={this.menuClose}
                                                >
                                                    <PopoverContent>
                                                        <div>
                                                            <div>
                                                                <Typography variant="caption">Name</Typography>
                                                                <Typography gutterBottom>
                                                                    {data.getUser.displayName}
                                                                </Typography>
                                                            </div>
                                                            <div>
                                                                <Typography variant="caption">Mail Address</Typography>
                                                                <Typography gutterBottom>
                                                                    {data.getUser.email}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Link
                                                                to="/profile"
                                                                onClick={this.menuClose}
                                                            >
                                                                <Button>
                                                                    Profile
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                onClick={auth.signOut}
                                                            >
                                                                sign-out
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </Fragment>
                                        );
                                    }}
                                </Query>
                            )
                        }
                    </div>
                </StyledToolbar>
                <SignInDialog
                    open={signInDialogVisible}
                    onClose={this.signInDialogClose}
                    onSignIn={this.signIn}
                    onCreateAcountButtonClick={this.signUpDialogOpen}
                    onError={notificationListener.errorNotification}
                />
                <SignUpDialog
                    notificationListener={notificationListener}
                    open={signUpDialogVisible}
                    onClose={this.signUpDialogClose}
                    onSignUp={auth.signUp}
                />
            </StyledAppBar>
        );
    }
}

const StyledAppBar = styled(AppBar)`
    && {
        width: calc(100% - 15rem - 6rem);
        margin: 1rem 3rem 0 2rem;
        border-radius: 8px;
        color: #333;
        background-color: white;
        @media (max-width: 767px) {
            width: calc(100% - 6rem);
        }
    }
`;

const MenuIconButton = styled(IconButton)`
    && {
        @media (min-width: 768px) {
            display: none;
        }
    }
`;

const StyledToolbar = styled(Toolbar)`
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
