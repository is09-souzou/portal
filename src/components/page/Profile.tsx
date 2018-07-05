import React, { Fragment } from "react";
import {
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    TextField,
    Typography,
    DialogContent,
    DialogActions,
    LinearProgress
} from "@material-ui/core";
import gql                 from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import styled              from "styled-components";
import createSignedUrl        from "../../api/createSignedUrl";
import fileUploadToS3         from "../../api/fileUploadToS3";
import { PageComponentProps } from "../../App";
import GraphQLProgress        from "../GraphQLProgress";
import Header                 from "../Header";
import ImageInput             from "../ImageInput";
import NotFound               from "../NotFound";
import Page                   from "../Page";

type Item = "displayName" | "email" | "career" | "message" | "avatarUri" | "settingEmail";

interface State {
    whileEditingItem: Item[];
    editableAvatarDialogIsVisible: boolean;
    uploadingAvatarImage: boolean;
}

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

const MutationUpdateUser = gql(`
    mutation updateUser(
        $user: UserUpdate!
    ) {
        updateUser(
            user: $user
        ) {
            id
        }
    }
`);

export default class extends React.Component<PageComponentProps<{}>, State> {

    displayNameInput?: any;
    emailInput?      : any;
    careerInput?     : any;
    messageInput?    : any;
    settingEmailInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            editableAvatarDialogIsVisible: false,
            uploadingAvatarImage: false
        });
    }

    addWhileEditingItem = (item: Item) => (
        () => (
            !this.state.whileEditingItem.includes(item)
         && this.setState({ whileEditingItem: this.state.whileEditingItem.concat(item) })
        )
    )

    callUpdateUser = async (updateUser: Function, item: Item, value: any) => {
        try {
            await updateUser({
                variables: {
                    user: {
                        [item]: value,
                        id: this.props.auth.token!.payload.sub,
                    }
                },
                optimisticResponse: {
                    __typename: "Mutation",
                    updateUser: {
                        id: this.props.auth.token!.payload.sub,
                        __typename: "User"
                    }
                },
            });
            this.setState({ whileEditingItem: this.state.whileEditingItem.filter(x => x !== item) });
        } catch (err) {
            this.props.notificationListener.errorNotification(err);
        }
    }

    openEditableAvatarDialog = () => this.setState({ editableAvatarDialogIsVisible: true });

    closeEditableAvatarDialog = () => this.setState({ editableAvatarDialogIsVisible: false });

    render() {
        const {
            auth,
            history,
            notificationListener
        } = this.props;

        if (!auth.token) {
            history.push("?sign-up=true");
            return "";
        }

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryGetUser}
                    variables={{ id: auth.token!.payload.sub }}
                    fetchPolicy="cache-and-network"
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return <GraphQLProgress />;
                        if (error) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <div>cry；；</div>
                                    <notificationListener.ErrorComponent error={error}/>
                                </Fragment>
                            );
                        }

                        if (!data.getUser)
                            return  <NotFound />;

                        const currentUser = data.getUser;

                        return (
                            <Mutation
                                mutation={MutationUpdateUser}
                            >
                                {(updateUser) => (
                                    <Content>
                                        <div>
                                            <UserAvatar
                                                src={currentUser.avatarUri}
                                                onClick={this.openEditableAvatarDialog}
                                            />
                                            <div>
                                                <TextField
                                                    label="DisplayName"
                                                    margin="normal"
                                                    InputProps={{
                                                        endAdornment: (
                                                            this.state.whileEditingItem.includes("displayName")
                                                            && <Button
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onClick={() =>
                                                                    this.callUpdateUser(
                                                                        updateUser,
                                                                        "displayName",
                                                                        this.displayNameInput.value
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                        )
                                                    }}
                                                    onChange={this.addWhileEditingItem("displayName")}
                                                    defaultValue={currentUser.displayName}
                                                    fullWidth
                                                    required
                                                    // tslint:disable-next-line:jsx-no-lambda
                                                    inputRef={x => this.displayNameInput = x}
                                                />
                                                <TextField
                                                    id="profile-email"
                                                    label="Mail Address"
                                                    margin="normal"
                                                    InputProps={{
                                                        endAdornment: (
                                                            this.state.whileEditingItem.includes("email")
                                                            && <Button
                                                                // tslint:disable-next-line:jsx-no-lambda
                                                                onClick={() =>
                                                                    this.callUpdateUser(
                                                                        updateUser,
                                                                        "email",
                                                                        this.emailInput.value
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                        )
                                                    }}
                                                    type="email"
                                                    onChange={this.addWhileEditingItem("email")}
                                                    defaultValue={currentUser.email}
                                                    fullWidth
                                                    // tslint:disable-next-line:jsx-no-lambda
                                                    inputRef={x => this.emailInput = x}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <TextField
                                                id="profile-career"
                                                label="Career"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("career")
                                                        && <Button
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() =>
                                                                this.callUpdateUser(
                                                                    updateUser,
                                                                    "career",
                                                                    this.careerInput.value
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }}
                                                onChange={this.addWhileEditingItem("career")}
                                                defaultValue={currentUser.career}
                                                multiline
                                                rows={4}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                inputRef={x => this.careerInput = x}
                                            />
                                            <TextField
                                                id="profile-message"
                                                label="Message"
                                                margin="normal"
                                                InputProps={{
                                                    endAdornment: (
                                                        this.state.whileEditingItem.includes("message")
                                                        && <Button
                                                            // tslint:disable-next-line:jsx-no-lambda
                                                            onClick={() =>
                                                                this.callUpdateUser(
                                                                    updateUser,
                                                                    "message",
                                                                    this.messageInput.value
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    )
                                                }}
                                                onChange={this.addWhileEditingItem("message")}
                                                defaultValue={currentUser.message}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                inputRef={x => this.messageInput = x}
                                            />
                                        </div>
                                        <Dialog
                                            open={this.state.editableAvatarDialogIsVisible}
                                            onClose={this.closeEditableAvatarDialog}
                                            aria-labelledby="editable-avatar-dialog-title"
                                        >
                                            <form
                                                // tslint:disable-next-line:jsx-no-lambda
                                                onSubmit={async e => {
                                                    e.preventDefault();
                                                    const image = (e.target as any).elements["avatar-image"].files[0];

                                                    try {
                                                        this.setState({ uploadingAvatarImage: true });
                                                        const {
                                                            signedUrl,
                                                            uploadedUrl
                                                        } = await createSignedUrl({
                                                            jwt: auth.token!.jwtToken,
                                                            userId: auth.token!.payload.sub,
                                                            type: "profile",
                                                            mimetype: image.type
                                                        });

                                                        await Promise.all([
                                                            fileUploadToS3({
                                                                url: signedUrl,
                                                                file: image
                                                            }),
                                                            updateUser({
                                                                variables: {
                                                                    user: {
                                                                        avatarUri: uploadedUrl,
                                                                        id: this.props.auth.token!.payload.sub,
                                                                    }
                                                                },
                                                                optimisticResponse: {
                                                                    __typename: "Mutation",
                                                                    updateUser: {
                                                                        id: this.props.auth.token!.payload.sub,
                                                                        __typename: "User"
                                                                    }
                                                                },
                                                            })
                                                        ]);

                                                        refetch();
                                                        this.setState({ uploadingAvatarImage: false });

                                                        this.closeEditableAvatarDialog();
                                                    } catch (e) {
                                                        this.setState({ uploadingAvatarImage: false });
                                                        notificationListener.errorNotification(e);
                                                    }
                                                }}
                                            >
                                                <DialogTitle
                                                    id="editable-avatar-dialog-title"
                                                >
                                                    Upload Avatar
                                                </DialogTitle>
                                                <DialogContent>
                                                    <ImageInput
                                                        name="avatar-image"
                                                        width="256"
                                                        height="256"
                                                    />
                                                </DialogContent>
                                                {this.state.uploadingAvatarImage && <LinearProgress/>}
                                                <DialogActions>
                                                    <Button
                                                        onClick={this.closeEditableAvatarDialog}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        component="button"
                                                        color="primary"
                                                        type="submit"
                                                    >
                                                        Submit
                                                    </Button>
                                                </DialogActions>
                                            </form>
                                        </Dialog>
                                    </Content>
                                )}
                            </Mutation>
                        );
                    }}
                </Query>
                <StyledSetting>
                    <div>
                        <form
                            // tslint:disable-next-line:jsx-no-lambda
                            onSubmit={async e => {
                                e.preventDefault();

                                const email = (e.target as any).elements["setting-email"].value;

                                try {
                                    await this.props.auth.updateEmail(email);
                                    notificationListener.notification("info", "Send Mail");
                                } catch (e) {
                                    notificationListener.errorNotification(e);
                                    return;
                                }
                            }}
                        >
                            <Typography gutterBottom variant="headline">
                                Setting
                            </Typography>
                            <TextField
                                id="setting-email"
                                label="Mail Address"
                                margin="normal"
                                InputProps={{
                                    endAdornment: (
                                        this.state.whileEditingItem.includes("settingEmail")
                                        &&
                                        <Button
                                            type="submit"
                                        >
                                            Update
                                        </Button>
                                    )
                                }}
                                type="email"
                                onChange={this.addWhileEditingItem("settingEmail")}
                                fullWidth
                                // tslint:disable-next-line:jsx-no-lambda
                                inputRef={x => this.settingEmailInput = x}
                            />
                        </form>
                    </div>
                </StyledSetting>
            </Page>
        );
    }
}

const Content = styled.form`
    max-width: 40rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    > :nth-child(1) {
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 1rem;
        @media (max-width: 768px) {
            flex-direction: column;
        }
        > :nth-child(2) {
            flex-grow: 1;
        }
    }
    > :nth-child(2) {
        display: flex;
        flex-direction: column;
    }
    @media (max-width: 768px) {
        width: unset;
        margin: 0 4rem;
    }
`;

const StyledSetting = styled.div`
    max-width: 40rem;
    padding-top: 4rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`;

const UserAvatar = styled(Avatar)`
    && {
        cursor: pointer;
        border: 1px solid #ccc;
        width: 8rem;
        height: 8rem;
        margin: 1rem 4rem 0 1rem;
    }
`;
