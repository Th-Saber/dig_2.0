import React, { useReducer } from "react";
import "./index.less";
import store from "@store";
import { save_user } from "@store/action";
import { CountDown } from "@coms";
import { testRule } from "@utils/rule";
import { removeModel } from "./ModelBox";
import { setPassPay } from "@apis/api";
import { Toast } from "antd-mobile";

const initialState = {
  code: "",
  loginPass: "",
  payPass: "",
  watchLogin: false, //查看登录密码
  watchPay: false, //查看交易密码
};

function reducer(state, action) {
  switch (action.type) {
    case "change":
      return { ...state, ...action.data };
    default:
      return state;
  }
}
/**
 *
 * @param {obj} props
 *
 * onRef [Function]:返回一个对象 {open:打开弹框，close:关闭弹框} *该参数设置后visibel参数失效 （内部控制模态框状态）
 * mask [Boolean]:点击蒙层关闭弹窗  默认为true
 * visibel [Boolean]:控制弹窗显示与隐藏
 * closeBack [Function]:弹窗关闭回调函数   如果用visible来控制，该选项为必填：推荐回调函数在父组件设置visibel=false （父组件控制模态框状态）
 * outAnmation [Boolean]: 密码输入完成弹窗退出动画  默认为true
 */
export default function CheckModel({ history }) {
  let userdata = JSON.parse(localStorage.userdata);
  let tel = userdata.tel || userdata.mail;
  let isMail = !userdata.tel;
  let inputArr = [
    {
      label: "账号",
      name: "tel",
      value: tel,
      disabled: true,
    },
    {
      label: "验证码",
      name: "code",
      cout: true,
      type: "text",
      max: 4,
    },
  ];
  let passArr = [
    {
      label: "登录密码",
      name: "loginPass",
      other: "watchLogin",
      max: 12,
    },
    {
      label: "交易密码",
      name: "payPass",
      other: "watchPay",
      max: 6,
    },
  ];
  const [state, dispatch] = useReducer(reducer, initialState);

  //   提交金额
  async function submitFn() {
    let { payPass, loginPass, code } = state;
    if (!code) {
      Toast.info("请输入验证码");
      return;
    }
    if (!loginPass && !payPass) {
      Toast.info("登录密码与支付密码至少填写一个");
      return;
    }
    if (loginPass && !testRule("password", loginPass)) {
      Toast.info("登录密码由数字或字母组成且长度要在6-12位之间");
      return;
    }
    if (payPass && !testRule("number", payPass)) {
      Toast.info("支付密码只能由数字组成");
      return;
    }
    let params = {
      captcha: state.code,
      isTel: !isMail,
      account: tel,
      password: loginPass,
      payPassword: payPass,
    };
    for (const key in params) {
      params[key] || delete params[key];
    }
    try {
      await setPassPay(params);
      Toast.success("设置成功", 1);
      if (params.password) {
        localStorage.clear();
        history.push("/login");
      } else if (params.payPassword) {
        if (!userdata.payPassword) {
          userdata.payPassword = "xxxxxx";
          localStorage.userdata = JSON.stringify(userdata);
          store.dispatch(save_user(userdata));
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      removeModel();
    }
  }
  return (
    <div className="my_check_model an_start_move">
      <span className="top_tip">修改密码</span>
      {inputArr.map((v, i) => {
        return (
          <div className="inputCom" key={i + "isd"}>
            <div className="label user_label">{v.label}</div>
            <div className="input_box">
              <input
                type={v.type}
                value={v.value || state[v.name]}
                disabled={v.disabled}
                placeholder={"请输入" + v.label}
                onChange={(e) =>
                  dispatch({
                    type: "change",
                    data: {
                      [v.name]: e.target.value.slice(0, v.max),
                    },
                  })
                }
              />
            </div>
            {v.cout && (
              <CountDown
                tel={tel}
                keyType="password"
                isMail={isMail}
                className="my_cont_set"
              />
            )}
          </div>
        );
      })}
      <span className="bot_tip">输入新密码</span>
      {passArr.map((v, i) => {
        return (
          <div className="inputCom" key={i + "isd"}>
            <div className="label">{v.label}</div>
            <div className="input_box">
              <input
                type={state[v.other] ? "text" : "password"}
                value={state[v.name]}
                placeholder={"请输入" + v.label}
                maxLength={v.max}
                onChange={(e) =>
                  dispatch({
                    type: "change",
                    data: {
                      [v.name]: e.target.value.slice(0, v.max),
                    },
                  })
                }
              />
              <img
                onClick={() =>
                  dispatch({
                    type: "change",
                    data: { [v.other]: !state[v.other] },
                  })
                }
                src={require("@/assets/imgs/icon_eays.png")}
                alt="密码"
              />
            </div>
          </div>
        );
      })}
      <button className="bot_btn" type="button" onClick={submitFn}>
        完成
      </button>
    </div>
  );
}
