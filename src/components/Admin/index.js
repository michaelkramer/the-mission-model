import React, { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { Table } from "antd";
import { FirebaseProvider } from "../Firebase";
import { AuthUserProvider, withEmailVerification } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const condition = (authUser) =>
  authUser &&
  authUser.roles &&
  Object.values(authUser.roles).includes(ROLES.ADMIN);

const AdminPage = () => {
  const { authUser } = React.useContext(FirebaseProvider.context);
  const { authorization } = React.useContext(AuthUserProvider.context);
  const history = useHistory();
  if (!authorization(condition)) {
    history.push(ROUTES.SIGN_IN);
    return null;
  }
  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      {authUser ? (
        <Switch>
          <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
          <Route exact path={ROUTES.ADMIN} component={UserList} />
        </Switch>
      ) : (
        <div>No access</div>
      )}
    </div>
  );
};

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

// class UserListBase extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       users: [],
//     };
//   }

//   componentDidMount() {
//     this.setState({ loading: true });

//     this.unsubscribe = this.props.firebase.users().onSnapshot((snapshot) => {
//       let users = [];

//       snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));

//       this.setState({
//         users,
//         loading: false,
//       });
//     });
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const { users, loading } = this.state;

//     return (
//       <div>
//         <h2>Users</h2>
//         {loading && <div>Loading ...</div>}
//         <ul>
//           {users.map((user) => (
//             <li key={user.uid}>
//               <span>
//                 <strong>ID:</strong> {user.uid}
//               </span>
//               <span>
//                 <strong>E-Mail:</strong> {user.email}
//               </span>
//               <span>
//                 <strong>Username:</strong> {user.username}
//               </span>
//               <span>
//                 <Link
//                   to={{
//                     pathname: `${ROUTES.ADMIN}/${user.uid}`,
//                     state: { user },
//                   }}
//                 >
//                   Details
//                 </Link>
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }
// }

const UserItem = (props) => {
  const { userDb, doPasswordReset } = React.useContext(
    FirebaseProvider.context
  );
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    let isSubscribed = true;
    isSubscribed && setLoading(true);
    userDb(props.match.params.id).onSnapshot((snapshot) => {
      isSubscribed && setUser({ uid: snapshot.id, ...snapshot.data() });
      isSubscribed && setLoading(false);
    });
    return () => (isSubscribed = false);
  }, [userDb, props.match.params.id]);

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
      return userDb(user.uid).set(
        {
          roles,
        },
        { merge: true }
      );
    }
  };

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
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
            <strong>roles:</strong> {JSON.stringify(user.roles)}
          </span>
          <span>
            <button type="button" onClick={onSetAsAdmin}>
              Set as Admin
            </button>
          </span>
          <span>
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

// class UserItemBase extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       user: null,
//       ...props.location.state,
//     };
//   }

//   componentDidMount() {
//     if (this.state.user) {
//       return;
//     }

//     this.setState({ loading: true });

//     this.unsubscribe = this.props.firebase
//       .user(this.props.match.params.id)
//       .onSnapshot((snapshot) => {
//         this.setState({
//           user: snapshot.data(),
//           loading: false,
//         });
//       });
//   }

//   componentWillUnmount() {
//     this.unsubscribe && this.unsubscribe();
//   }

//   onSendPasswordResetEmail = () => {
//     this.props.firebase.doPasswordReset(this.state.user.email);
//   };

//   onSetAsAdmin = () => {
//     const { user } = this.state;
//     if (user) {
//       let rolesArr = Object.values(user.roles);
//       console.log(user.roles, rolesArr);
//       if (rolesArr.includes(ROLES.ADMIN)) {
//         rolesArr = rolesArr.filter((role) => role !== ROLES.ADMIN);
//       } else {
//         rolesArr.push(ROLES.ADMIN);
//       }
//       console.log(Object.assign({}, rolesArr));
//       const roles = Object.assign({}, rolesArr);
//       //   // Create a user in your Firebase realtime database
//       return this.props.firebase.user(user.uid).set(
//         {
//           roles,
//         },
//         { merge: true }
//       );
//     }
//   };

//   render() {
//     const { user, loading } = this.state;

//     return (
//       <div>
//         <h2>User ({this.props.match.params.id})</h2>
//         {loading && <div>Loading ...</div>}

//         {user && (
//           <div>
//             <span>
//               <strong>ID:</strong> {user.uid}
//             </span>
//             <span>
//               <strong>E-Mail:</strong> {user.email}
//             </span>
//             <span>
//               <strong>Username:</strong> {user.username}
//             </span>
//             <span>
//               <strong>roles:</strong> {JSON.stringify(user.roles)}
//             </span>
//             <span>
//               <button type="button" onClick={this.onSetAsAdmin}>
//                 Set as Admin
//               </button>
//             </span>
//             <span>
//               <button type="button" onClick={this.onSendPasswordResetEmail}>
//                 Send Password Reset
//               </button>
//             </span>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

//const UserList = withFirebase(UserListBase);
//const UserItem = withFirebase(UserItemBase);

export default withEmailVerification(AdminPage);
