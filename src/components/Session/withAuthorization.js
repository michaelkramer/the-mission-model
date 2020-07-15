// /* eslint-disable react-hooks/rules-of-hooks */
// import React from "react";
// import { useHistory } from "react-router-dom";

// //import AuthUserContext from "./AuthUserContext";
// import { FirebaseProvider } from "../Firebase"; //withFirebase
// import * as ROUTES from "../../constants/routes";

// const withAuthorization = (condition, Component) => {
//   const { authUser } = React.useContext(FirebaseProvider.context);
//   const history = useHistory();
//   if (authUser) {
//     if (!condition(authUser)) {
//       history.push(ROUTES.SIGN_IN);
//       return <Component {...this.props} />;
//     }
//   }
//   history.push(ROUTES.SIGN_IN);
//   return null;

//   // class WithAuthorization extends React.Component {
//   //   componentDidMount() {
//   //     this.listener = this.props.firebase.onAuthUserListener(
//   //       (authUser) => {
//   //         if (!condition(authUser)) {
//   //           this.props.history.push(ROUTES.SIGN_IN);
//   //         }
//   //       },
//   //       () => this.props.history.push(ROUTES.SIGN_IN)
//   //     );
//   //   }

//   //   componentWillUnmount() {
//   //     this.listener();
//   //   }

//   //   render() {
//   //     return (
//   //       <AuthUserContext.Consumer>
//   //         {(authUser) => {
//   //           console.log("condition:", condition(authUser));
//   //           return condition(authUser) ? <Component {...this.props} /> : null;
//   //         }}
//   //       </AuthUserContext.Consumer>
//   //     );
//   //   }
//   // }

//   // return compose(withRouter, withFirebase)(WithAuthorization);
// };

// export default withAuthorization;
