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
    let isSubscribed = true;

    isSubscribed && setLoading(true);
    usersDb().onSnapshot((snapshot) => {
      let users = [];

      snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));
      isSubscribed && setUsers(users);
      isSubscribed && setLoading(false);
    });

    return () => (isSubscribed = false);
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
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            <span>
              <strong>ID:</strong> {user.uid}
            </span>
            <span>
              <strong>E-Mail:</strong> {user.email}
            </span>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <span>
              <Link
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user },
                }}
              >
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
