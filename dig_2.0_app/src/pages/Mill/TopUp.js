import React, { Component } from "react";
import "./index.less";
import { Toast } from "antd-mobile";
import { Nav, ModelBox } from "@coms";
import QRCode from "qrcode.react";
import copy from "copy-to-clipboard";
import { getTopUpList } from "@apis/mill";
export default class TopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: [],
      qrUrl: "",
      name: "",
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  searchFn = async () => {
    try {
      let res = await getTopUpList();
      this.setState({
        option: res.data,
        qrUrl: res.data[0].address,
        name: res.data[0].named,
      });
    } catch (error) {
      console.log("错误", error);
    }
  };
  //   信息
  copyText = (text) => {
    copy(text);
    Toast.success("复制成功");
  };
  changeUrl = () => {
    let { option } = this.state;
    ModelBox.open("pikerModel", {
      option: option.map((v) => ({ value: v.address, label: v.named })),
      title: "请选择钱包地址",
      onClick: ({ value, label }) => {
        this.setState({
          qrUrl: value,
          name: label,
        });
      },
    });
  };
  render() {
    let { qrUrl, name } = this.state;
    return (
      <div className="page_box">
        <Nav title="充值" back />
        <div className="page_menu topUp">
          <div className="code_box">
            <QRCode
              value={qrUrl} //value参数为生成二维码的链接
              size={200} //二维码的宽高尺寸
              level="H"
              fgColor="#000000" //二维码的颜色
            />
          </div>
          <div className="code_st_box">
            <span>当前选中钱包：{name}</span>
            <div className="code_text">{qrUrl}</div>
          </div>

          <div className="code_btn_group">
            <button
              className="copy"
              type="button"
              onClick={this.copyText.bind(this, qrUrl)}
            >
              复制
            </button>
            <button className="change" onClick={this.changeUrl} type="button">
              选择地址
            </button>
          </div>
          <div className="tip">
            注：可复制该地址到您钱包，到账时间需整个网络节点确认；请务必确认设备安全，防止信息被篡改或泄露。
          </div>
        </div>
      </div>
    );
  }
}
