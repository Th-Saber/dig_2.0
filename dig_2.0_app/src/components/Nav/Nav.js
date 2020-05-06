import React from "react";
import { NavBar, Icon } from "antd-mobile";
import "./Nav.less";

export default function Nav({ title, rightCom = [], back = false }) {
  return (
    <NavBar
      icon={back ? <Icon type="left" color="#fff" /> : null}
      onLeftClick={() => {
        back && window.history.back();
      }}
      rightContent={rightCom}
    >
      <span className="nav_title">{title}</span>
    </NavBar>
  );
}
