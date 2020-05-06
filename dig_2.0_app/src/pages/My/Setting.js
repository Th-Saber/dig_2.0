import React, { Component } from "react";
import "./index.less";
import { Nav } from "@coms";
import { Toast } from "antd-mobile";
export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //  退出登录
  outLogin = () => {
    localStorage.clear();
    this.props.history.replace("/login");
    Toast.success("退出成功", 2, () => {}, false);
  };
  render() {
    return (
      <div className="page_box setting">
        <Nav title="设置" back />
        <div className="page_menu setting_menu">
          <button type="button" className="submit_btn" onClick={this.outLogin}>
            退出登录
          </button>
        </div>
      </div>
    );
  }
}
