import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "react-jss";
import { ConfigProvider } from "antd";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { FirebaseProvider } from "./components/Firebase";
import { Theme } from "./components/Style";

import "./index.less";

const antConfig = {
  //prefixCls: "tmm",
};

ReactDOM.render(
  <FirebaseProvider>
    <ConfigProvider {...antConfig}>
      <ThemeProvider theme={Theme}>
        <App />
      </ThemeProvider>
    </ConfigProvider>
  </FirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
