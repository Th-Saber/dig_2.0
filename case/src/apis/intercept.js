// import axios from 'axios'
import router from "../router";
import IP from "./ip";
import Message from "element-ui/packages/message/index.js";

axios.defaults.timeout = 10000; //请求超时时间 单位(毫秒)
axios.defaults.baseURL = IP; //默认地址
// axios的请求拦截器
axios.interceptors.request.use(config => {
  // 获取token
  const token = sessionStorage.token;
  // 在请求头中携带token
  config.headers.token = token;
  return config;
});
//响应拦截器
axios.interceptors.response.use(
  function(response) {
    if (response.data.code == 200) {
      //请求成功
      return response.data;
    } else if (response.data.code == 10001) {
      //未登录 登录失效
      Message.error(response.data.msg);
      sessionStorage.clear(); //清除token等保存在本地的参数
      router.push("/login");
      return Promise.reject(response.data);
    } else {
      Message.error(response.data.msg);
      return Promise.reject(response.data);
    }
  },
  function(error) {
    if (error.message.includes("timeout")) {
      // 判断请求异常信息中是否含有超时timeout字符串
      Message.error("网络链接超时...");
      return Promise.reject(error); // reject这个错误信息
    }
    // Do something with response error
    return Promise.reject(error);
  }
);
