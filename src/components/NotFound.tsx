import React          from "react";
import { Typography } from "@material-ui/core";
import styled         from "styled-components";

const messages = ["(＝△＝)", "(´・ω・`)", "(＿´Д｀)", "(= ‐ω‐ =)", "(*ノω・*)"];

export default (props: React.HTMLAttributes<HTMLDivElement>) => (
    <Host {...props}>
        <Typography
            variant="display4"
        >
            {messages[Math.floor(Math.random() * messages.length)]}
        </Typography>
        <Typography
            variant="display3"
        >
            Not Found
        </Typography>
    </Host>
);

const Host = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
`;
