import React, { Component } from "react";
import "./index.less";
import { Nav, ModelBox } from "@coms";
import { Toast } from "antd-mobile";
import { dealInfoId, orderOk, orderUnDo, orderAgree } from "@apis/trading";
import { connect } from "react-redux";
class FbUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      userInfo: {},
    };
  }
  componentDidMount() {
    let { state } = this.props.location;
    if (state) {
      this.setState(
        {
          data: state.data,
        },
        this.searchFn
      );
    } else {
      this.props.history.goBack();
    }
  }
  //   显示支付名字
  showPay = () => {
    let { userInfo, data } = this.state;
    switch (data.platform) {
      case 0:
        return {
          name: userInfo.bankName,
          icon: require("@assets/imgs/svg_bank.svg"),
          code: userInfo.bankNum,
        };
      case 1:
        return {
          name: "支付宝",
          icon: require("@assets/imgs/svg_alipay.svg"),
          code: userInfo.alipay,
        };
      case 2:
        return {
          name: "PayPal",
          icon: require("@assets/imgs/svg_paypal.svg"),
          code: userInfo.payPal,
        };
      default:
        return {
          name: "",
          icon: require("@assets/imgs/svg_defalut.svg"),
          code: "",
        };
    }
  };
  //   查询id 支付信息
  searchFn = async () => {
    let {
      data: { fiatLogId },
    } = this.state;
    try {
      let res = await dealInfoId({
        fiatLogId,
      });
      this.setState({
        userInfo: res.data,
      });
    } catch (error) {
      console.log("错误", error);
    }
  };
  //   数据参透
  submitFn = (type) => {
    let {
      data: { fiatLogId, dealStatus },
    } = this.state;
    // over end  取认  取消
    ModelBox.open("passModel", {
      onInputEnd: async (text) => {
        let param = {
          fiatLogId,
          payPassword: text,
        };
        try {
          type === "over"
            ? dealStatus === 2
              ? await orderAgree(param)
              : await orderOk(param)
            : await orderUnDo(param);
          Toast.success("操作成功", 1, () => {
            this.props.history.goBack();
          });
        } catch (error) {
          console.log("错", error);
        }
      },
    });
  };
  showTypeName = () => {
    let { isMe, dealType, dealStatus } = this.state.data,
      showBtn = false,
      btnText = "",
      icon = "",
      title = "";
    if (isMe) {
      //用户
      if (dealStatus === 6) {
        title = dealType === 1 ? "待付款" : "商家付款中";
        btnText = dealType === 1 ? "确认付款" : "";
        showBtn = dealType === 1;
        icon = dealType !== 1 && require("@assets/imgs/order_load.svg");
      } else if (dealStatus === 2) {
        title = dealType === 1 ? "商家收款中" : "待收款";
        btnText = dealType !== 1 ? "确认收款" : "";
        showBtn = dealType !== 1;
        icon = dealType === 1 && require("@assets/imgs/order_load.svg");
      }
    } else {
      //商家
      if (dealStatus === 6) {
        title = dealType === 1 ? "用户付款中" : "待收款";
        btnText = dealType !== 1 ? "确认收款" : "";
        showBtn = dealType !== 1;
        icon = dealType === 1 && require("@assets/imgs/order_load.svg");
      } else if (dealStatus === 2) {
        title = dealType === 1 ? "待付款" : "用户收款中";
        btnText = dealType === 1 ? "确认付款" : "";
        showBtn = dealType === 1;
        icon = dealType !== 1 && require("@assets/imgs/order_load.svg");
      }
    }
    return {
      title,
      showBtn,
      btnText,
      icon,
    };
  };
  //   是否禁用按钮
  disBtnFn() {
    let { dealStatus } = this.state.data;
    // isMe 是否为商家
    let obj = {
      icon: "",
      type: "",
      title: "",
      showBtn: false,
    };
    if (dealStatus === 1) {
      obj = {
        icon: require("@assets/imgs/order_over.svg"),
        type: "success",
        title: "交易完成",
        showBtn: false,
      };
    } else {
      obj = {
        type: "warning",
        ...this.showTypeName(),
      };
    }
    return obj;
  }
  render() {
    let {
      data: { num, unitPrice, isMe },
      userInfo,
    } = this.state;
    let payObj = this.showPay();
    let isDis = this.disBtnFn();
    return (
      <div className="page_box">
        <Nav title="账单详情" back />
        <div className="page_menu pay_list_info">
          <div className="user_info">
            <div className="ingfo_top">
              <p className="label">交易人：</p>
              <div className="value">{userInfo.named || "。。。"}</div>
            </div>
            <div className="ingfo_top">
              <p className="label">数量：</p>
              <div className="value">{num}</div>
            </div>
            <div className="ingfo_top">
              <p className="label">单价：</p>
              <div className="value">{unitPrice}</div>
            </div>
            <div className="ingfo_top">
              <p className="label">金额：</p>
              <div className="value">{num * unitPrice || 0}</div>
            </div>
            <div className="ingfo_top">
              <p className="label">交易方式：</p>
              <div className="value">
                <img src={payObj.icon} alt="" /> {payObj.name}
              </div>
            </div>
            <div className="ingfo_top">
              <p className="label">交易账号：</p>
              <div className="value">{payObj.code}</div>
            </div>
            {/* <div className="tip">
              请尽快通过以上收款信息打入用户账户,再进行确认交易。
            </div> */}
          </div>
          {isDis.icon && (
            <div className={`pay_type_icon order_${isDis.type}`}>
              <img className="img_order" src={isDis.icon} alt="状态" />
              <div className="pay_ti">{isDis.title}</div>
            </div>
          )}
          {isDis.showBtn && (
            <div className="pay_group_btn">
              <button
                className="over_btn"
                onClick={() => this.submitFn("over")}
              >
                {isDis.btnText}
              </button>
              {isMe && (
                <button
                  className="onOver_btn"
                  onClick={() => this.submitFn("end")}
                >
                  取消交易
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function filter(state) {
  return {
    userdata: state.userdata,
  };
}

// export default connect(filter)(FbUser);
export default FbUser;
