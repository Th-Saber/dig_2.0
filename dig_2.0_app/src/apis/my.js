import axios from "axios";
// import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 实名认证
export function setRealName(params) {
  return axios.post("users/upload/cert", params);
}
// 查询账单日志
export function findLog(params) {
  return axios.get("bill/find/all/my", { params });
}
// 修改银行卡信息
export function payMas(params) {
  return axios.post("users/update/pay-msg", params);
}
