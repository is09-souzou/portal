import React, { ReactNode } from "react";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import config from "./../../config";

interface Token {
    jwtToken: string;
    payload: {
        [id: string]: any;
    };
}

export type SingIn = (email: string, password: string) => Promise<Token>;
export type SingUp = (email: string, password: string, attribute?: {[key: string]: string}) => Promise<string>;
export type SingOut = () => Promise<void>;
export type UpdatePassword = (password: string, newPassword: string) => Promise<void>;

export type AuthProps = {
    auth: {
        signIn: SingIn;
        signUp: SingUp;
        signOut: SingOut;
        updatePassword: UpdatePassword;
        token: Token | null;
        cognitoUserPool?: CognitoUserPool | null;
    };
};

interface Props {
    render: (auth: AuthProps) => ReactNode;
}

interface State {
    cognitoUserPool: CognitoUserPool;
    token: Token | null;
    cognitoUser: CognitoUser | null;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {

        const cognitoUserPool = new CognitoUserPool(config.cognito);

        const cognitoUser = cognitoUserPool.getCurrentUser();

        this.setState({
            cognitoUser,
            cognitoUserPool,
            token: null
        });

        if (cognitoUser != null) {
            cognitoUser.getSession((err: any, session: any) => {
                if (err) {
                    throw err;
                }
                this.setState({
                    cognitoUser,
                    token: session.accessToken
                });
            });
        }
    }

    render() {

        const {
            render
        } = this.props;

        return render({
            auth: {
                signIn: (email: string, password: string) => new Promise((resolve, reject) => {
                    const authenticationDetails = new AuthenticationDetails({
                        Username: email,
                        Password: password
                    });
                    const cognitoUser = new CognitoUser({
                        Username: email,
                        Pool    : this.state.cognitoUserPool
                    });
                    this.setState({ cognitoUser });
                    cognitoUser.authenticateUser(
                        authenticationDetails,
                        {
                            onSuccess: result => {
                                const accessToken = result.getAccessToken();
                                const jwtToken = accessToken.getJwtToken();
                                const token = { jwtToken, payload: accessToken.decodePayload() };
                                resolve(token);
                                this.setState({ token });
                            },
                            onFailure: err => reject(err)
                        }
                    );
                }),
                signUp: (email, password, attribute) => new Promise((resolve, reject) => {
                    this.state.cognitoUserPool.signUp(
                        email,
                        password,
                        Object.entries(attribute || []).map(([Name, Value]) =>
                            new CognitoUserAttribute({ Name, Value })
                        ),
                        [],
                        (err?, result?) => {
                            if (err || !result) {
                                reject(err);
                                return;
                            }
                            resolve(result.userSub);
                        }
                    );
                }),
                signOut: () => new Promise((resolve, reject) => {
                    const cognitoUser = this.state.cognitoUser;
                    if (cognitoUser !== null) {
                        (cognitoUser as CognitoUser).globalSignOut({
                            onSuccess: () => {
                                this.setState({ token: null, cognitoUser: null });
                                resolve();
                            },
                            onFailure: err => {
                                this.setState({ token: null, cognitoUser: null });
                                reject(err);
                            }
                        });
                    }
                }),
                updatePassword: (password, newPassword) => new Promise((resolve, reject) =>
                    this.state.cognitoUser!.changePassword(
                        password,
                        newPassword,
                        (err, result) => (err || !result) ? reject(err) : resolve()
                    )
                ),
                token: this.state.token,
                cognitoUserPool: this.state.cognitoUserPool
            }
        });
    }
}
