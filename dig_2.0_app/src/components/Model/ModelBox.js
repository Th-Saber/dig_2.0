import React from "react";
import ReactDom from "react-dom";

import PassModel from "./PassModel";
import InputModel from "./InputModel";
import PayModel from "./PayModel";
import CheckModel from "./CheckModel";
import HintModel from "./HintModel";
import PikerModel from "./PikerModel";
import YkModel from "./YkModel";
import DrawerModel from "./DrawerModel";
import InfoBox from "./InfoBox";
import NoticeModel from "./NoticeModel";
// 样式函数
const ModelStyle = {
  fixed: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  maskColor: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
// 顶级容器对象  储存类名
const TemeModel = {
  targetName: "my_model_class",
};
/**
 * 创建model框
 * @param {Object} query:[mask：是否点击蒙层关闭弹窗，callback：body渲染完成后的回调函数]
 */
export function createModel(type, params = {}) {
  let { mask = true, callback } = params;
  if (validateTarget()) return callback && callback();
  let popup = document.createElement("div");
  popup.className = TemeModel.targetName;
  document.body.appendChild(popup);
  let pageDom = renderPages(type, params);
  //   顶级容器
  let content = React.createElement(
    "div",
    {
      style: { ...ModelStyle.fixed, ...ModelStyle.flex, zIndex: 100 },
      className: "modelbox",
    },
    React.createElement("div", {
      className: "model_mask",
      style: { ...ModelStyle.fixed, ...ModelStyle.maskColor },
      onClick: () => mask && removeModel(),
    }), //蒙层
    type === "drawerModel"
      ? pageDom
      : React.createElement(
          "div",
          {
            style: { zIndex: 101 },
            className: "model_menu_box",
          },
          pageDom
        ) //内容容器
  );
  //   渲染到body上面
  ReactDom.render(content, popup);
}

// 根据类型渲染页面
function renderPages(type, params) {
  switch (type) {
    case "passModel":
      return <PassModel {...params} />;
    case "inputModel":
      return <InputModel {...params} />;
    case "payModel":
      return <PayModel {...params} />;
    case "checkModel":
      return <CheckModel {...params} />;
    case "hintModel":
      return <HintModel {...params} />;
    case "pikerModel":
      return <PikerModel {...params} />;
    case "ykModel":
      return <YkModel {...params} />;
    case "drawerModel":
      return <DrawerModel {...params} />;
    case "infoBox":
      return <InfoBox {...params} />;
    case "noticeModel":
      return <NoticeModel {...params} />;

    default:
      return null;
  }
}
/**
 * 移除model框
 * @param {Object} query:[callback：节点移除后的回调函数 返回值：true 移除成功， false 失败]
 */
export function removeModel(callback) {
  let popup = validateTarget();
  if (!popup) return;
  document.body.removeChild(popup);
  let isRemove = ReactDom.unmountComponentAtNode(popup);
  callback && callback(isRemove);
}

//查讯 body下是否存在 model容器 @param{targetName}
function validateTarget() {
  let popup = document.querySelector(`.${TemeModel.targetName}`);
  return popup;
}

// 数据data
export default {
  open: createModel,
};
