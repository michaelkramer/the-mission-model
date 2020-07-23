import React, { useState, useEffect } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { Form, Input, Button, Row, Col, Switch, notification } from "antd";
import { FirebaseProvider } from "../Firebase";
import * as ROLES from "../../constants/roles";
import SocialMedia from "../SocialMedia";

const rowStyle = { gutter: [0, 24] };

const UserDetail = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [form] = Form.useForm();
  const { userDb, doPasswordReset, firebaseAuth } = React.useContext(
    FirebaseProvider.context
  );
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    setLoading(true);
    userDb(props.match.params.id).onSnapshot(async (snapshot) => {
      const activeSignInMethods = await firebaseAuth.fetchSignInMethodsForEmail(
        snapshot.data().email
      );

      setUser({
        uid: snapshot.id,
        ...snapshot.data(),
        signInMethods: activeSignInMethods,
      });
      setLoading(false);
    });
    return () => {};
  }, [userDb, props.match.params.id]);

  useEffect(() => form.resetFields(), [user]);

  const onSendPasswordResetEmail = () => {
    doPasswordReset(user.email);
  };

  const onSetAsAdmin = () => {
    //console.log(user);
    if (user && user.uid) {
      let rolesArr = Object.values(user.roles);
      //console.log(user.roles, rolesArr);
      if (rolesArr.includes(ROLES.ADMIN)) {
        rolesArr = rolesArr.filter((role) => role !== ROLES.ADMIN);
      } else {
        rolesArr.push(ROLES.ADMIN);
      }
      //console.log(Object.assign({}, rolesArr));
      const roles = Object.assign({}, rolesArr);
      //   // Create a user in your Firebase realtime database
      return userDb(user.uid)
        .set(
          {
            roles,
          },
          { merge: true }
        )
        .then(() =>
          notification.open({
            message: "Updated",
          })
        );
    }
  };

  const onFinish = (values) => {
    return userDb(values.uid).set(values, { merge: true });
  };

  const roles = user && user.roles ? Object.values(user.roles) : [];
  const isAdmin = roles.includes(ROLES.ADMIN);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={classes.userDetail}>
      <Form
        {...layout}
        layout="horizontal"
        initialValues={user}
        form={form}
        onFinish={onFinish}
      >
        <h2>User</h2>
        {loading && <div>Loading ...</div>}

        {user && (
          <div>
            <Form.Item name={"uid"} label="ID">
              <span>{user.uid}</span>
            </Form.Item>
            <Form.Item name={"email"} label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="username" label="Username">
              <Input />
            </Form.Item>
            <Row {...rowStyle}>
              <Col span={8}>
                <div className={classes.center}>
                  <Switch
                    checked={isAdmin}
                    checkedChildren="Is Admin"
                    unCheckedChildren="Set as Admin"
                    onChange={onSetAsAdmin}
                  />
                </div>
              </Col>
              <Col>
                <Button type="link" onClick={onSendPasswordResetEmail}>
                  Send Password Reset
                </Button>
              </Col>
            </Row>
            <Form.Item label="Oath Providers" align="middle">
              <div>
                {user.signInMethods &&
                  user.signInMethods
                    .filter((socialMedia) => socialMedia !== "password")
                    .map((socialMedia, idx) => {
                      return (
                        <div className={classes.vcenter} type="text" key={idx}>
                          {SocialMedia[socialMedia].icon}
                        </div>
                      );
                    })}
              </div>
            </Form.Item>
            <Row {...rowStyle}>
              <Col offset={8}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Form>
    </div>
  );
};

const useStyles = createUseStyles((_theme) => ({
  center: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "32px",
    margin: "0 8px 0 2px",
  },
  vcenter: {
    width: "32px",
    height: "32px",
    padding: "4px 0",
    fontSize: "16px",
    borderRadius: "2px",
    verticalAlign: "-0.5px",
  },
  userDetail: {},
}));

export default UserDetail;
