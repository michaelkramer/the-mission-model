import React from "react";
import { Button } from "antd";
//import AuthUserContext from "./AuthUserContext";
import { FirebaseProvider } from "../Firebase"; //withFirebase

const needsEmailVerification = (authUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider) => provider.providerId)
    .includes("password");

const withEmailVerification = (Component) => {
  const WithEmailVerification = () => {
    const [isSent, setIsSent] = React.useState(false);
    const { authUser, doSendEmailVerification } = React.useContext(
      FirebaseProvider.context
    );

    const onSendEmailVerification = () => {
      try {
        doSendEmailVerification();

        setIsSent(true);
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    };

    if (needsEmailVerification(authUser)) {
      return (
        <div>
          {isSent ? (
            <p>
              E-Mail confirmation sent: Check you E-Mails (Spam folder included)
              for a confirmation E-Mail. Refresh this page once you confirmed
              your E-Mail.
            </p>
          ) : (
            <p>
              Verify your E-Mail: Check you E-Mails (Spam folder included) for a
              confirmation E-Mail or send another confirmation E-Mail.
            </p>
          )}

          <Button
            type="primary"
            onClick={onSendEmailVerification}
            disabled={isSent}
          >
            Send confirmation E-Mail
          </Button>
        </div>
      );
    }
    return <Component />;
  };
  return WithEmailVerification;

  // class WithEmailVerification extends React.Component {
  //   constructor(props) {
  //     super(props);

  //     this.state = { isSent: false };
  //   }

  //   onSendEmailVerification = () => {
  //     this.props.firebase
  //       .doSendEmailVerification()
  //       .then(() => this.setState({ isSent: true }));
  //   };

  //   render() {
  //     return (
  //       <AuthUserContext.Consumer>
  //         {(authUser) =>
  //           needsEmailVerification(authUser) ? (
  //             <div>
  //               {this.state.isSent ? (
  //                 <p>
  //                   E-Mail confirmation sent: Check you E-Mails (Spam folder
  //                   included) for a confirmation E-Mail. Refresh this page once
  //                   you confirmed your E-Mail.
  //                 </p>
  //               ) : (
  //                 <p>
  //                   Verify your E-Mail: Check you E-Mails (Spam folder included)
  //                   for a confirmation E-Mail or send another confirmation
  //                   E-Mail.
  //                 </p>
  //               )}

  //               <button
  //                 type="button"
  //                 onClick={this.onSendEmailVerification}
  //                 disabled={this.state.isSent}
  //               >
  //                 Send confirmation E-Mail
  //               </button>
  //             </div>
  //           ) : (
  //             <Component {...this.props} />
  //           )
  //         }
  //       </AuthUserContext.Consumer>
  //     );
  //   }
  // }

  // return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
