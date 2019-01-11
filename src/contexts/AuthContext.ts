import {
    CognitoIdToken,
    CognitoUser,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import { createContext } from "react";

export interface Token {
    jwtToken: string;
    payload: {
        [id: string]: any;
    };
}

export type SingIn = (email: string, password: string) => Promise<Token>;
export type SingUp = (userName: string, password: string, attribute?: {[key: string]: string}) => Promise<string>;
export type SingOut = () => Promise<void>;
export type UpdateEmail = (email: string) => Promise<void>;
export type UpdatePassword = (password: string, newPassword: string) => Promise<void>;

export type AuthValue = {
    signIn: SingIn;
    signUp: SingUp;
    signOut: SingOut;
    updateEmail: UpdateEmail;
    updatePassword: UpdatePassword;
    token: Token | null;
    idToken?: CognitoIdToken;
    cognitoUser?: CognitoUser | null;
    cognitoUserPool?: CognitoUserPool;
};

// It is declared by React Component
// To make the compilation successful, temporary values ​​are included
export default createContext<AuthValue>({
    signIn: () => new Promise(() => undefined),
    signUp: () => new Promise(() => undefined),
    signOut: () => new Promise(() => undefined),
    updateEmail: () => new Promise(() => undefined),
    updatePassword: () => new Promise(() => undefined),
    token: null,
    idToken: undefined,
    cognitoUser: undefined,
    cognitoUserPool: undefined,
});
