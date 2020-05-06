import React, { Component } from "react";
import "./index.less";
import { Icon } from "antd-mobile";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { title, rightCom, onClick, className } = this.props;
    return (
      <div
        className={`my_list_item ${className || ""}`}
        onClick={() => onClick && onClick()}
      >
        <div className="lit_title">{title}</div>
        <div className="lit_right">
          {rightCom}
          <Icon className="oi_icon" type="right" />
        </div>
      </div>
    );
  }
}
