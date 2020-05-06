import axios from "axios";
// import qs from "qs";
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})
 */
// 获取资产币
export function findProperty(params) {
  return axios.post("coin-my/find/my-coin/details", params);
}
// 查询可用的usdt
export function findUseUSDT() {
  return axios.get("coin-my/find/my/usdt/details", {
    headers: {
      unLoad: true,
    },
  });
}
