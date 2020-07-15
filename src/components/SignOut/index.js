import React from "react";

import { FirebaseProvider } from "../Firebase";

const SignOutButton = () => {
  const { doSignOut } = React.useContext(FirebaseProvider.context);
  return (
    <button type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
