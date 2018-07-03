import React from "react";
import { createMuiTheme }   from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core";
import {
    BrowserRouter,
    withRouter,
    RouteComponentProps,
    match
} from "react-router-dom";
import Auth, { AuthProps }                                  from "./components/wrapper/Auth";
import AppSyncClient                                        from "./components/wrapper/AppSyncClient";
import MainLayout, { MainLayoutEventProps }                 from "./components/wrapper/MainLayout";
import NotificationListener, { NotificationListenerProps }  from "./components/wrapper/NotificationListener";
import CreateWorkPage                                       from "./components/page/CreateWorkPage";
import WorkPage                                             from "./components/page/WorkPage";
import ProfilePage                                          from "./components/page/Profile";
import UserListPage                                         from "./components/page/UserListPage";
import UserPage                                             from "./components/page/UserPage";
import ComposingRoute                                       from "./components/ComposingRoute";
import ComposingSwitch                                      from "./components/ComposingSwitch";

// tslint:disable-next-line:max-line-length
const Root = withRouter<RouteComponentProps<any> & { children: React.ReactElement<PageComponentProps<any>> }>((props: RouteComponentProps<any> & { children: React.ReactElement<PageComponentProps<any>> }) => (
    <NotificationListener
        // tslint:disable-next-line:jsx-no-lambda
        render={(notificationListener: NotificationListenerProps) =>
            <Auth
                // tslint:disable-next-line:jsx-no-lambda
                render={(authProps: AuthProps) => (
                    <AppSyncClient
                        {...authProps}
                    >
                        <MainLayout
                            // tslint:disable-next-line:max-line-length
                            render={(mainLayoutEventProps: MainLayoutEventProps) => React.cloneElement<PageComponentProps<any>>(
                                props.children,
                                {
                                    ...authProps,
                                    ...mainLayoutEventProps,
                                    ...notificationListener,
                                    ...(
                                        Object.entries(props)
                                            .filter(x => x[0] !== "children")
                                            .reduce((prev, next) => Object.assign(prev, { [next[0]]: next[1] }), {})
                                    )
                                }
                            )}
                            {...props}
                        />
                    </AppSyncClient>
                )}
            />
        }
    />
));

export default () => (
    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <Root>
                <ComposingSwitch>
                    <ComposingRoute
                        path="/"
                        component={WorkPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/works/create-work"
                        component={CreateWorkPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/works"
                        component={WorkPage}
                    />
                    <ComposingRoute
                        path="/users"
                        component={UserListPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/users/:id"
                        component={UserPage}
                        exact={true}
                    />
                    <ComposingRoute
                        path="/profile"
                        component={ProfilePage}
                        exact={true}
                    />
                </ComposingSwitch>
            </Root>
        </BrowserRouter>
    </MuiThemeProvider>
);

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#ffc246",
            main: "#ff9100",
            dark: "#c56200",
            contrastText: "#fff",
        },
    },
    overrides: {
        MuiDialog: {
            paper: {
                borderRadius: 8,
                border: 0,
                color: "white",
            },
        },
    },
});

// tslint:disable-next-line:max-line-length
export interface PageComponentProps<T> extends RouteComponentProps<T>, AuthProps, NotificationListenerProps, MainLayoutEventProps {
    computedMatch?: match<T>;
}
