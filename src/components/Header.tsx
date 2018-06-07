import React from "react";
import styled from "styled-components";
import {
    AccountCircle as AccountCircleIcon,
    Menu as MenuIcon,
} from "@material-ui/icons";
import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    IconButton,
    Popover
} from "@material-ui/core";

import SignInDialog from "./SignInDialog";

interface PropsModel {
    auth: any;
    onMenuButtonClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface StateModel {
    userMenuAnchorEl: HTMLElement | undefined;
    userMenuOpend: boolean;
    signInDialogVisible: boolean;
}

export default class extends React.Component<PropsModel, StateModel> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
            signInDialogVisible: false
        });
    }

    handleMenu = (event: React.MouseEvent<HTMLElement>): void =>
        this.setState({ userMenuAnchorEl: event.currentTarget })

    handleMenuClose = () => this.setState({ userMenuAnchorEl: undefined });

    signInDialogOpen = () => this.setState({ signInDialogVisible: true });

    signInDialogClose = () => this.setState({ signInDialogVisible: false });

    signIn = async (email: string, password: string) => {
        await this.props.auth.signIn(email, password);
        this.signInDialogClose();
    }

    render () {

        const {
            auth,
            onMenuButtonClick
        } = this.props;

        return (
            <StyledAppBar position="fixed">
                <StyledToolbar>
                    <MenuIconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={onMenuButtonClick}
                    >
                        <MenuIcon />
                    </MenuIconButton>
                    <Typography variant="title" color="inherit">
                        Work List
                    </Typography>
                    <div>
                        {!auth.jwtToken ?
                            <Button onClick={this.signInDialogOpen} >
                                Sign In
                            </Button>
                      :     <div>
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
                                    onClose={this.handleMenuClose}
                                >
                                    <PopoverContent>
                                        <div>
                                            <span>Name</span>
                                            <span>Designer</span>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={auth.signOut}
                                            >
                                                sign-out
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        }
                    </div>
                </StyledToolbar>
                <SignInDialog
                    open={this.state.signInDialogVisible}
                    onClose={this.signInDialogClose}
                    onSignIn={this.signIn}
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
        justify-content: flex-end;
    }
`;
