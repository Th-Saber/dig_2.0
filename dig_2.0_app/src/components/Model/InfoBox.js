import React from "react";
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

export default function InfoBox({ title = "详情", msg, address }) {
  return (
    <div className="my_info_model an_start_move">
      <p className="title">{title}</p>
      <div className="my_info_box">
        <div className="label">地址：</div>
        <div className="right_box">{address}</div>
      </div>
      {msg && (
        <div className="my_info_box">
          <div className="label">驳回原因：</div>
          <div className="right_box">{msg}</div>
        </div>
      )}
      <button className="bot_btn" type="button" onClick={() => removeModel()}>
        确定
      </button>
    </div>
  );
}
