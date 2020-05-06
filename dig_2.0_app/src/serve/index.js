// import io from "socket.io-client";
import store from "@store";
import { save_ws } from "@store/action";
import { _ip } from "@apis/ip";
var _socket, sendTimer;
sessionStorage.sendType = "DETAIL"; // 设置ws默认值

function connctIo() {
  _socket = new WebSocket(_ip + sessionStorage.sendType);
  _socket.onmessage = (msg) => {
    let obj = JSON.parse(msg.data);
    switch (obj.type) {
      case "DETAIL": //行情
        obj.data = obj.data.map((v) => {
          return { ...v, detail: v.detail.tick };
        });

        break;
      case "DUAL": //数据
      case "KLINE": //k线图数据
        break;
      default:
        obj.type = "CONT";
        break;
    }
    // 保存到数据列表中显示
    store.dispatch(save_ws({ [obj.type]: obj.data }));
  };
  //   连接失败
  _socket.onclose = () => {
    console.log("ws链接失败");
    sendTimer && clearTimeout(sendTimer);
    // 掉线重连
    _socket = null;
    setTimeout(() => {
      connctIo();
    }, 2000);
  };
}
// 发送消息
function send(type) {
  if (sessionStorage.sendType !== type) sessionStorage.sendType = type;
  try {
    if (_socket) {
      _socket.send(type);
    } else {
      sendTimer = setTimeout(() => {
        send(type);
      }, 1000);
    }
  } catch (error) {
    console.log("数据列表", error);
  }
}
// 关闭socket

export default {
  connct: connctIo,
  send: send,
};
