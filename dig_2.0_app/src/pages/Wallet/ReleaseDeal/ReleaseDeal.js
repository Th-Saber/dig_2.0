import React, { useReducer } from "react";
import { Toast } from "antd-mobile";
import { Nav, ModelBox } from "@coms";
import { sellSend } from "@apis/trading";

import "./index.less";

const initialState = {
  num: "", //数量
  unitPrice: "", //单价
  low: "", //最低设置
  high: "", //最高设置
  payType: 0, //alipay 支付宝  bank 银行卡
  dealType: 0, //0 卖 1 买
};
function reducer(state, action) {
  switch (action.type) {
    case "change":
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// 发布交易
export default function ReleaseDeal({ history }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //   数据
  let userdata = JSON.parse(localStorage.userdata);
  //   验证是否实名
  if (userdata.userType === 1 && userdata.certReal !== 1) jumpSetName();
  let options = [
    {
      value: 0,
      label: "银行卡",
    },
    {
      value: 1,
      label: "支付宝",
    },
  ];
  let optionType = [
    {
      value: 0,
      label: "卖出",
    },
    {
      value: 1,
      label: "买入",
    },
  ];

  function jumpSetName() {
    ModelBox.open("hintModel", {
      msg: "请实名认证通过后再前往发布。。。",
      onClick: () => {
        history.push("/realName");
      },
    });
  }
  //  点击确认发布消息
  async function submitFn() {
    if (userdata.userType === 1 && userdata.certReal !== 1) {
      jumpSetName();
      return;
    }
    if (!state.unitPrice) {
      Toast.info("请输入交易单价");
      return;
    }
    if (!state.num) {
      Toast.info("请输入数量");
      return;
    }
    if (!state.low) {
      Toast.info("请输入最高额度");
      return;
    }
    if (!state.high) {
      Toast.info("请输入最低额度");
      return;
    }
    let params = {
      unitPrice: state.unitPrice,
      num: state.num,
      low: state.low,
      high: state.high,
      platform: state.payType,
      dealType: state.dealType,
    };
    try {
      await sellSend(params);
      Toast.success("发布成功", 2, () => {
        history.goBack();
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <div className="page_box releaseDeal">
      <Nav back title="发布交易" />
      <div className="page_menu releaseMenu">
        {/* 姓名 */}
        {/* <Input value={userdata.name} label="姓名" disabled /> */}
        {/* 手机号 */}
        {/* <Input value={userdata.tel} label="手机号" disabled /> */}
        {/* 单价 */}
        <Input
          value={state.unitPrice}
          label="单价"
          placeholder="设置交易单价"
          onChange={(text) =>
            dispatch({ type: "change", data: { unitPrice: text } })
          }
        />
        {/* 单价 */}
        <Input
          value={state.num}
          label="数量"
          placeholder="设置交易数量"
          onChange={(text) => dispatch({ type: "change", data: { num: text } })}
        />
        {/* 最低额度 */}
        <Input
          value={state.low}
          label="最低额度"
          placeholder="设置交易最低额度"
          onChange={(text) => dispatch({ type: "change", data: { low: text } })}
        />
        {/* 最高额度 */}
        <Input
          value={state.high}
          placeholder="设置交易最高额度"
          label="最高额度"
          onChange={(text) =>
            dispatch({ type: "change", data: { high: text } })
          }
        />
        {/* 支付方式 */}
        <Radio
          options={options}
          label="交易方式"
          keyName="pay"
          value={state.payType}
          onChange={(val) => {
            dispatch({ type: "change", data: { payType: val } });
          }}
        />
        {/* 发布类型 */}
        <Radio
          options={optionType}
          label="发布类型"
          keyName="deal"
          value={state.dealType}
          onChange={(val) => {
            dispatch({ type: "change", data: { dealType: val } });
          }}
        />
        <button type="button" className="submit_btn" onClick={submitFn}>
          确认发布
        </button>
      </div>
    </div>
  );
}

// 自定义Input

function Input({ value, label, onChange, disabled = false, placeholder }) {
  return (
    <div className="login_input">
      <div className="label">{label}：</div>
      <div className="input_box">
        <input
          type="number"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function Radio({ value, onChange, options, label, keyName }) {
  return (
    <div className="login_input">
      <div className="label">{label}：</div>
      <div className="right">
        {options.map((v, i) => {
          return (
            <div key={i + "mu_radio"} className="radio_box">
              <label>
                <input
                  type="radio"
                  hidden={true}
                  checked={v.value === value}
                  name={keyName}
                  onChange={() => onChange && onChange(v.value)}
                />
                <div className="ridio_menu" />
                {v.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
