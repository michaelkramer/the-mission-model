import React from "react";
//import set from "lodash/set";
import { Link, useHistory } from "react-router-dom";

import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

// const INITIAL_STATE = {
//   username: "",
//   email: "",
//   passwordOne: "",
//   passwordTwo: "",
//   isAdmin: false,
//   error: null,
// };

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpForm = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passwordOne, setPasswordOne] = React.useState("");
  const [passwordTwo, setPasswordTwo] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState();

  const {
    doCreateUserWithEmailAndPassword,
    doSendEmailVerification,
    userDb,
  } = React.useContext(FirebaseProvider.context);
  const history = useHistory();

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const roles = isAdmin ? Object.assign({}, [ROLES.ADMIN]) : {};
    try {
      const createAuthUser = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne
      );
      if (createAuthUser) {
        await userDb(createAuthUser.user.uid).set(
          {
            username,
            email,
            roles,
          },
          { merge: true }
        );
        await doSendEmailVerification();
        history.push(ROUTES.HOME);
      }
    } catch (error) {
      if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }

      setError(error);
    }
  };

  // const onChange = (event) => {
  //   console.log(stateObj);
  //   set(
  //     stateObj,
  //     event.target.name,
  //     stateObj[event.target.nam] + event.target.value
  //   );
  //   setStateObj(stateObj);
  //   console.log(stateObj);
  // };

  // const onChangeCheckbox = (event) => {
  //   setStateObj({ [event.target.name]: event.target.checked, ...stateObj });
  // };

  // const {
  //   username,
  //   email,
  //   passwordOne,
  //   passwordTwo,
  //   isAdmin,
  //   error,
  // } = stateObj;

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === "" ||
    email === "" ||
    username === "";

  return (
    <form onSubmit={onFormSubmit}>
      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={(e) => setPasswordOne(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={(e) => setPasswordTwo(e.target.value)}
        type="password"
        placeholder="Confirm Password"
      />
      <label>
        Admin:
        <input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
      </label>
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };
