import React, { Component } from "react";
import { getCode, getEmailCode } from "@apis/api";
import { testRule } from "@utils/rule";
import { Toast } from "antd-mobile";
export default class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFlag: false,
      time: 60,
    };
  }
  static defaultProps = {
    className: "",
    text: "获取验证码",
    tel: "",
    keyType: "", //register 注册；login 登陆；password 修改密码
  };
  componentDidMount() {
    let { onRef } = this.props;
    onRef &&
      onRef({
        start: this.setInt,
      });
    this.checkWindowTime();
  }
  //   检查挂载到window上时间是否超时
  checkWindowTime = () => {
    if (window.timerSeconds && window.timerTime) {
      let time = new Date() - window.timerTime;
      let cout = window.timerSeconds - time;
      if (time < window.timerSeconds && cout > 3000) {
        this.setState(
          {
            time: Math.floor(cout / 1000),
            timeFlag: true,
          },
          this.setInt
        );
      }
      //   重置为空
      window.timerTime = "";
      window.timerSeconds = "";
    }
  };
  componentWillUnmount() {
    if (this.timer) {
      window.timerTime = new Date();
      window.timerSeconds = this.state.time * 1000;
      clearInterval(this.timer);
    }
  }
  //   设置倒计时
  setInt = () => {
    this.timer = setInterval(() => {
      if (this.state.time <= 0) {
        this.timer && clearInterval(this.timer);
        this.setState({
          timeFlag: false,
          time: 60,
        });
        return;
      }
      this.setState((state) => ({
        time: --state.time,
      }));
    }, 1000);
  };
  //   数据
  /**
   * @param {Null}
   * @returns {
   *    开始倒计时
   *    结束倒计时
   * }
   */
  clickCount = async () => {
    let { tel, keyType, isMail } = this.props;
    if (this.state.timeFlag) {
      return;
    }
    if (!tel) {
      Toast.info(`请先输入${isMail ? "邮箱" : "手机号"}`);
      return;
    }
    if (!testRule(isMail ? "email" : "phone", tel)) {
      Toast.info(`${isMail ? "邮箱格式" : "手机号码"}不正确`);
      return;
    }
    // 分数据
    this.setState({
      timeFlag: true,
    });
    try {
      if (isMail) {
        await getEmailCode({ mail: tel, type: keyType });
      } else {
        await getCode({ tel, key: keyType });
      }
      this.setInt();
    } catch (error) {
      this.setState({
        timeFlag: false,
      });
    }
  };
  //   错误设置倒计时
  errCount = () => {
    this.timer && clearInterval(this.timer);
    this.setState({
      timeFlag: false,
      time: 60,
    });
  };

  render() {
    let { timeFlag, time } = this.state;
    let { className, text } = this.props;
    return (
      <div className={`my_count ${className || ""}`} onClick={this.clickCount}>
        {timeFlag ? `${time}s` : text}
      </div>
    );
  }
}
