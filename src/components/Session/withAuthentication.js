import React from "react";

import AuthUserContext from "./AuthUserContext";
import { FirebaseProvider } from "../Firebase";

const withAuthentication = (Component) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { authUser } = React.useContext(FirebaseProvider.context);
  return (
    <AuthUserContext.Provider value={authUser}>
      <Component {...this.props} />
    </AuthUserContext.Provider>
  );
  // class WithAuthentication extends React.Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = {
  //       authUser: null,
  //     };
  //   }

  //   componentDidMount() {
  //     this.listener = this.props.firebase.auth.onAuthStateChanged(
  //       (authUser) => {
  //         authUser
  //           ? this.setState({ authUser })
  //           : this.setState({ authUser: null });
  //       }
  //     );
  //   }

  //   componentWillUnmount() {
  //     this.listener();
  //   }

  //   render() {
  //     return (
  //       <AuthUserContext.Provider value={this.state.authUser}>
  //         <Component {...this.props} />
  //       </AuthUserContext.Provider>
  //     );
  //   }
  // }

  //return withFirebase(WithAuthentication);
};

export default withAuthentication;
