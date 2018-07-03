import React from "react";
import {
    Collapse,
    Divider,
    List,
    ListItem,
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
import styled from "styled-components";
import Link from "./Link";

interface Props {
    histroy: any;
}

interface State {
    worksTypeListVisible: boolean;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            worksTypeListVisible: false
        });
    }

    toggleWorksTypeListVisible = () => this.setState({ worksTypeListVisible: !this.state.worksTypeListVisible });

    render() {
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
                                        selected={this.props.histroy.location.pathname === "/works/popular"}
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
                                        selected={this.props.histroy.location.pathname === "/works/new"}
                                    >
                                        New
                                    </StyledText>
                                }
                            />
                        </ListItem>
                    </Link>
                    <ListItem
                        button
                        onClick={this.toggleWorksTypeListVisible}
                    >
                        <ListItemIcon>
                            <ColorLensIcon />
                        </ListItemIcon>
                        <ListItemText primary="Designer" />
                        {this.state.worksTypeListVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={this.state.worksTypeListVisible} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <Link
                                to="/works/type1"
                            >
                                <NestedListItem button>
                                    <ListItemText
                                        primary={
                                            <StyledText
                                                selected={this.props.histroy.location.pathname === "/works/type1"}
                                            >
                                                type1
                                            </StyledText>
                                        }
                                    />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type2"
                            >
                                <NestedListItem button>
                                    <ListItemText
                                        primary={
                                            <StyledText
                                                selected={this.props.histroy.location.pathname === "/works/type2"}
                                            >
                                                type2
                                            </StyledText>
                                        }
                                    />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type3"
                            >
                                <NestedListItem button>
                                    <ListItemText
                                        primary={
                                            <StyledText
                                                selected={this.props.histroy.location.pathname === "/works/type3"}
                                            >
                                                type3
                                            </StyledText>
                                        }
                                    />
                                </NestedListItem>
                            </Link>
                            <Link
                                to="/works/type4"
                            >
                                <NestedListItem button>
                                    <ListItemText
                                        primary={
                                            <StyledText
                                                selected={this.props.histroy.location.pathname === "/works/type4"}
                                            >
                                                type4
                                            </StyledText>
                                        }
                                    />
                                </NestedListItem>
                            </Link>
                        </List>
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
        padding-left: 3rem;
    }
`;

const StyledSpan = styled.span`
    border-top: 1px;
    color: ${(props: any) => props.selected ? props.theme.palette.primary.main : "black"};
`;

const StyledText = withTheme()(
    (props: any) => <StyledSpan {...props}/>
);
