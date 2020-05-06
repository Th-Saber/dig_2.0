/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */

// 查询发布列表
export function findDealFiat(params) {
  return axios.get("deal-fiat/find/all", { params });
}
// 查询交易列表
export function findTradFiat(params) {
  return axios.get("deal-fiat-log/find/all", { params });
}

// 添加信息到交易列表
export function addDealFiat(params) {
  return axios.post("deal-fiat/add", params);
}
// 审核状态
export function checkDealFiat(params) {
  return axios.get("deal-fiat-log/audit", { params });
}
// 查询所有合约交易
export function findContAll(params) {
  return axios.get("deal-contract/find/all", { params });
}
// 查询所有期权
export function findDualAll(params) {
  return axios.get("deal-dual/find/all", { params });
}
// 下架交易
export function downDeal(params) {
  return axios.get("deal-fiat/off/shelf", { params });
}
// 币币充值记录
export function bbTypeUp(params) {
  return axios.get("pay/find/all/coin", { params });
}
// 下架交易
export function showTypekk(params) {
  return axios.get("deal-fiat/off/shelf", { params });
}
// 查找提现
export function findWithdraw(params) {
  return axios.get("withdraw/find/all", { params });
}
// 确定提现
export function confirmWithdraw(params) {
  return axios.post("withdraw/audit", params);
}
// 可提币记录
export function onTiInfo(params) {
  return axios.get("pay/find/all/coin/user", { params });
}
// 确定提现可提币
export function pullTi(params) {
  return axios.post("pay/pull/user/type", params);
}
