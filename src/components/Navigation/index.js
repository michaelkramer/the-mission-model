import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

import { FirebaseProvider } from "../Firebase";

import * as ROUTES from "../../constants/routes";

const Navigation = () => {
  const { authUser, doSignOut } = React.useContext(FirebaseProvider.context);

  const authNav = [
    { url: ROUTES.LANDING, title: "Landing", icon: "" },
    { url: ROUTES.HOME, title: "Home" },
    { url: ROUTES.ACCOUNT, title: "Account" },
    { url: ROUTES.ADMIN, title: "Admin" },
    {
      title: "Sign Out",
      onClick: () => doSignOut().then(() => (window.location = ROUTES.SIGN_IN)),
    },
  ];

  const nonAuthNav = [
    { url: ROUTES.LANDING, title: "Landing" },
    { url: ROUTES.SIGN_IN, title: "Sign In" },
  ];

  const menuItems = authUser ? authNav : nonAuthNav;
  return (
    <Menu mode="horizontal" defaultSelectedKeys={["Home"]} theme="dark">
      {menuItems.map((item) => (
        <Menu.Item key={item.title} onClick={item.onClick}>
          {item.url ? <Link to={item.url}>{item.title}</Link> : item.title}
        </Menu.Item>
      ))}
      {
        //authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </Menu>
  );
};

// const NavigationAuth = () => (
//   <React.Fragment>
//     <Menu.Item key="landing">
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </Menu.Item>
//     <li>
//       <Link to={ROUTES.HOME}>Home</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.ADMIN}>Admin</Link>
//     </li>
//     <li>
//       <SignOutButton />
//     </li>
//   </ul>
// );

// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//     </li>
//   </ul>
// );

export default Navigation;
