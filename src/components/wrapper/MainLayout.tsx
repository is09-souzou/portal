import React from "react";
import styled from "styled-components";
import { Drawer } from "@material-ui/core";
import Navigator from "./../Navigator";
import { RouteComponentProps } from "react-router-dom";

interface State {
    drawerOpend: boolean;
    fabIsVisible: boolean;
    fabClickSubscribers: { key: number; fn: (e: any) => void; }[];
    fabIcon: React.ReactNode;
}

interface Props extends RouteComponentProps<{}> {
    render: (mainLayoutEventProps: MainLayoutEventProps) => React.ReactNode;
}

export interface MainLayoutEventProps {
}

interface DrawerContextModel {
    toggleDrawer: () => void;
}

export const DrawerContext = React.createContext<DrawerContextModel>({
    toggleDrawer: () => undefined
});

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            drawerOpend: false,
            fabIsVisible: true,
            fabClickSubscribers: []
        });
    }

    toggleDrawer = () => this.setState({ drawerOpend: !this.state.drawerOpend });

    render() {

        const {
            history,
            render
        } = this.props;

        return (
            <Host>
                <div>
                    <Drawer
                        variant="temporary"
                        anchor={"left"}
                        open={this.state.drawerOpend}
                        onClose={this.toggleDrawer}
                        ModalProps={{ keepMounted: true }}
                    >
                        <Navigator
                            histroy={history}
                        />
                    </Drawer>
                </div>
                <div>
                    <Drawer
                        variant="permanent"
                        open
                    >
                        <Navigator
                            histroy={history}
                        />
                    </Drawer>
                </div>
                <Content>
                    <DrawerContext.Provider
                        value={{
                            toggleDrawer: this.toggleDrawer
                        }}
                    >
                        <Main>
                            {render({})}
                        </Main>
                    </DrawerContext.Provider>
                </Content>
            </Host>
        );
    }
}

const Host = styled.div`
    background-color: #fafbfd;
    > :nth-child(1) {
        display: none;
    }
    > :nth-child(2) {
        display: flex;
    }

    @media (max-width: 767px) {
        > :nth-child(1) {
            display: flex;
        }
        > :nth-child(2) {
            display: none;
        }
    }
`;

const Content = styled.div`
    position: relative;
    width: calc(100% - 15rem);
    margin-left: 15rem;
    @media (max-width: 767px) {
        width: 100%;
        margin-left: 0rem;
    }
`;

const Main = styled.main`
    min-height: calc(100vh - 7rem);
    height: 100%;
`;
