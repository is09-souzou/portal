import React, { Fragment } from "react";
import {
    Query,
    Mutation
} from "react-apollo";
import styled from "styled-components";
import {
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    TextField,
    DialogContent,
    DialogActions,
    LinearProgress
} from "@material-ui/core";
import { PageComponentProps } from "../../App";
import GraphQLProgress from "../GraphQLProgress";
import ImageInput from "../ImageInput";
import NotFound from "../NotFound";
import gql from "graphql-tag";
import createSignedUrl from "../../api/createSignedUrl";
import fileUploadToS3  from "../../api/fileUploadToS3";

type Item = "displayName" | "email" | "career" | "message" | "avatarUri";

interface State {
    whileEditingItem: Item[];
    userEditing: boolean;
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
    emailInput?: any;
    careerInput?: any;
    messageInput?: any;

    componentWillMount() {
        this.setState({
            whileEditingItem: [],
            userEditing: false,
            editableAvatarDialogIsVisible: false,
            uploadingAvatarImage: false
        });
    }

    componentDidMount() {
        this.props.fabApi.visible && this.props.fabApi.toHide();
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
            notificationListener
        } = this.props;

        if (!auth.token)
            return "";

        return (
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
                                <Host>
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
                                                required
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
                                                const image = (e.target as any).elements["avatarImage"].files[0];

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
                                            <DialogTitle id="editable-avatar-dialog-title">Upload Avatar</DialogTitle>
                                            <DialogContent>
                                                <ImageInput
                                                    name="avatarImage"
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
                                </Host>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

const Host = styled.form`
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

const UserAvatar = styled(Avatar)`
    && {
        cursor: pointer;
        border: 1px solid #ccc;
        width: 8rem;
        height: 8rem;
        margin: 1rem 4rem 0 1rem;
    }
`;
