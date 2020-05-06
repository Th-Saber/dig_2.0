// import Vue from 'vue'
import App from "./App.vue";
import router from "./router"; //路由
// import "@/assets/styles/theme/index.css";
// import store from "./store"; //vuex
//引入animation.css
// import "@/assets/styles/animation.css";
// 不知到啥用
// import "default-passive-events";
//引入ElementUI组件
// import ElementUI from 'element-ui';
import Message from "element-ui/packages/message/index.js";
// import 'element-ui/lib/theme-chalk/index.css';
import "@/icons"; //使用svg组件
import "@/utils/moment"; //国际化moment
import "@/apis/intercept"; //请求响应拦截器

import { agencyConfig, orderConfig } from "./menuConfig";

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.name == "login" || to.name == "error") {
    next();
  } else {
    if (sessionStorage.userdata) {
      let { authIds, userType } = JSON.parse(sessionStorage.userdata);

      let arr = [];
      if (userType === 0) {
        //管理员
        next();
        return;
      } else if (userType === 2) {
        agencyConfig.forEach((v) => {
          if (v.children) {
            v.children.forEach((c) => {
              arr.push(c.path);
            });
          } else {
            arr.push(v.path);
          }
        });
        //代理商
      } else {
        orderConfig.forEach((v) => {
          if (checkAuth(v.auth, authIds)) {
            if (v.children) {
              v.children.forEach((c) => {
                if (checkAuth(c.auth, authIds)) {
                  arr.push(c.path);
                }
              });
            } else {
              arr.push(v.path);
            }
          }
        });
      }
      if (arr.indexOf(to.path) !== -1) {
        next();
      } else {
        next({
          path: "/404",
        });
      }
    } else {
      Message({
        type: "warning",
        message: "请先登录",
      });
      next({
        path: "/login",
      });
    }
  }
});

function checkAuth(arr, authIds) {
  if (!arr) return true;
  for (const v of arr) {
    if (authIds.indexOf(v) !== -1) return true;
  }
  return false;
}

// Vue.use(ElementUI)

new Vue({
  router,
  //   store,
  render: (h) => h(App),
}).$mount("#app");
