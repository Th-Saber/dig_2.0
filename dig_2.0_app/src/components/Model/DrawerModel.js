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

export default function DrawerModel({ value = "", data = [], onClick }) {
  const [actVlaue, setActVlaue] = useState(value);
  const [start, setStart] = useState(true);

  //   点击确定按钮
  function changeTab(v, i) {
    setActVlaue(v);
    setStart(false);
    setTimeout(() => {
      value !== v && onClick && onClick(v, i);
      removeModel();
    }, 500);
  }
  return (
    <div
      className={`my_drawer_model ${start ? "an_start_slid" : "an_end_slid"}`}
    >
      <div className="title">
        <img src={require("@/assets/imgs/icon_menu.png")} alt="" />
        &emsp;币种
      </div>
      <div className="drawer_box">
        {data.map((v, i) => {
          return (
            <div
              className={`drawer_box_item ${
                v.value === actVlaue ? "drawer_box_item_act" : ""
              }`}
              key={i + "dr_li"}
              onClick={() => changeTab(v.value, i)}
            >
              {v.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
