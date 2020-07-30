import React, { useEffect } from "react";
import { Button, Form, Input, Row, Col } from "antd";
import { AuthUserProvider, withEmailVerification } from "../Session";
import { FirebaseProvider } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { SIGN_IN_METHODS } from "../../constants";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const condition = (authUser) => !!authUser;

const AccountPage = () => {
  const { authUser, firebaseAuth, firebaseApp } = React.useContext(
    FirebaseProvider.context
  );
  const { authorization } = React.useContext(AuthUserProvider.context);
  const history = useHistory();
  const [activeSignInMethods, setActiveSignInMethods] = React.useState(null);
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
    fetchSignInMethods();
    return () => {};
  }, [authUser]);

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
          <div>
            <h3>Sign In Methods:</h3>
            <div>
              {SIGN_IN_METHODS.map((signInMethod) => {
                const onlyOneLeft =
                  activeSignInMethods && activeSignInMethods.length === 1;
                const isEnabled =
                  activeSignInMethods &&
                  activeSignInMethods.includes(signInMethod.id);
                return (
                  <div key={signInMethod.id}>
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
                  </div>
                );
              })}
            </div>
            {error && error.message}
          </div>
        </div>
      ) : (
        <div>Not Logged in</div>
      )}
    </React.Fragment>
  );
};

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => (
  <Row gutter={[0, 24]}>
    <Col offset={8}>
      {isEnabled ? (
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
      )}
    </Col>
  </Row>
);

const DefaultLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) => {
  const [form] = Form.useForm();
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
    <Button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Form
      {...layout}
      layout="horizontal"
      form={form}
      initialValues={{ passwordOne: "", passwordTwo: "" }}
      onFinish={onSubmit}
    >
      <Form.Item name={"passwordOne"} label="New Password" hasFeedback>
        <Input.Password />
      </Form.Item>
      <Form.Item
        name={"passwordTwo"}
        label="Confirm New Password"
        hasFeedback
        dependencies={["passwordOne"]}
        rules={[
          ({ getFieldValue }) => ({
            validator({ value }) {
              if (!value || getFieldValue("passwordOne") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item shouldUpdate={true} wrapperCol={{ offset: 8 }}>
        {() => (
          <Button
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
            type="primary"
            htmlType="submit"
          >
            Link {signInMethod.id}
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default withEmailVerification(AccountPage);
