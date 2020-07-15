import React from "react";

const FirebaseContext = React.createContext(null);

export const withFirebase = (Component) => (props) => {
  const firebase = React.useContext(FirebaseContext);
  return <Component {...props} firebase={firebase} />;
};

export default FirebaseContext;
