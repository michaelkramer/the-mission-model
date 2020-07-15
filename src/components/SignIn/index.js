import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

// const INITIAL_STATE = {
//   email: "",
//   password: "",
//   error: null,
// };

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const SignInForm = () => {
  const { doSignInWithEmailAndPassword } = React.useContext(
    FirebaseProvider.context
  );
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const onSubmit = (event) => {
    doSignInWithEmailAndPassword(email, password)
      .then(() => {
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = password === "" || email === "";
  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInGoogle = () => {
  const { doSignInWithGoogle, userDb } = React.useContext(
    FirebaseProvider.context
  );
  const history = useHistory();
  const [error, setError] = React.useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const socialAuthUser = await doSignInWithGoogle();
      if (socialAuthUser) {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            //roles: {},
          },
          { merge: true }
        );
        setError(null);
        history.push(ROUTES.HOME);
      }
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }
      setError(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInFacebook = () => {
  const { doSignInWithFacebook, userDb } = React.useContext(
    FirebaseProvider.context
  );
  const history = useHistory();
  const [error, setError] = React.useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const socialAuthUser = await doSignInWithFacebook();
      if (socialAuthUser) {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            //roles: {},
          },
          { merge: true }
        );
        setError(null);
        history.push(ROUTES.HOME);
      }
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }
      setError(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInTwitter = () => {
  const { doSignInWithTwitter, userDb } = React.useContext(
    FirebaseProvider.context
  );
  const history = useHistory();
  const [error, setError] = React.useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const socialAuthUser = await doSignInWithTwitter();
      if (socialAuthUser) {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            //roles: {},
          },
          { merge: true }
        );
        setError(null);
        history.push(ROUTES.HOME);
      }
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }
      setError(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <button type="submit">Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
