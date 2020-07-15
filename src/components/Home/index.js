import React from "react";
//import { compose } from "recompose";
import { AuthUserProvider, withEmailVerification } from "../Session";
//withEmailVerification
const condition = (authUser) => !!authUser;
const HomePage = () => {
  const { authorization } = React.useContext(AuthUserProvider.context);
  if (authorization(condition)) {
    return (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
      </div>
    );
  }
  return (
    <div>
      <h1>Home Page</h1>
      <p>The Home Page NOT</p>
    </div>
  );
};

export default withEmailVerification(HomePage);
