import axios from "axios";
// import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 登录
export function login(params) {
  return axios.post("login", params);
}
// 上传图片
export function upLoadImg(params) {
  return axios.post("upload/img", params, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
// 发送验证码
export function getCode(params) {
  return axios.get(`tel/send/code`, { params });
}
// 发送邮箱验证码
export function getEmailCode(params) {
  return axios.get(`mail/send/code`, { params });
}
// 修改登录密码  支付密码
export function setPassPay(params) {
  return axios.post(`users/update/password`, params);
}
// 注册
export function register(params) {
  return axios.post(`users/register`, params);
}
// 充值
export function topUp(params) {
  return axios.get(`users/set/pay-password`, { params });
}
// 转账
export function toMoney(params) {
  return axios.get(`coin-my/transfer`, { params });
}
// 设置支付密码
export function setPayPass(params) {
  return axios.get(`users/set/pay-password`, { params });
}
// 查询轮播
export function findCarousel() {
  return axios.get(`carousel/find/all`);
}
// 查询新闻
export function findNews(params) {
  return axios.get(`message/find/all`, { params });
}
// 查询用户须知
export function findNotice() {
  return axios.get(`message/find/rule`);
}
