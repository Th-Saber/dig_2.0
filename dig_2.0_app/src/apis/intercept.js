import axios from "axios";
import IP from "./ip";
import { Toast } from "antd-mobile";
axios.defaults.timeout = 15000; //请求超时时间 单位(毫秒)
axios.defaults.baseURL = IP; //默认地址
// axios的请求拦截器
axios.interceptors.request.use((config) => {
  if (!config.headers.unLoad) Toast.loading("加载中。。。", 0);
  //   携带tkt
  if (localStorage.userdata) {
    // 获取token
    const userdata = JSON.parse(localStorage.userdata);
    config.headers.tkt = userdata.tkt;
  }
  return config;
});
//响应拦截器
axios.interceptors.response.use(
  function (response) {
    if (!response.config.headers.unLoad) Toast.hide();
    if (response.data.code === 200) {
      //请求成功
      return response.data;
    } else if (response.data.code === 1001) {
      //未登录 登录失效
      Toast.info(response.data.msg, 2, () => {}, false);
      //sessionStorage.clear();
      localStorage.clear();
      //   window.location.pathname = "/login";
      window.location.hash = "#/login";
      return Promise.reject(response.data);
    } else if (response.data.code === 500) {
      Toast.info("code:500");
      return Promise.reject(response.data);
    } else {
      Toast.info(response.data.msg);
      return Promise.reject(response.data);
    }
  },
  function (error) {
    Toast.hide();
    if (error.message.includes("timeout")) {
      Toast.info("网络链接超时...");
      return Promise.reject(error); // reject这个错误信息
    } else {
      Toast.info("网络错误");
      return Promise.reject(error);
    }
  }
);
