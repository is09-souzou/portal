import React, { Fragment } from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import gql                from "graphql-tag";
import styled             from "styled-components";
import { Query }          from "react-apollo";
import { PageComponentProps } from "./../../App";
import Fab                    from "../Fab";
import Header                 from "../Header";
import Page                   from "../Page";
import LearnMoreDialog from "../LearnMoreDialog";

interface SelectedWork {
    title: string;
    imagePath: string[];
}

interface State {
    userMenuAnchorEl?: boolean;
    userMenuOpend: boolean;
    learnMoreDialogOpend: boolean;
    selectedWork: SelectedWork;
}

const QueryListWorks = gql(`
    query($limit: Int, $exclusiveStartKey: ID, $option: WorkQueryOption) {
        listWorks (
            limit: $limit,
            exclusiveStartKey: $exclusiveStartKey,
            option: $option
        ) {
            items {
                id
                userId
                title
                tags
                imageUri
                description
            }
            exclusiveStartKey
        }
    }
`);

export default class extends React.Component<PageComponentProps<{}>, State> {

    componentWillMount() {
        this.setState({
            userMenuAnchorEl: undefined,
            userMenuOpend: false,
            learnMoreDialogOpend: false,
            selectedWork: {
                title: "",
                imagePath: [],
            },
        });
    }

    handleClickOpen = (y: SelectedWork) => () => {
        this.setState({
            learnMoreDialogOpend: true,
            selectedWork: {
                title: y.title,
                imagePath: y.imagePath,
            },
        });
    }

    handleClose = () => this.setState({ learnMoreDialogOpend: false });

    render() {

        const {
            auth,
            history,
            notificationListener,
        } = this.props;

        const images :{title:string, imagePath:string[]}[] = [
            {
                title: "abc",
                imagePath: [
                    "http://placehold.jp/24/F44336/fff/600x400.png",
                    "http://placehold.jp/24/E91E63/fff/600x400.png",
                    "http://placehold.jp/24/9C27B0/fff/600x400.png",
                    "http://placehold.jp/24/673AB7/fff/600x400.png",
                ],
            },
            {
                title: "def",
                imagePath: [
                    "http://placehold.jp/24/3F51B5/fff/600x400.png",
                    "http://placehold.jp/24/2196F3/fff/600x400.png",
                    "http://placehold.jp/24/03A9F4/fff/600x400.png",
                    "http://placehold.jp/24/00BCD4/fff/600x400.png",
                ],
            },
            {
                title: "ghi",
                imagePath: [
                    "http://placehold.jp/24/009688/fff/600x400.png",
                    "http://placehold.jp/24/4CAF50/fff/600x400.png",
                    "http://placehold.jp/24/8BC34A/fff/600x400.png",
                    "http://placehold.jp/24/CDDC39/fff/600x400.png",
                ],
            },
            {
                title: "jkl",
                imagePath: [
                    "http://placehold.jp/24/FFEB3B/fff/600x400.png",
                    "http://placehold.jp/24/FFC107/fff/600x400.png",
                    "http://placehold.jp/24/FF9800/fff/600x400.png",
                    "http://placehold.jp/24/FF5722/fff/600x400.png",
                ],
            },
            {
                title: "mno",
                imagePath: [
                    "http://placehold.jp/24/795548/fff/600x400.png",
                    "http://placehold.jp/24/9E9E9E/fff/600x400.png",
                ],
            },
        ];

        return (
            <Page>
                <Header
                    auth={auth}
                    history={history}
                    notificationListener={notificationListener}
                />
                <Query
                    query={QueryListWorks}
                    variables={{
                        limit: 12,
                        exclusiveStartKey: null,
                        option: {
                        }
                    }}
                >
                    {({ loading, error, data }) => {
                        if (loading) return "loading..." ;
                        if (error) {
                            console.error(error);
                            return (
                                <Fragment>
                                    <div>error</div>
                                    <notificationListener.ErrorComponent message={error.message} key="error"/>
                                </Fragment>
                            );
                        }
                        return(
                            <Host>
                                {data.listWorks.items.map((x: any) =>
                                    <StyledCard key={x.id}>
                                        <StyledCardMedia
                                            id={x.id}
                                            // tslint:disable-next-line:max-line-length
                                            image={(x.imageUri && x.imageUri.length !== 0) ? x.imageUri[0] : "https://s3-ap-northeast-1.amazonaws.com/is09-portal-image/system/broken-image.png"}
                                            title={x.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                Lizard
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                            Share
                                            </Button>
                                            <Button size="small" color="primary">
                                            Learn More
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                )}
                            </Host>
                        );
                    }}
                </Query>
                <Fab
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => history.push("/works/create-work")}
                >
                    <AddIcon />
                </Fab>
            </Page>
        );
    }
}

const Host = styled.div`
    margin: 3rem;
    display: flex;
    flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
    && {
        margin: 1rem;
        min-width: 20rem;
        max-width: 30rem;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        :hover{
            box-shadow: 0 7px 14px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
        }
    }
`;

const StyledCardMedia = styled(CardMedia)`
    && {
        height: 0;
        padding-top: 56.25%;
    }
`;
