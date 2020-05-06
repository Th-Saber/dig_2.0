import React, { useReducer } from "react";
import "./index.less";
import { removeModel } from "./ModelBox";

const initialState = {
  money: "",
  num: "",
  allMoney: "",
  first: false,
  radio: "", //alipay 支付宝  bank 银行卡
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

export default function PassModel() {
  let inputArr = [
    { label: "买入估价", type: "money" },
    { label: "买入量", type: "num" },
    { label: "金额", type: "allMoney" },
  ];
  const [state, dispatch] = useReducer(reducer, initialState);
  //   提交金额
  function submitFn() {}
  return (
    <div className="my_pay_model an_start_move">
      <span className="top_tip">
        如何买入:下单买入>线下支付>点击完成付款>等待放币
      </span>
      {inputArr.map((v, i) => {
        return (
          <div className="inputCom" key={i + "isd"}>
            <div className="label">{v.label}</div>
            <div className="input_box">
              <input
                type="number"
                value={state[v.type]}
                placeholder="请输入"
                onChange={(e) =>
                  dispatch({
                    type: "change",
                    data: {
                      [v.type]: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        );
      })}
      <div className="pay_type">
        <div className="label">支付方式</div>
        <div className="right">
          <div className="radio_box">
            <label>
              <input
                type="radio"
                hidden={true}
                checked={state.radio === "alipay"}
                name="shut"
                onChange={() =>
                  dispatch({
                    type: "change",
                    data: { radio: "alipay" },
                  })
                }
              />
              <div className="ridio_menu" />
              支付宝
            </label>
          </div>
          <div className="radio_box">
            <label>
              <input
                type="radio"
                hidden={true}
                checked={state.radio === "bank"}
                name="shut"
                onChange={() =>
                  dispatch({
                    type: "change",
                    data: { radio: "bank" },
                  })
                }
              />
              <div className="ridio_menu" />
              银行卡
            </label>
          </div>
        </div>
      </div>
      <span className="bot_tip">交易须知</span>
      <button className="bot_btn" type="button" onClick={submitFn}>
        提交
      </button>
    </div>
  );
}
