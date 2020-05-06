import axios from "axios";
// import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 获取可交易的法币
export function getFbList(params) {
  return axios.get("deal-fiat/find/all", { params });
}
// 获取合约可切换的b的类型
export function getCoinType() {
  return axios.get("coin-setting/get/hand/num/all");
}
// 获取合约当前委托列表
export function getEntrustList(params) {
  return axios.get("deal-contract/find/my/delegate", { params });
}
// 获取指定币倍数
export function getBeUsdt(params) {
  return axios.get("deal-contract/get/be/usdt", { params });
}
// 买入合约
export function buyCont(params) {
  return axios.post("deal-contract/buy", params);
}
// 发布法币
export function sellSend(params) {
  return axios.post("deal-fiat/release", params);
}
// 购买法币
export function buyFiat(params) {
  return axios.post("deal-fiat/buy", params);
}
// 购买二元期权
export function buyDual(params) {
  return axios.post("deal-dual/buy", params);
}
// 期权列表详情
export function dualList(params) {
  return axios.get("deal-dual/find/all", { params });
}
// 获取利润时间比例
export function getRageTime(params) {
  return axios.get("deal-dual-profit/find/all", { params });
}
// 获取法币log比例
export function getFbLog(params) {
  return axios.get("deal-fiat/find/log", { params });
}
// 设置盈亏
export function setYK(params) {
  return axios.post("deal-contract/set/auto", params);
}
// 撤单
export function outDan(params) {
  return axios.get("deal-contract/undo", { params });
}
// 平仓
export function onePinC(params) {
  return axios.get("deal-contract/close/position", { params });
}
// 查询id 交易信息
export function dealInfoId(params) {
  return axios.get("deal-fiat/find/user/msg", { params });
}
// 确定交易
export function orderOk(params) {
  return axios.post("deal-fiat/ok/order", params);
}
//同意订单
export function orderAgree(params) {
  return axios.post("deal-fiat/agree", params);
}
// 不同意交易
export function orderUnDo(params) {
  return axios.post("deal-fiat/undo/order", params);
}
// 同意此交易
export function agreeDeal(params) {
  return axios.get("deal-fiat/agree", { params });
}
