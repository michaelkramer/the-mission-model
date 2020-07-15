import React from "react";
import { Link } from "react-router-dom";

import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetForm = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState();
  const firebase = React.useContext(FirebaseProvider.context);

  const onSubmit = (event) => {
    event.preventDefault();
    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail("");
      })
      .catch((error) => {
        setError(error);
      });
  };

  const isInvalid = email === "";

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Forgot My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
