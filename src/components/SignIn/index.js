import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, notification, Row, Col } from "antd";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { FirebaseProvider } from "../Firebase";
import { SIGN_IN_METHODS } from "../../constants";
import * as ROUTES from "../../constants/routes";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignInOauthProviders />
    <Row gutter={[0, 24]}>
      <Col offset={8}>
        <PasswordForgetLink />
      </Col>
    </Row>
    <Row gutter={[0, 24]}>
      <Col offset={8}>
        <SignUpLink />
      </Col>
    </Row>
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
  const [form] = Form.useForm();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const onSubmit = ({ email, password }) => {
    doSignInWithEmailAndPassword(email, password)
      .then(() => {
        history.push(ROUTES.HOME);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const isInvalid = password === "" || email === "";
  return (
    <Form
      {...layout}
      layout="horizontal"
      form={form}
      initialValues={{ email: "", password: "" }}
      onFinish={onSubmit}
    >
      <Form.Item
        name={"email"}
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input placeholder="Email Address" />
      </Form.Item>
      <Form.Item name={"password"} label="password">
        <Input.Password />
      </Form.Item>
      <Form.Item shouldUpdate={true} wrapperCol={{ offset: 8 }}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Sign In
          </Button>
        )}
      </Form.Item>
      {error && <p>{error.message}</p>}
    </Form>
  );
};

const SignInOauthProviders = () => {
  const {
    doSignInWithGoogle,
    doSignInWithFacebook,
    doSignInWithTwitter,
    userDb,
  } = React.useContext(FirebaseProvider.context);
  const history = useHistory();
  //const [error, setError] = React.useState();

  const oauthProviders = [];

  if (
    SIGN_IN_METHODS.find(
      (provider) => provider.id === "google.com" && provider.enabled
    )
  ) {
    oauthProviders.push({
      doSignInWith: doSignInWithGoogle,
      successAction: (socialAuthUser) => {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
          },
          { merge: true }
        );
      },
      errorAction: (error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        return error;
      },
      buttonText: "Sign In with Google",
    });
  }
  if (
    SIGN_IN_METHODS.find(
      (provider) => provider.id === "facebook.com" && provider.enabled
    )
  ) {
    oauthProviders.push({
      doSignInWith: doSignInWithFacebook,
      successAction: (socialAuthUser) => {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
          },
          { merge: true }
        );
      },
      errorAction: (error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        return error;
      },
      buttonText: "Sign In with Facebook",
    });
  }
  if (
    SIGN_IN_METHODS.find(
      (provider) => provider.id === "twitter.com" && provider.enabled
    )
  ) {
    oauthProviders.push({
      doSignInWith: doSignInWithTwitter,
      successAction: (socialAuthUser) => {
        userDb(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
          },
          { merge: true }
        );
      },
      errorAction: (error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        return error;
      },
      buttonText: "Sign In with Twitter",
    });
  }

  return oauthProviders.map((provider, key) => {
    //let providerError;
    return (
      <Row key={key} gutter={[0, 24]}>
        <Col offset={8}>
          <Button
            onClick={async (event) => {
              event.preventDefault();
              try {
                const socialAuthUser = await provider.doSignInWith();
                if (socialAuthUser) {
                  provider.successAction(socialAuthUser);
                  history.push(ROUTES.HOME);
                }
              } catch (error) {
                const err = provider.errorAction(error);
                notification.open({
                  message: err.message,
                });
              }
            }}
          >
            {provider.buttonText}
          </Button>
        </Col>
      </Row>
    );
  });
};

export default SignInPage;

export { SignInForm, SignInOauthProviders };
