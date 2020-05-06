//
// import axios from "axios"
import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 查询资金管理
export function findFund(params) {
  return axios.get("deal-manage/find/all/user/deal/details", { params });
}
