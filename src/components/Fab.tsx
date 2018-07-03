import React from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

const Fab = styled(Button)`
    && {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 2rem;
    }
`;

export default (props: any) => <Fab color="primary" variant="fab" {...props}/>;
