// import axios from "axios"
import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 登录
export function login(params) {
  return axios.post("login", params);
}
// 充值
export function goTopUp(params) {
  return axios.post("pay/top-up", params);
}
//查询用户余额
export function findUSDT(params) {
  return axios.get("coin-my/find/users", { params });
}
// 充值usdt币
export function addUSDT(params) {
  return axios.get("deal-fiat-log/add/usdt", { params });
}
// 修改密码
export function editPass(params) {
  return axios.post("admin/update/password", params);
}
