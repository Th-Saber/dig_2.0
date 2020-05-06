import axios from "axios";
// import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 获取充值数据列表
export function getTopUpList() {
  return axios.get("coin-address/find/my");
}
// 提现表单
export function wallForm(params) {
  return axios.post("withdraw/apply/withdraw", params);
}
// 提现记录
export function wallFormList(params) {
  return axios.get("withdraw/find/my", { params });
}
