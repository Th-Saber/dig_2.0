// import axios from "axios"
import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */

//  查找设置数据
export function findSetting() {
  return axios.get("setting/find/all");
}
//  根据id进行设置参数
export function byIdSet(params) {
  return axios.get("setting/update/id", { params });
}
//  获取手数设置
export function getHandNum() {
  return axios.get("coin-setting/get/hand/num/all");
}
//  设置手数
export function setHandNUm(params) {
  return axios.post("coin-setting/set/hand/num", params);
}
//  获取期权设置
export function getDual() {
  return axios.get("deal-dual-profit/find/all");
}
//  设置期权
export function setDual(params) {
  return axios.post("deal-dual-profit/update", params);
}

// 首页设置
// 查找新闻
export function findNews(params) {
  return axios.get("message/find/all", { params });
}
// 查找轮播
export function findCarousel() {
  return axios.get("carousel/find/all");
}
// 添加轮播
export function addCarousel(params) {
  return axios.post("carousel/upload", params, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
// 删除轮播
export function delCarousel(params) {
  return axios.get("carousel/del", { params });
}

// 添加新闻
export function addNews(params) {
  return axios.post("message/add", params);
}
// 编辑新闻
export function editNews(params) {
  return axios.post("message/update", params);
}
// 删除新闻
export function delNews(params) {
  return axios.get("message/del", { params });
}
