// import Vue from 'vue'
import App from "./App.vue";
import router from "./router"; //路由
// import store from "./store"; //vuex
//引入animation.css
import "@/assets/styles/animation.css";
import "@/assets/styles/theme.less";
// 不知到啥用
import "default-passive-events";
//引入ElementUI组件
// import ElementUI from 'element-ui';
// import Message from "element-ui/packages/message/index.js";
import "@/icons"; //使用svg组件
// import "element-ui/lib/theme-chalk/index.css";
import "@/utils/moment"; //国际化moment
import "@/apis/intercept"; //请求响应拦截器

// 路由拦截
// router.beforeEach((to, from, next) => {
//   if (to.name == "login") {
//     next();
//   } else {
//     if (sessionStorage.token) {
//       next();
//     } else {
//       Message({
//         type: "warning",
//         message: "请先登录",
//       });
//       next({
//         path: "/login",
//       });
//     }
//   }
// });

// Vue.use(ElementUI)

new Vue({
  router,
  //   store,
  render: (h) => h(App),
}).$mount("#app");
