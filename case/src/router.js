// import Vue from 'vue'
// import Router from 'vue-router'
import Home from "./pages/Home/Home.vue";
import NavTab from "@/layout/navTab.vue";

// Vue.use(Router)

// const router= new Router({
const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "nav",
      component: NavTab,
      redirect: "/home",
      children: [
        // 工作台
        {
          path: "/home",
          name: "home",
          component: Home,
        },
        {
          path: "/news",
          name: "news",
          component: () => import("@/pages/News/News.vue"),
        },
        {
          path: "/personal",
          name: "personal",
          component: () => import("@/pages/Personal/Personal.vue"),
        },
        {
          path: "/c2c",
          name: "c2c",
          component: () => import("@/pages/C2C/C2C.vue"),
        },
        {
          path: "/cont",
          name: "cont",
          component: () => import("@/pages/Cont/Cont.vue"),
        },
        {
          path: "/options",
          name: "options",
          component: () => import("@/pages/Options/Options.vue"),
        },
      ],
    },
    // 登录路由
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/Login/Login.vue"),
    },
    //404地址
    {
      path: "*",
      name: "error",
      component: () => import("@/layout/Error.vue"), //提供了Error.vue和Err404.vue两种错误组件样式
    },
  ],
});

export default router;
