import React, { Component } from "react";
import "./index.less";
import { Nav } from "@coms";
export default class BankCard extends Component {
  constructor(props) {
    super(props);
    let userdata = JSON.parse(localStorage.userdata);
    this.state = {
      name: "",
      card: "",
      cardData: [
        {
          id: 1,
          label: "银行卡",
          infoText: "点击添加银行卡",
          userCode: userdata.bankNum || "",
          payName: userdata.bankName || "银联",
          icon: require("@assets/imgs/svg_bank.svg"),
          value: "bank",
        },

        {
          id: 2,
          label: "账号",
          infoText: "点击添加支付宝",
          userCode: userdata.alipay || "",
          payName: "支付宝",
          icon: require("@assets/imgs/svg_alipay.svg"),
          value: "alipay",
        },
        {
          id: 3,
          label: "账号",
          infoText: "点击添加PayPal",
          userCode: userdata.payPal || "",
          payName: "PayPal",
          icon: require("@assets/imgs/svg_paypal.svg"),
          value: "payPal",
        },
      ],
    };
  }
  //  设置方式
  _setPay = (obj) => {
    this.props.history.push({
      pathname: "AddCard",
      state: {
        type: obj.value,
        code: obj.userCode,
        bankName: obj.payName,
      },
    });
  };
  render() {
    let { cardData } = this.state;
    return (
      <div className="page_box bank_card">
        <Nav title="支付设置" back />
        <div className="page_menu">
          {cardData.map((v, i) => {
            return (
              <div
                key={i + "card"}
                className="dataItem"
                onClick={() => this._setPay(v)}
              >
                <div className="top_card">
                  <span>{v.label}</span>
                  <span>{v.userCode || v.infoText}</span>
                </div>
                <div className="bankname">
                  <img src={v.icon} alt="图标" />
                  <span>{v.payName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
