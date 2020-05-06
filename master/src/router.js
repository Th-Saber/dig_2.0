// import Vue from 'vue'
// import Router from 'vue-router'
import User from "./pages/User/User.vue";
import NavTab from "@/layout/navTab.vue";

// Vue.use(Router)

// const router= new Router({
const router = new VueRouter({
  //     mode: "history",
  //   base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "nav",
      component: NavTab,
      redirect: "/login",
      children: [
        // 工作台
        {
          path: "/user",
          name: "user",
          component: User,
        },
        {
          path: "/fb",
          name: "fb",
          component: () => import("@/pages/Trading/Fb.vue"),
        },
        {
          path: "/bb",
          name: "bb",
          component: () => import("@/pages/Trading/BB.vue"),
        },
        {
          path: "/two",
          name: "two",
          component: () => import("@/pages/Trading/Two.vue"),
        },
        {
          path: "/money",
          name: "money",
          component: () => import("@/pages/Trading/Money.vue"),
        },
        {
          path: "/contract",
          name: "contract",
          component: () => import("@/pages/Trading/Contract.vue"),
        },
        {
          path: "/role",
          name: "role",
          component: () => import("@/pages/Role/Role.vue"),
        },
        {
          path: "/setDeal",
          name: "setDeal",
          component: () => import("@/pages/Setting/SetDeal.vue"),
        },
        {
          path: "/setting",
          name: "setting",
          component: () => import("@/pages/Setting/Setting.vue"),
        },
        {
          path: "/fund",
          name: "fund",
          component: () => import("@/pages/Fund/Fund.vue"),
        },
        // b_代理商
        {
          path: "/b_customer",
          name: "b_customer",
          component: () => import("@/pages/B_pages/Customer.vue"),
        },
        {
          path: "/b_money",
          name: "b_money",
          component: () => import("@/pages/B_pages/Money.vue"),
        },
        {
          path: "/b_trading",
          name: "b_trading",
          component: () => import("@/pages/B_pages/Trading.vue"),
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
