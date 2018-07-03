import React, { ReactNode } from "react";
import { Switch }           from "react-router-dom";

interface Props {
    children: ReactNode;
}

export default (
    {
        children,
        ...props
    }: Props
) => (
    <Switch>
        {React.Children.toArray(children).map(
            (x: any) => React.cloneElement(
                x,
                {
                    ...props,
                    ...x.props
                }
            )
        )}
    </Switch>
);
