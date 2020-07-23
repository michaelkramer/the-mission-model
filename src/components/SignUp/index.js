import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, Input, Switch } from "antd";
import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const formData = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: null,
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const SignUpForm = () => {
  const [form] = Form.useForm();

  // const [username, setUsername] = React.useState("");
  // const [email, setEmail] = React.useState("");
  // const [passwordOne, setPasswordOne] = React.useState("");
  // const [passwordTwo, setPasswordTwo] = React.useState("");
  // const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState();

  const {
    doCreateUserWithEmailAndPassword,
    doSendEmailVerification,
    userDb,
  } = React.useContext(FirebaseProvider.context);
  const history = useHistory();

  const onSubmit = async (values) => {
    const roles = values.isAdmin ? Object.assign({}, [ROLES.ADMIN]) : {};
    try {
      const createAuthUser = await doCreateUserWithEmailAndPassword(
        values.email,
        values.passwordOne
      );
      if (createAuthUser) {
        await userDb(createAuthUser.user.uid).set(
          {
            username: values.username,
            email: values.email,
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

  // const isInvalid =
  //   passwordOne !== passwordTwo ||
  //   passwordOne === "" ||
  //   email === "" ||
  //   username === "";

  return (
    <div>
      <Form
        {...layout}
        layout="horizontal"
        form={form}
        initialValues={formData}
        onFinish={onSubmit}
      >
        <Form.Item name={"username"} label="Username">
          <Input />
        </Form.Item>
        <Form.Item
          name={"email"}
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Email Address" />
        </Form.Item>
        <Form.Item name={"passwordOne"} label="Password" hasFeedback>
          <Input.Password />
        </Form.Item>
        <Form.Item
          name={"passwordTwo"}
          label="Confirm Password"
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
        <Form.Item name="isAdmin" label="Admin" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
              type="primary"
              htmlType="submit"
            >
              Sign Up
            </Button>
          )}
        </Form.Item>
      </Form>
      {/* <form onSubmit={onFormSubmit}>
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
      </button> */}

      {error && <p>{error.message}</p>}
    </div>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account?{" "}
    <Link to={ROUTES.SIGN_UP}>
      <Button type="link">Sign Up</Button>
    </Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };
