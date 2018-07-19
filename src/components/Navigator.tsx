import React, { Fragment } from "react";
import {
    Checkbox,
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
    withTheme,
} from "@material-ui/core";
import {
    ColorLens   as ColorLensIcon,
    ExpandLess  as ExpandLessIcon,
    ExpandMore  as ExpandMoreIcon,
    NewReleases as NewReleasesIcon,
    Star        as StarIcon
} from "@material-ui/icons";
import gql                           from "graphql-tag";
import * as H                        from "history";
import { Query }                     from "react-apollo";
import styled                        from "styled-components";
import deduplicationFromArray        from "../util/deduplicationFromArray";
import formatTagsOfURLQueryParam     from "../util/formatTagsOfURLQueryParam";
import getTagsByURLQueryParam        from "../util/getTagsByURLQueryParam";
import isSubset                      from "../util/isSubset";
import { PopularTags }               from "../graphQL/type";
import { NotificationListenerProps } from "./wrapper/NotificationListener";
import GraphQLProgress               from "./GraphQLProgress";
import Link                          from "./Link";

interface Props extends NotificationListenerProps {
    history: H.History;
}

interface State {
    tagListVisible: boolean;
    tags: string[];
}

const QueryListPopularTags = gql(`
    query {
        listPopularTags {
            name
            count
        }
    }
`);

export default class extends React.Component<Props, State> {

    state = {
        tags:  getTagsByURLQueryParam(this.props.history),
        tagListVisible:  getTagsByURLQueryParam(this.props.history).length !== 0
    };

    componentDidMount() {
    }

    toggleTagListVisible = () => this.setState({ tagListVisible: !this.state.tagListVisible });

    getSnapshotBeforeUpdate() {
        const tags = getTagsByURLQueryParam(this.props.history);
        if (!isSubset(tags, this.state.tags))
            this.setState({ tags: deduplicationFromArray(this.state.tags.concat(tags)) });
        return null;
    }

    componentDidUpdate() {}

    render() {
        const {
            history,
            notificationListener
        } = this.props;

        return (
            <Host>
                <Title variant="headline">
                    PORTAL
                </Title>
                <Divider />
                <List
                    subheader={<ListSubheader component="div">Works</ListSubheader>}
                >
                    <Link
                        to="/works/popular"
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/popular"}
                                    >
                                        Popular
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <Link
                        to="/works/new"
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <NewReleasesIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <StyledText
                                        selected={history.location.pathname === "/works/new"}
                                    >
                                        New
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <ListItem
                        button
                        onClick={this.toggleTagListVisible}
                    >
                        <ListItemIcon>
                            <ColorLensIcon />
                        </ListItemIcon>
                        <ListItemText primary="Tags" />
                        {this.state.tagListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={this.state.tagListVisible} timeout="auto" unmountOnExit>
                        <Query
                            query={QueryListPopularTags}
                            fetchPolicy="cache-and-network"
                        >
                            {({ loading, error, data }) => {
                                if (loading) return <GraphQLProgress />;
                                if (error) {
                                    console.error(error);
                                    return (
                                        <Fragment>
                                            <div>?</div>
                                            <notificationListener.ErrorComponent error={error}/>
                                        </Fragment>
                                    );
                                }

                                const tags = getTagsByURLQueryParam(this.props.history);
                                const popularTags = (data.listPopularTags as PopularTags).map(x => x.name);

                                return (
                                    <List component="div" disablePadding>
                                        {popularTags.concat(this.state.tags)
                                            .filter((x, i, self) => self.indexOf(x) === i)
                                            .map(tag => (
                                                <Link
                                                    to={
                                                        (location.pathname.indexOf("/works") === -1 ? "/works" : "")
                                                      + formatTagsOfURLQueryParam(
                                                            tags.includes(tag) ? tags.filter(x => x !== tag)
                                                          :                      tags.concat(tag)
                                                        )
                                                    }
                                                    key={tag}
                                                >
                                                    <NestedListItem button>
                                                        <ListItemText
                                                            primary={<span>{tag}</span>}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Checkbox
                                                                checked={tags.includes(tag)}
                                                                tabIndex={-1}
                                                                disableRipple
                                                            />
                                                        </ListItemSecondaryAction>
                                                    </NestedListItem>
                                                </Link>
                                            )
                                        )}
                                    </List>
                                );
                            }}
                        </Query>
                    </Collapse>
                </List>
                <List
                    subheader={<ListSubheader component="div">Designer</ListSubheader>}
                >
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="Popular" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <NewReleasesIcon />
                        </ListItemIcon>
                        <ListItemText primary="New" />
                    </ListItem>
                </List>
            </Host>
        );
    }
}

const Host = styled.div`
    width: 15rem;
`;

const Title = styled(Typography)`
    padding-top: 2.5rem;
    padding-bottom: .5rem;
    text-align: center;
    letter-spacing: .4rem;
`;

const NestedListItem = styled(ListItem)`
    && {
        padding-left: 2rem;
    }
`;

const StyledSpan = styled.span`
    border-top: 1px;
    color: ${(props: any) => props.selected ? props.theme.palette.primary.main : "black"};
`;

const StyledText = withTheme()(
    (props: any) => <StyledSpan {...props}/>
);
