import React                 from "react";
import { Route, RouteProps } from "react-router-dom";

export default (
    {
        component,
        path,
        ...props
    }: RouteProps
) => {
    const Component = component as React.ComponentClass<any>;
    return (
        <Route
            path={path}
            // tslint:disable-next-line:jsx-no-lambda
            render={x => <Component {...x} {...props} />}
        />
    );
};
