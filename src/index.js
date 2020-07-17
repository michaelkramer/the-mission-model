import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "react-jss";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { FirebaseProvider } from "./components/Firebase";
import { Theme } from "./components/Style";

import "./index.css";
ReactDOM.render(
  <FirebaseProvider>
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </FirebaseProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
