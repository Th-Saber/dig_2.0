import store from "@store";
import { save_USDT } from "@store/action";
import { findUseUSDT } from "@apis/property";
let qusFlag;
// 获取各个类型的usdt
export function getUSDT(callback) {
  qusFlag && clearTimeout(qusFlag);
  qusFlag = setTimeout(async () => {
    try {
      let res = await findUseUSDT();
      store.dispatch(save_USDT(res.data || {}));
    } catch (error) {
      console.log("usdt错误", error);
    } finally {
      callback && callback();
    }
  }, 300);
}
