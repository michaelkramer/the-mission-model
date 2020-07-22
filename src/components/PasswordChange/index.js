import React, { useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Form, Input, Button, Row, Col, Switch, notification } from "antd";
import { FirebaseProvider } from "../Firebase";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const PasswordChangeForm = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [form] = Form.useForm();
  const firebase = React.useContext(FirebaseProvider.context);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState();

  const onSubmit = (values) => {
    firebase
      .doPasswordUpdate(values.passwordOne)
      .then(() => {
        notification.open({
          message: "Password Changed",
        });
      })
      .catch((error) => {
        notification.open({
          message: error.message,
        });
        setError(error);
      });
  };

  const formData = { passwordOne: "", passwordTwo: "" };

  return (
    <div className={classes.passwordChangeForm}>
      <Form
        {...layout}
        layout="horizontal"
        form={form}
        initialValues={formData}
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
              Update Password
            </Button>
          )}
        </Form.Item>
      </Form>
      {error && <p>{error.message}</p>}
    </div>
  );
};

const useStyles = createUseStyles((_theme) => ({
  passwordChangeForm: {},
}));

export default PasswordChangeForm;
