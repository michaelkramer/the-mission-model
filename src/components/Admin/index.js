import React from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { FirebaseProvider } from "../Firebase";
import { AuthUserProvider, withEmailVerification } from "../Session";

import UserList from "./UserList";
import UserDetail from "./UserDetail";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const condition = (authUser) =>
  authUser &&
  authUser.roles &&
  Object.values(authUser.roles).includes(ROLES.ADMIN);

const AdminPage = () => {
  const { authUser } = React.useContext(FirebaseProvider.context);
  const { authorization } = React.useContext(AuthUserProvider.context);
  const history = useHistory();
  if (!authorization(condition)) {
    history.push(ROUTES.SIGN_IN);
    return null;
  }
  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      {authUser ? (
        <Switch>
          <Route exact path={ROUTES.ADMIN_DETAILS} component={UserDetail} />
          <Route exact path={ROUTES.ADMIN} component={UserList} />
        </Switch>
      ) : (
        <div>No access</div>
      )}
    </div>
  );
};

export default withEmailVerification(AdminPage);
