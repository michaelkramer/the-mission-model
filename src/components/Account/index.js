import React, { useEffect } from "react";
import { Button, notification } from "antd";
import { AuthUserProvider, withEmailVerification } from "../Session";
import { FirebaseProvider } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { SIGN_IN_METHODS } from "../../constants";

const condition = (authUser) => !!authUser;

const AccountPage = () => {
  const { authUser } = React.useContext(FirebaseProvider.context);
  const { authorization } = React.useContext(AuthUserProvider.context);
  const history = useHistory();
  if (!authorization(condition)) {
    history.push(ROUTES.SIGN_IN);
    return null;
  }

  return (
    <React.Fragment>
      {authUser ? (
        <div>
          <h1>Account: {authUser.email}</h1>
          <PasswordForgetForm />
          <PasswordChangeForm />
          <LoginManagement authUser={authUser} />
        </div>
      ) : (
        <div>Not Logged in</div>
      )}
    </React.Fragment>
  );
};

const LoginManagement = (authUser) => {
  const { firebaseAuth, firebaseApp } = React.useContext(
    FirebaseProvider.context
  );
  const [activeSignInMethods, setActiveSignInMethods] = React.useState();
  const [error, setError] = React.useState();

  const fetchSignInMethods = async () => {
    if (authUser && authUser.email) {
      try {
        const activeSignInMethods = await firebaseAuth.fetchSignInMethodsForEmail(
          authUser.email
        );
        setActiveSignInMethods(activeSignInMethods);
      } catch (error) {
        setError(error);
      }
    }
  };

  const onSocialLoginLink = (provider) => {
    firebaseAuth.currentUser
      .linkWithPopup(firebaseApp[provider])
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  const onDefaultLoginLink = (password) => {
    const credential = firebaseApp.emailAuthProvider.credential(
      authUser.email,
      password
    );

    firebaseAuth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  const onUnlink = (providerId) => {
    firebaseAuth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch((error) => setError(error));
  };

  useEffect(() => {
    let isSubscribed = true;
    isSubscribed && fetchSignInMethods();
    return () => (isSubscribed = false);
  });

  return (
    <div>
      Sign In Methods:
      <ul>
        {SIGN_IN_METHODS.map((signInMethod) => {
          const onlyOneLeft =
            activeSignInMethods && activeSignInMethods.length === 1;
          const isEnabled =
            activeSignInMethods &&
            activeSignInMethods.includes(signInMethod.id);

          return (
            <li key={signInMethod.id}>
              {signInMethod.id === "password" ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
};

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <Button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </Button>
  );

const DefaultLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => {
  const [passwordOne, setPasswordOne] = React.useState("");
  const [passwordTwo, setPasswordTwo] = React.useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    onLink(passwordOne);
    setPasswordOne("");
    setPasswordTwo("");
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

  return isEnabled ? (
    <button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <form onSubmit={onSubmit}>
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={(e) => setPasswordOne(e.target.value)}
        type="password"
        placeholder="New Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={(e) => setPasswordTwo(e.target.value)}
        type="password"
        placeholder="Confirm New Password"
      />

      <button disabled={isInvalid} type="submit">
        Link {signInMethod.id}
      </button>
    </form>
  );
};

export default withEmailVerification(AccountPage);
