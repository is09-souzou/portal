
import React from "react";
import { withRouter } from "react-router-dom";
import RouterHistoryContext from "src/contexts/RouterHistoryContext";

export default withRouter(
    ({
        history,
        match,
        ...props
    }) => (
        <RouterHistoryContext.Provider
            value={{ history, match }}
            {...props}
        />
    )
);
