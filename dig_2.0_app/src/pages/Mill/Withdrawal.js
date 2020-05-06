import React, { Component } from "react";
import "./index.less";
import { Toast, WhiteSpace } from "antd-mobile";
import { Nav, ModelBox } from "@coms";
import { connect } from "react-redux";
import { getUSDT } from "@serve/polling";
import { wallForm, getTopUpList } from "@apis/mill";
class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shou: 0,
      name: "",
      num: "",
      option: [],
      typeName: "",
    };
  }
  componentDidMount() {
    this.searchFn();
    getUSDT();
  }
  searchFn = async () => {
    try {
      let res = await getTopUpList();
      this.setState({
        option: res.data,
      });
    } catch (error) {
      console.log("错误", error);
    }
  };
  //   显示手续费
  showShouXu = (type) => {
    switch (type) {
      case "USDT_OMNI":
        return 10;
      case "USDT_ERC20":
        return 2;

      default:
        return 0;
    }
  };
  //
  changeUrl = () => {
    let { option, typeName } = this.state;
    ModelBox.open("pikerModel", {
      option: option.map((v) => ({ value: v.named, label: v.named })),
      title: "请选择钱包地址",
      value: typeName,
      onClick: ({ value }, index) => {
        this.setState({
          typeName: value,
          shou: this.showShouXu(value),
        });
      },
    });
  };
  //   提交
  submitFn = () => {
    let { name, num, typeName } = this.state;
    if (!typeName) {
      Toast.info("请选择提币地址类型");
      return;
    }
    if (!name) {
      Toast.info("请输入提币地址");
      return;
    }
    if (!num) {
      Toast.info("请输入提币数量");
      return;
    }
    if (num < 200) {
      Toast.info("最低提币200");
      return;
    }
    ModelBox.open("passModel", {
      onInputEnd: async (text) => {
        try {
          await wallForm({
            address: name,
            num,
            addressType: typeName,
            payPassword: text,
          });
          Toast.success("提交成功", 1, () => {
            this.props.history.push({
              pathname: "WithdrawalInfo",
            });
          });
        } catch (error) {
          console.log("cuowu", error);
        }
      },
    });
  };
  render() {
    let { name, num, shou, typeName } = this.state;
    let { coinNum } = this.props;
    return (
      <div className="page_box">
        <Nav title="提币" back />
        <div className="page_menu withD">
          <div className="top_menu_box">
            <img
              src={require("@/assets/imgs/icon_record.png")}
              onClick={() => {
                this.props.history.push({
                  pathname: "WithdrawalInfo",
                  state: {},
                });
              }}
              alt="图标"
            />
          </div>

          <Input disabled value={(coinNum || 0) + " USDT"} label="可用" />
          <Input
            disabled
            onClick={this.changeUrl}
            value={typeName}
            placeholder="请选择"
            label="钱包类型"
          />
          <Input
            value={name}
            label="提币地址"
            placeholder="输入或长按粘贴地址"
            onChange={(text) => this.setState({ name: text })}
          />
          <Input
            value={num}
            label="数量"
            type="number"
            placeholder="最低提币200"
            onChange={(text) => this.setState({ num: text })}
            rightCom={
              <button
                type="button"
                className="all_btn"
                onClick={() =>
                  this.setState({
                    num: coinNum,
                  })
                }
              >
                全部
              </button>
            }
          />
          <Input disabled value={shou + " USDT"} label="手续费" />
          <Input
            disabled
            value={(num - shou < 0 ? 0 : num - shou) + " USDT"}
            label="到账数量"
          />
          <button type="button" onClick={this.submitFn} className="submit">
            提交
          </button>
          <WhiteSpace size="lg" />
          <div className="tip">
            注：请认真核对地址，一旦发起无法撤回；请务必确认设备安全，防止信息被篡改或泄露。
          </div>
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
    } = this.props;
    return (
      <div className="login_input user">
        <div className="label">{label}</div>
        <div
          className="input_box"
          onClick={() => disabled && onClick && onClick()}
        >
          <input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
          {rightCom && rightCom}
        </div>
      </div>
    );
  }
}
// 数据刷单
function filter(state) {
  return {
    coinNum: state.Ubi.coinNum,
  };
}
export default connect(filter)(Withdrawal);
