// import axios from "axios"
import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */

//  查找用户数据
export function findUser(params) {
  return axios.get("users/find/all", { params });
}
//  设置账号类型
export function setType(params) {
  return axios.get("users/set/type", { params });
}
// 重置密码
export function resetPass(params) {
  return axios.get("users/reset/password", { params });
}
// 锁定用户
export function lockUser(params) {
  return axios.get("users/set/state", { params });
}
// 设置用户邀请码
export function setMarkCode(params) {
  return axios.get("users/set/mark-code", { params });
}
// 审核用户
export function certUser(params) {
  return axios.get("users/audit/cert", { params });
}
// 删除用户
export function delUser(params) {
  return axios.get("users/del", { params });
}
