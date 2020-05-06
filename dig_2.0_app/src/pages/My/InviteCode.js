import React, { Component } from "react";
import "./index.less";
import { Toast } from "antd-mobile";
import { Nav } from "@coms";
import QRCode from "qrcode.react";
import copy from "copy-to-clipboard";
export default class InviteCode extends Component {
  constructor(props) {
    super(props);
    let userdata = JSON.parse(localStorage.userdata);
    this.state = {
      code: userdata.markCode || "",
      url: "https://btch.com.cn/register?code=",
    };
  }
  //   信息
  copyText = () => {
    let { code, url } = this.state;
    copy(url + code);
    Toast.success("复制成功");
  };

  render() {
    let { code, url } = this.state;
    return (
      <div className="page_box">
        <Nav title="邀请码" back />
        <div className="page_menu inviteCode">
          <div className="code_box">
            <QRCode
              value={url + code} //value参数为生成二维码的链接
              size={200} //二维码的宽高尺寸
              fgColor="#000000" //二维码的颜色
            />
          </div>
          <div className="code_st_box">
            <span>邀请码：{code}</span>
          </div>

          <button className="copy" type="button" onClick={this.copyText}>
            复制链接
          </button>
        </div>
      </div>
    );
  }
}
