import React from "react";
//import { useHistory } from "react-router-dom";
import { FirebaseProvider } from "../Firebase";
//import * as ROUTES from "../../constants/routes";
const context = React.createContext(null);

const AuthUserProvider = ({ children }) => {
  const { authUser } = React.useContext(FirebaseProvider.context);
  //const history = useHistory();
  const authorization = (condition) => condition(authUser);

  return (
    <context.Provider value={{ authorization }}>{children}</context.Provider>
  );
};
AuthUserProvider.context = context;
export default AuthUserProvider;
