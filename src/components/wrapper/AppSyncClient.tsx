declare const require: any;
import React, { ReactChild } from "react";
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/pull/155
// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/48
const { Rehydrated }       = require("aws-appsync-react");
const { AUTH_TYPE }        = require("aws-appsync/lib/link/auth-link");
const { AWSAppSyncClient } = require("aws-appsync");
import { ApolloProvider }   from "react-apollo";
import config        from "../../config";
import { AuthProps } from "./Auth";

interface Props extends AuthProps {
    children: ReactChild;
}

interface State {
    client: any;
}

export default class extends React.Component<Props, State> {

    componentWillMount() {
        this.setState({
            client: new AWSAppSyncClient({
                url: config.appSync.graphqlEndpoint,
                region: config.appSync.region,
                auth: {
                    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
                    jwtToken: () => this.props.auth.token!.jwtToken
                }
            })
        });
    }

    render () {
        const {
            auth,
            children,
            ...props
        } = this.props;

        return (
            <ApolloProvider client={this.state.client}>
                <Rehydrated>
                    {children &&
                        React.cloneElement(
                            children as React.ReactElement<AuthProps>,
                            {
                                auth,
                                ...props
                            }
                        )
                    }
                </Rehydrated>
            </ApolloProvider>
        );
    }
}
