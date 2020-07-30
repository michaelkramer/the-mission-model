import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Table } from "antd";
import { FirebaseProvider } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const UserList = () => {
  const { usersDb } = React.useContext(FirebaseProvider.context);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    usersDb().onSnapshot((snapshot) => {
      let users = [];

      snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));
      setUsers(users);
      setLoading(false);
    });

    return () => {};
  }, [usersDb]);

  const columns = [
    {
      title: "ID",
      dataIndex: "uid",
      key: "uid",
      render: (text, record) => (
        <Link
          to={{
            pathname: `${ROUTES.ADMIN}/${record.uid}`,
            state: { user: record },
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
  ];

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <Table dataSource={users} columns={columns} rowKey="uid" />;
    </div>
  );
};

export default UserList;
