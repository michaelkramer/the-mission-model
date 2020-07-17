import React from "react";
import { Link } from "react-router-dom";
import { Typography, Form, Input, Button, notification } from "antd";
import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <div>
    <Typography.Title level={3}>PasswordForget</Typography.Title>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetForm = () => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = React.useState(false);
  const [error, setError] = React.useState();
  const firebase = React.useContext(FirebaseProvider.context);

  const onEmailChange = ({ allValues }) => {
    setIsValid(allValues["email"] !== "");
  };

  const onSubmit = (values) => {
    firebase
      .doPasswordReset(values.email)
      .then(() => {
        notification.open({
          message: "Check Your Email",
        });
      })
      .catch((error) => {
        setError(error);
      });
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <Form
        {...layout}
        layout="horizontal"
        initialValues={{ email: "" }}
        onFinish={onSubmit}
        form={form}
        //onValuesChange={onEmailChange}
      >
        <Form.Item
          name={"email"}
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Email Address" />
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Forgot My Password
            </Button>
          )}
        </Form.Item>
      </Form>

      {error && <p>{error.message}</p>}
    </div>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>
      <Button type="link">Forgot Password?</Button>
    </Link>
  </p>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
