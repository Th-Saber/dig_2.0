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

export default function InputModel({
  queryBack,
  title,
  showAll = false,
  allMoney = 0,
}) {
  const [value, setValue] = useState("");
  //   提交金额
  function submitFn() {
    queryBack && queryBack(value);
    removeModel();
  }
  return (
    <div className="my_input_model an_start_move">
      <span className="title">{title || "请输入金额"}</span>
      <div className="input_box">
        <input
          type="number"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="input_btn_box">
        <button className="input_btn bot_btn" type="button" onClick={submitFn}>
          确定
        </button>
        {showAll && (
          <button
            className="input_btn all_btn"
            type="button"
            onClick={() => setValue(allMoney)}
          >
            全部转入
          </button>
        )}
      </div>
    </div>
  );
}
