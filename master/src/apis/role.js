// import axios from "axios"
import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */

//  查找后台用户
export function findAdmin(params) {
  return axios.get("admin/find/all", { params });
}
//  查找角色
export function findRole(params) {
  return axios.get("admin/find/all/role", { params });
}
//  添加用户
export function addUser(params) {
  return axios.post("admin/add", params);
}
//  添加角色
export function addRole(params) {
  return axios.post("admin/add/role", params);
}
//  删除角色
export function delRole(params) {
  return axios.get("admin/del/role", { params });
}
//  删除用户
export function delAdmin(params) {
  return axios.get("admin/del", { params });
}
//  切换用户角色
export function cutAdmin(params) {
  return axios.get("admin/cutover/role", { params });
}
//  重置用户密码
export function resetUserPass(params) {
  return axios.get("admin/reset/password", { params });
}
//  添加权限
export function findAuth() {
  return axios.get("admin/find/all/auth");
}
