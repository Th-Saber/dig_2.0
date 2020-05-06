import React, { useState, useEffect } from "react";
// import ReactDom from "react-dom";
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
 * maxLen [Number]: 密码框长度
 * onInputEnd [Function]: 密码输入完成后回调函数
 * endClose [Boolean]: 密码输入完成后是否关闭弹窗  默认为true
 * outAnmation [Boolean]: 密码输入完成弹窗退出动画  默认为true
 */
export default function PassModel({
  maxLen = 6,
  onInputEnd,
  outAnmation = true,
}) {
  const [text, setText] = useState("");
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (maxLen === text.length) {
      outAnmation && setEnd(true); //退出动画效果  可要可不要
      setTimeout(() => {
        onInputEnd && onInputEnd(text);
        removeModel();
      }, 200);
    }
    return () => {};
  }, [text]);

  function showItemPass() {
    let domArr = [];
    for (let i = 0; i < maxLen; i++) {
      domArr.push(
        <div
          key={i + "pwd_i"}
          className={`passItme ${text[i] ? "input_out" : ""} ${
            i === text.length ? "next_box_input" : ""
          }`}
        />
      );
    }
    return domArr;
  }

  return (
    <div className={`my_pass_model ${end ? "an_end_move" : "an_start_move"}`}>
      <span>请输入支付密码</span>
      <label>
        <input
          type="number"
          autoFocus
          onPaste={(e) => e.preventDefault()}
          value={text}
          maxLength={maxLen}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <div className="pwd_item">{showItemPass()}</div>
      </label>
    </div>
  );
}
