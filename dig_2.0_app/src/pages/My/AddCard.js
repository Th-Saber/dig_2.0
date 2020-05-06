import React, { Component } from "react";
import "./index.less";
import { testRule } from "@utils/rule";
import { Toast } from "antd-mobile";
import { payMas } from "@apis/my";
import { Nav, ModelBox } from "@coms";
export default class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "", //bank  alipay  payPal
      code: "",
      bankName: "",
    };
  }
  componentDidMount() {
    let { state } = this.props.location;
    if (state) {
      if (state.type === "bank" && state.bankName === "银联") {
        state.bankName = "";
      }
      this.setState(state);
    } else {
      this.props.history.goBack();
    }
  }
  //  数据
  submitFn = () => {
    let { type, code, bankName } = this.state;
    if (!code) {
      Toast.info("请输入账号信息");
      return;
    }

    if (type === "bank") {
      if (!testRule("bankCode", code)) {
        Toast.info("请输入正确的银联银行卡号");
        return;
      }
      if (!bankName) {
        Toast.info("请输入所属银行");
        return;
      }
    }
    ModelBox.open("passModel", {
      onInputEnd: async (text) => {
        let param = {
          payPassword: text,
        };
        if (type === "bank") {
          param.bankName = bankName;
          param.bankNum = code;
        } else if (type === "alipay") {
          param.alipay = code;
        } else {
          param.payPal = code;
        }
        try {
          await payMas(param);
          let userdata = JSON.parse(localStorage.userdata);
          if (type === "bank") {
            userdata.bankName = bankName;
            userdata.bankNum = code;
          } else if (type === "alipay") {
            userdata.alipay = code;
          } else {
            userdata.payPal = code;
          }
          localStorage.userdata = JSON.stringify(userdata);
          Toast.success("操作成功", 1, () => {
            this.props.history.goBack(0);
          });
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  };

  render() {
    let { type, code, bankName } = this.state;
    return (
      <div className="page_box addCard">
        <Nav title="支付设置" back />
        <div className="page_menu">
          <div className="real_input_box">
            {/* 卡号 */}
            <Input
              value={type === "bank" ? "银联" : bankName}
              disabled
              label="当前设置"
            />
            <Input
              value={code}
              label={type === "bank" ? "银行卡号" : "支付账号"}
              placeholder={type === "bank" ? "请输入卡号" : "请输入账号"}
              onChange={(text) => this.setState({ code: text })}
            />
            {type === "bank" && (
              <Input
                value={bankName}
                label="所属银行"
                placeholder="请输入银行名"
                onChange={(text) => this.setState({ bankName: text })}
              />
            )}
          </div>

          {/* 提交按钮 */}
          <button
            className="addBtn"
            type="button"
            onClick={() => this.submitFn()}
          >
            提交
          </button>
        </div>
      </div>
    );
  }
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static defaultProps = {
    type: "text",
    disabled: false,
  };
  render() {
    let {
      label,
      value,
      onChange,
      placeholder,
      type,
      rightCom,
      disabled,
      onClick,
      len,
    } = this.props;
    return (
      <div className="real_input">
        <div className="title">{label}</div>
        <div className="right" onClick={() => disabled && onClick && onClick()}>
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={(e) =>
              onChange &&
              onChange(len ? e.target.value.slice(0, len) : e.target.value)
            }
          />
        </div>
        {rightCom && rightCom}
      </div>
    );
  }
}
