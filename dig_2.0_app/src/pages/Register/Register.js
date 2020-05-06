import React, { Component } from "react";
import "./index.less";
import { Nav, CountDown, Notice } from "@coms";
import { Toast } from "antd-mobile";
import { register } from "@apis/api";
import { save_user } from "@store/action";
import { testRule } from "@utils/rule";
import { connect } from "react-redux";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: require("@/assets/imgs/logo.png"),
      eays: require("@/assets/imgs/icon_eays.png"),
      text: "",
      pwd: "",
      code: "",
      inviteCode: "", //邀请码
      passType: "password", //'password'
      isMail: false, //是否邮箱登录
      check: false, //是否勾选用户协议
    };
  }
  componentDidMount() {
    let { search } = this.props.location;
    if (search && search.split("?")[1]) {
      let strArr = search.split("?")[1].split("=");
      if (strArr.length > 0 && strArr[0] === "code") {
        this.setState({
          inviteCode: strArr[1],
        });
      }
    }
  }
  sunmitFn = async () => {
    let { text, check, pwd, code, inviteCode, isMail } = this.state;
    if (!testRule(isMail ? "email" : "phone", text)) {
      Toast.info(`${isMail ? "邮箱格式" : "手机号码"}不正确`);
      return;
    }
    if (!pwd) {
      Toast.info("请设置密码");
      return;
    }
    if (!testRule("password", pwd)) {
      Toast.info("登录密码由数字或字母组成且长度要在6-12位之间");
      return;
    }
    if (!inviteCode) {
      Toast.info("请输入邀请码");
      return;
    }
    if (!check) {
      Toast.info("请阅读并勾选用户协议");
      return;
    }
    let params = {
      [isMail ? "mail" : "tel"]: text,
      [isMail ? "mailCode" : "telCode"]: code,
      password: pwd,
      markCode: inviteCode,
    };
    try {
      let res = await register(params);
      localStorage.userdata = JSON.stringify(res.data);
      this.props.dispatch(save_user(res.data));
      Toast.success("注册成功", 1, () => {
        Toast.loading("登录中。。。", 0);
        setTimeout(() => {
          Toast.hide();
          this.props.history.replace("/");
        }, 1000);
      });
    } catch (error) {}
  };
  render() {
    let {
      imgUrl,
      check,
      eays,
      text,
      pwd,
      passType,
      code,
      inviteCode,
      isMail,
    } = this.state;
    return (
      <div className="page_box register">
        <Nav title="注册" back />
        <div className="page_menu menu_box">
          <div className="login_icon">
            <img src={imgUrl} alt="图片" />
            <div className="logo_name">币行</div>
          </div>
          <div className="login_input user">
            <div className="label">账号</div>
            <div className="input_box">
              <input
                type={isMail ? "text" : "number"}
                placeholder={`请输入${isMail ? "邮箱" : "手机号码"}`}
                value={text}
                onChange={(e) => {
                  this.setState({
                    text: isMail ? e.target.value : e.target.value.slice(0, 11),
                  });
                }}
              />
            </div>
          </div>
          {/* // 密码登录 */}
          <div className="login_input password">
            <div className="label">密码</div>
            <div className="input_box">
              <input
                type={passType}
                placeholder="请输入密码"
                value={pwd}
                onChange={(e) => {
                  this.setState({ pwd: e.target.value });
                }}
              />
              <img
                src={eays}
                alt="眼睛"
                onClick={() => {
                  this.setState({
                    passType: passType === "text" ? "password" : "text",
                  });
                }}
              />
            </div>
          </div>
          {/* // 验证码登录 */}
          <div className="login_input code">
            <div className="label">验证码</div>
            <div className="input_box">
              <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                maxLength={4}
                onChange={(e) => {
                  this.setState({ code: e.target.value });
                }}
              />
              <CountDown
                tel={text}
                keyType="register"
                isMail={isMail}
                className="my_cont_set"
              />
            </div>
          </div>
          {/* 邀请码 */}
          <div className="login_input user">
            <div className="label">邀请码</div>
            <div className="input_box">
              <input
                type="text"
                placeholder="请填入邀请码"
                value={inviteCode}
                onChange={(e) => {
                  this.setState({ inviteCode: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="change_esss">
            <div
              className="change_mail"
              onClick={() => this.setState({ isMail: !isMail, text: "" })}
            >
              {!isMail ? "邮箱注册" : "手机注册"}
            </div>
          </div>

          <div className="btns">
            <button className="btn" type="button" onClick={this.sunmitFn}>
              注册
            </button>
            <div>
              已有账号？
              <span
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                去登录
              </span>
            </div>
          </div>
          <Notice
            value={check}
            onChange={(val) => this.setState({ check: val })}
          />
        </div>
      </div>
    );
  }
}

export default connect()(Register);
