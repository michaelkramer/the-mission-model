import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import { createUseStyles, useTheme } from "react-jss";

import { Header, Footer } from "../Layout";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { AuthUserProvider } from "../Session";

const App = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <AuthUserProvider>
      <Router>
        <Layout className={classes.layout}>
          <Header />
          <Layout.Content className={classes.content}>
            <div className={classes.contentBody}>
              <Route exact path={ROUTES.LANDING} component={LandingPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />

              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForgetPage}
              />
              <Route path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.ACCOUNT} component={AccountPage} />
              <Route path={ROUTES.ADMIN} component={AdminPage} />
            </div>
          </Layout.Content>
          <Footer />
        </Layout>
      </Router>
    </AuthUserProvider>
  );
};

const useStyles = createUseStyles((_theme) => ({
  content: {
    padding: "0 50px",
    marginTop: "64px",
  },
  contentBody: {
    padding: "24px",
    backgroundColor: _theme.palette.white,
    minHeight: "30vh",
  },
}));
export default App;
