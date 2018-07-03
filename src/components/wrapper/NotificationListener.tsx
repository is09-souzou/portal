import React, { ReactNode, Fragment } from "react";
import NotificationComponent          from "../Notification";

export type Notification = (type: "info" | "error", message: string) => void;
export type ErrorNotification = (error: Error) => void;
export type NotificationListener = {
    ErrorComponent   : any,
    notification     : Notification,
    errorNotification: ErrorNotification
};

export interface NotificationListenerProps {
    notificationListener: NotificationListener;
}

interface Props {
    render: (notificationListener: NotificationListenerProps) => ReactNode;
}

interface State {
    notifications: {
        type: "info" | "error",
        message: string,
        key: number
    }[];
}

export default class extends React.Component<Props, State> {

    onCloseByKey = (key: number) => () => this.setState({
        notifications: this.state.notifications.filter(y => key !== y.key)
    })

    componentWillMount() {
        this.setState({
            notifications: []
        });
    }

    render() {

        const {
            children,
            render,
            ...props
        } = this.props;

        return (
            <Fragment>
                {render({
                    notificationListener: {
                        ErrorComponent: (props: any) => <NotificationComponent type="error" {...props}/>,
                        notification: (type, message) => {
                            this.setState({
                                notifications: this.state.notifications.concat({
                                    type,
                                    message,
                                    key  : Date.now()
                                })
                            });
                        },
                        errorNotification: (error: Error) => {
                            const message = (
                                error instanceof Response ?
                                    error.status === 400 ? "不正なリクエスト(400)"
                                  : error.status === 401 ? "再ログインしてください(401)"
                                  : error.status === 403 ? "権限がありません(403)"
                                  : error.status === 404 ? "リソースが見つかりません(404)"
                                  : error.status === 405 ? "許可されてない操作です(405)"
                                  : error.status === 500 ? "サーバーエラー(500)"
                                  : error.status === 501 ? "開発中です(501)"
                                  : error.status === 502 ? "開発中です(502)"
                                  : error.status === 503 ? "機能メンテナンス中です(503)"
                                  : error.status === 504 ? "サーバーエラー(504)"
                                  :                        "不明なエラーが発生しました。"
                              : error.message
                            );

                            this.setState({
                                notifications: this.state.notifications.concat({
                                    message,
                                    type: "error",
                                    key  : Date.now()
                                })
                            });
                        },
                    },
                    ...props
                })}
                {this.state.notifications.map(x =>
                    <NotificationComponent
                        type={x.type}
                        key={x.key}
                        message={x.message}
                        open={true}
                        onClose={this.onCloseByKey(x.key)}
                    />
                )}
            </Fragment>
        );
    }
}
