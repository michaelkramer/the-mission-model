import React from "react";
import { Layout } from "antd";
import { createUseStyles, useTheme } from "react-jss";
import Navigation from "../Navigation";

const Header = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <Layout.Header className={classes.header}>
      <div className={classes.logo}>Logo</div>
      <Navigation />
    </Layout.Header>
  );
};

const useStyles = createUseStyles((_theme) => ({
  header: { position: "fixed", zIndex: 1, width: "100%" },
  logo: {
    width: "120px",
    height: "31px",
    background: "rgba(255, 255, 255, 0.2)",
    margin: "16px 24px 16px 0",
    float: "left",
  },
}));
export default Header;
