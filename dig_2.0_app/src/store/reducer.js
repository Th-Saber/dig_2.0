import { combineReducers } from "redux";
//历史列表
function userdata(state = {}, actions) {
  switch (actions.type) {
    case "save_user":
      return actions.data;
    case "remove_user":
      return {};
    default:
      return state;
  }
}
//ws数据
function wsData(
  state = {
    DETAIL: {},
    DUAL: {},
    KLINE: {},
    CONT: {},
  },
  actions
) {
  switch (actions.type) {
    case "save_ws":
      return { ...state, ...actions.data };
    default:
      return state;
  }
}
//USDT余额
function Ubi(state = "0", actions) {
  switch (actions.type) {
    case "save_USDT":
      return actions.data;
    default:
      return state;
  }
}
export default combineReducers({
  // key当前状态的状态名：value此状态对应的计算者
  userdata,
  wsData,
  Ubi,
});
