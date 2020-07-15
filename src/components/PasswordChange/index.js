import React, { useState } from "react";

import { FirebaseProvider } from "../Firebase";

// const INITIAL_STATE = {
//   passwordOne: "",
//   passwordTwo: "",
//   error: null,
// };

const PasswordChangeForm = () => {
  const firebase = React.useContext(FirebaseProvider.context);
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState();

  const onSubmit = (event) => {
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswordOne("");
        setPasswordTwo("");
      })
      .catch((error) => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

  return (
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
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default PasswordChangeForm;
