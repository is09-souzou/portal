import React from "react";
import styled from "styled-components";
import {
    Button,
    Chip,
    TextField,
} from "@material-ui/core";
import ImageInput from "../ImageInput";
import { Mutation } from "react-apollo";
import { PageComponentProps } from "../../App";
import createSignedUrl from "../../api/createSignedUrl";
import fileUploadToS3  from "../../api/fileUploadToS3";
import Header from "../Header";
import Page from "../Page";
import gql from "graphql-tag";

interface Chip {
    key  : string;
    label: string;
}

interface State {
    chipsData: Chip[];
}

const MutationCreateWork = gql(`
    mutation createWork(
        $work: WorkCreate!
    ) {
        createWork(
            work: $work
        ) {
            id
            description
            userId
            title
            tags
            imageUri
            createdAt
        }
    }
`);

const MutationUpdateWork = gql(`
    mutation updateWork(
        $work: WorkUpdate!
    ) {
        createWork(
            work: $work
        ) {
            id
            description
            userId
            title
            tags
            imageUri
            createdAt
        }
    }
`);

export default class extends React.Component<PageComponentProps<void>, State> {

    componentWillMount() {
        this.setState({
            chipsData: [],
        });
    }

    deleteChip = (data: Chip) => () => this.setState({
        chipsData: this.state.chipsData.filter((x: Chip): boolean => data.key !== x.key)
    })

    tagInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (this.state.chipsData.length >= 5)
            return e.preventDefault();

        const inputValue = (e.target as any).value;
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            if (inputValue.length > 1) {
                if (!this.state.chipsData.some(x => x.label === inputValue))
                    this.setState({
                        chipsData: this.state.chipsData.concat({
                            key: (e.target as any).value,
                            label: (e.target as any).value
                        })
                    });

                (e.target as any).value = "";
            }
        }
    }

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
                <Mutation mutation={MutationCreateWork} refetchQueries={[]}>
                    {createWork => (
                        <Mutation mutation={MutationUpdateWork} refetchQueries={[]}>
                            {updateWork => (
                                <Host
                                    // tslint:disable-next-line jsx-no-lambda
                                    onSubmit={async e => {
                                        e.preventDefault();

                                        const title = (e.target as any).elements["title"].value;
                                        const description = (e.target as any).elements["description"].value;
                                        const image = (e.target as any).elements["mainImage"].files[0];
                                        const results = await Promise.all([
                                            createWork({
                                                variables: {
                                                    work: {
                                                        title,
                                                        description,
                                                        userId: auth.token!.payload.sub,
                                                        tags: this.state.chipsData.map(x => x.label),
                                                        // tslint:disable-next-line:max-line-length
                                                        imageUri: "https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"
                                                    }
                                                },
                                                optimisticResponse: {
                                                    __typename: "Mutation",
                                                    createWork: {
                                                        title,
                                                        description,
                                                        id: "new",
                                                        userId: auth.token!.payload.sub,
                                                        tags: this.state.chipsData.map(x => x.label),
                                                        createdAt: +new Date(),
                                                        __typename: "Work"
                                                    }
                                                }
                                            }),
                                            createSignedUrl({
                                                jwt: auth.token!.jwtToken,
                                                userId: auth.token!.payload.sub,
                                                type: "work",
                                                mimetype: image.type
                                            })
                                        ]);

                                        const {
                                            signedUrl,
                                            uploadedUrl
                                        } = results[1];

                                        await fileUploadToS3({
                                            url: signedUrl,
                                            file: image
                                        });

                                        await updateWork({
                                            variables: {
                                                work: {
                                                    imageUri: uploadedUrl
                                                }
                                            },
                                            optimisticResponse: {
                                                __typename: "Mutation",
                                                updateWork: {
                                                    title,
                                                    description,
                                                    id: "new",
                                                    userId: auth.token!.payload.sub,
                                                    tags: this.state.chipsData.map(x => x.label),
                                                    imageUri: uploadedUrl,
                                                    createdAt: +new Date(),
                                                    __typename: "Work"
                                                }
                                            }
                                        });
                                    }}
                                >
                                    <div>
                                        <TextField
                                            id="title"
                                            label="Title"
                                            margin="normal"
                                            fullWidth
                                        />
                                        <ImageSelectArea>
                                            <ImageInput
                                                labelText="upload image"
                                                name="mainImage"
                                                width="544"
                                                height="368"
                                            />
                                            <div>
                                                <ImageInput
                                                    name="subImage1"
                                                    width="176"
                                                    height="104"
                                                />
                                                <ImageInput
                                                    name="subImage2"
                                                    width="176"
                                                    height="104"
                                                />
                                                <ImageInput
                                                    name="subImage3"
                                                    width="176"
                                                    height="104"
                                                />
                                            </div>
                                        </ImageSelectArea>
                                        <TextField
                                            id="description"
                                            label="Description"
                                            multiline
                                            rows="8"
                                            margin="normal"
                                            fullWidth
                                        />
                                        <div>
                                            <TextField
                                                placeholder="tags"
                                                onKeyDown={this.tagInputKeyDown}
                                                inputProps={{
                                                    maxLength: 10,
                                                }}
                                            />
                                            {this.state.chipsData.map(data =>
                                                <Chip
                                                    key={data.key}
                                                    clickable={false}
                                                    label={data.label}
                                                    onDelete={this.deleteChip(data)}
                                                />
                                            )}
                                        </div>
                                        <ActionArea>
                                            <div/>
                                            <Button
                                                type="submit"
                                                component="button"
                                                variant="raised"
                                                color="primary"
                                            >
                                                create
                                            </Button>
                                        </ActionArea>
                                    </div>
                                </Host>
                            )}
                        </Mutation>
                    )}
                </Mutation>
            </Page>
        );
    }
}

const Host = styled.form`
    margin: 5rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const ImageSelectArea = styled.div`
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    @media (max-width: 768px) {
        flex-direction: column;
    }
    > :last-child {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        @media (max-width: 768px) {
            width: 100%;
            margin-left: 0rem;
            flex-direction: row;
            justify-content: space-between;
        }
    }
`;

const ActionArea = styled.div`
    display: flex;
    > :first-child {
        flex-grow: 1
    }
`;
