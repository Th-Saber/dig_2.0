import React, { useState } from "react";
import "./index.less";
import { removeModel } from "./ModelBox";
/**
 *
 * @param {obj} props
 *
 * onRef [Function]:返回一个对象 {open:打开弹框，close:关闭弹框} *该参数设置后visibel参数失效 （内部控制模态框状态）
 * mask [Boolean]:点击蒙层关闭弹窗  默认为true
 * visibel [Boolean]:控制弹窗显示与隐藏
 * closeBack [Function]:弹窗关闭回调函数   如果用visible来控制，该选项为必填：推荐回调函数在父组件设置visibel=false （父组件控制模态框状态）
 * outAnmation [Boolean]: 密码输入完成弹窗退出动画  默认为true
 * queryBack [Function]: 确认按钮  返回值：输入的value
 */

export default function YkModel({ onClick, title, high, low }) {
  const [up, setUp] = useState(high || "");
  const [out, setOut] = useState(low || "");
  //   提交金额
  function submitFn() {
    onClick &&
      onClick({
        up,
        out,
      });
    removeModel();
  }
  return (
    <div className="my_yk_model an_start_move">
      <span className="title">{title || "设置"}</span>
      <div className="input_box">
        <div className="login_input">
          <div className="label">止盈</div>
          <div className="input_box">
            <input
              type="number"
              value={up}
              placeholder="输入止盈价格"
              autoFocus
              onChange={(e) => setUp(e.target.value)}
            />
          </div>
        </div>
        <div className="login_input">
          <div className="label">止损</div>
          <div className="input_box">
            <input
              type="number"
              value={out}
              placeholder="输入止损价格"
              onChange={(e) => setOut(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className="bot_btn" type="button" onClick={submitFn}>
        确定
      </button>
    </div>
  );
}
