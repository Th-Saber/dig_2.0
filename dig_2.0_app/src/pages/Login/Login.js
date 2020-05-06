import React, { Component } from "react";
import "./index.less";
import { Nav, CountDown } from "@coms";
import { Toast } from "antd-mobile";
import { login } from "@apis/api";
import { save_user } from "@store/action";
import { testRule } from "@utils/rule";
import { connect } from "react-redux";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: require("@/assets/imgs/logo.png"),
      eays: require("@/assets/imgs/icon_eays.png"),
      text: "",
      pwd: "",
      code: "",
      passType: "password",
      time: 60,
      timeFlag: false,
      showCode: false, //是否显示验证码登录
      isMail: false, //是否邮箱登录
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  // 数据
  sumitFn = async () => {
    let { text, pwd, code, showCode, isMail } = this.state;
    if (!text) {
      Toast.info("请输入账号");
      return;
    }
    if (!testRule(isMail ? "email" : "phone", text)) {
      Toast.info(`${isMail ? "邮箱格式" : "手机号码"}不正确`);
      return;
    }
    if (!showCode && !pwd) {
      Toast.info("请输入密码");
      return;
    }
    if (showCode && !code) {
      Toast.info("请输入验证码");
      return;
    }

    let params = {
      username: text,
      password: pwd,
      code,
    };
    showCode ? delete params.password : delete params.code;
    try {
      let res = await login(params);
      localStorage.userdata = JSON.stringify(res.data);
      this.props.dispatch(save_user(res.data));
      Toast.success("登录成功", 1, () => {
        this.props.history.replace("/");
      });
    } catch (error) {
      console.log("数据", error);
    }
  };
  render() {
    let {
      showCode,
      imgUrl,
      text,
      pwd,
      passType,
      eays,
      code,
      isMail,
    } = this.state;
    return (
      <div className="login">
        <Nav title="登录" />
        <div className="menu_box">
          <div className="login_icon">
            <img src={imgUrl} alt="图片" />
            {/* <div className="logo_name">币行</div> */}
            <div className="logo_name">币行-模拟</div>
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
          {!showCode ? (
            // 密码登录
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
          ) : (
            // 验证码登录
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
                  keyType="login"
                  isMail={isMail}
                  className="my_cont_set"
                />
              </div>
            </div>
          )}
          <div className="jump">
            <div
              className="change_mail"
              onClick={() => this.setState({ isMail: !isMail, text: "" })}
            >
              {!isMail ? "邮箱登录" : "手机登录"}
            </div>
            <span
              onClick={() => {
                this.setState({
                  showCode: !showCode,
                });
              }}
            >
              {showCode ? "密码登录" : "验证码登录"}
            </span>
          </div>

          <div className="btns">
            <button className="btn" type="button" onClick={this.sumitFn}>
              登录
            </button>
            <div>
              没有账号？
              <span
                onClick={() => {
                  this.props.history.push("/register");
                }}
              >
                去注册
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect()(Login);
