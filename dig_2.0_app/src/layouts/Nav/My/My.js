import React, { Component } from "react";
import "./my.less";
import { WhiteSpace, Toast } from "antd-mobile";
import { Nav, ListItem, ModelBox } from "@coms";
import { connect } from "react-redux";
import { save_user } from "@store/action";
import { setPayPass } from "@apis/api";
class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headImg: "",
      payPassword: "",
    };
  }
  componentDidMount() {
    if (!this.props.userdata.payPassword) {
      Toast.info("未检测到支付密码，请先设置。", 2, () => {
        ModelBox.open("passModel", {
          onInputEnd: this.checkPayPass,
        });
      });
    }
  }
  //   数据想好
  checkPayPass = (text) => {
    let { payPassword } = this.state;
    if (payPassword) {
      if (payPassword === text) {
        this.setPayPassword();
      } else {
        this.setState(
          {
            payPassword: "",
          },
          () => {
            Toast.info("两次支付密码不一致，请重新输入！", 1, () => {
              ModelBox.open("passModel", {
                onInputEnd: this.checkPayPass,
              });
            });
          }
        );
      }
    } else {
      this.setState(
        {
          payPassword: text,
        },
        () => {
          Toast.info("请再次输入", 1, () => {
            ModelBox.open("passModel", {
              onInputEnd: this.checkPayPass,
            });
          });
        }
      );
    }
  };
  //   数据
  showNickName = () => {
    let { userdata } = this.props,
      str = "";
    if (userdata.tel) {
      str = userdata.tel.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    } else if (userdata.mail) {
      str = userdata.mail.replace(
        /^(\w?)(\w+)(\w)(@\w+\.[a-z]+(\.[a-z]+)?)$/,
        "$1****$3$4"
      );
    }
    return str;
  };
  //   设置支付密码
  setPayPassword = async () => {
    let { payPassword } = this.state;
    let { userdata } = this.props;
    try {
      await setPayPass({
        payPassword,
      });
      userdata.payPassword = "xxxxxx";
      localStorage.userdata = JSON.stringify(userdata);
      this.props.dispatch(save_user(userdata));
    } catch (error) {}
  };
  //   根据审核状态显示
  showCertReal = () => {
    let { certReal } = this.props.userdata;
    switch (certReal) {
      case 0:
        return {
          name: "未提交",
          color: "#e6a23c",
        };
      case 1:
        return {
          name: "已认证",
          color: "#2eb063",
        };
      case 2:
        return {
          name: "待审核",
          color: "#3787e5",
        };
      case 3:
        return {
          name: "已拒绝",
          color: "#ee512f",
        };
      default:
        return {
          name: "",
          color: "#fff",
        };
    }
  };

  //   点击列表  设置函数
  clickItem = (type) => {
    switch (type) {
      case "name":
        this.props.history.push("/realName");
        break;
      case "bank":
        this.props.history.push("/bankCard");
        break;
      case "code":
        this.props.history.push("/inviteCode");
        break;
      case "pass":
        ModelBox.open("checkModel", { history: this.props.history });
        break;
      case "log":
        this.props.history.push("/log");
        break;
      case "about":
        this.props.history.push("/aboutUs");
        break;
      default:
        break;
    }
  };
  render() {
    let { userdata } = this.props;
    let { headImg } = this.state;
    return (
      <div className="my">
        <Nav title="我的" />
        <div className="my_menu">
          <div
            className="head_top"
            onClick={() => this.props.history.push("/setting")}
          >
            <div className="head_avator">
              {headImg ? (
                <img className="rell_img" src={headImg} alt="相机" />
              ) : (
                <div className="default_avator">
                  <img
                    src={require("@/assets/imgs/icon_camera.png")}
                    alt="相机"
                  />
                </div>
              )}
            </div>
            <div className="head_info">{this.showNickName()}</div>
            {userdata.certReal === 1 && (
              <div className="user_name">{userdata.named}</div>
            )}
          </div>

          <WhiteSpace size="lg" />
          {/* 列表 */}
          <div className="my_list_box">
            <ListItem
              title="实名认证"
              rightCom={
                <span
                  className={`down_span`}
                  style={{
                    color: this.showCertReal().color,
                  }}
                >
                  {this.showCertReal().name}
                </span>
              }
              onClick={this.clickItem.bind(this, "name")}
            />
            <ListItem
              title="支付设置"
              onClick={this.clickItem.bind(this, "bank")}
            />
            <ListItem
              title="邀请好友"
              rightCom={<span className="down_span">{userdata.markCode}</span>}
              onClick={this.clickItem.bind(this, "code")}
            />
            <ListItem
              title="安全设置"
              onClick={this.clickItem.bind(this, "pass")}
              rightCom={<span className="down_span">******</span>}
            />
            <ListItem
              title="账单日志"
              onClick={this.clickItem.bind(this, "log")}
            />
            <ListItem
              title="关于我们"
              onClick={this.clickItem.bind(this, "about")}
            />
          </div>
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

export default connect(filter)(My);
