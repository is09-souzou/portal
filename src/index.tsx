import React from "react";
import ReactDOM from "react-dom";
import App from "src/App";

console.log(
    `
%c\n  (＼_(＼ \t ╔═╗┌─┐┬─┐┌┬┐┌─┐┬
  （ =･ω･）\t ╠═╝│ │├┬┘ │ ├─┤│
.c(,_ｕｕﾉ\t ╩  └─┘┴└─ ┴ ┴ ┴┴─┘
%c%c
created by: https://github.com/is09-souzou
portal-web: https://github.com/is09-souzou/portal-web
NODE_ENV  : ${process.env.NODE_ENV}
VERSION   : ${process.env.VERSION}`,
    "color:#ff9100;font-size:24px;line-height:24px;",
    "",
    "color:#bbb;"
);
ReactDOM.render(<App/>, document.getElementById("root"));
