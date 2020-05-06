import Login from "@pages/Login/Login";
import Register from "@pages/Register/Register";
//-----------------主要页面-----------------------//
import Nav from "@layouts/Nav";
import {
  BankCard,
  RealName,
  AddCard,
  Setting,
  AboutUs,
  Log,
  InviteCode,
} from "@pages/My";
import { ContractWare, ReleaseDeal, FbPayList, FbUser } from "@pages/Wallet";
import { Trend } from "@pages/Market";
import { TopUp, Withdrawal, WithDrawalInfo } from "@pages/Mill";
import { HelpCenter, NewsPage } from "@pages/Home";
// auth: true //是否需要进行身份验证
const config = [
  {
    path: "/",
    name: "Nav",
    component: Nav,
    auth: true,
  },
  {
    path: "/bankCard",
    name: "BankCard",
    component: BankCard,
    auth: true,
  },
  {
    path: "/realName",
    name: "RealName",
    component: RealName,
    auth: true,
  },
  {
    path: "/addCard",
    name: "AddCard",
    component: AddCard,
    auth: true,
  },
  {
    path: "/contractWare",
    name: "ContractWare",
    component: ContractWare,
    auth: true,
  },
  {
    path: "/fbPayList",
    name: "FbPayList",
    component: FbPayList,
    auth: true,
  },
  {
    path: "/trend",
    name: "Trend",
    component: Trend,
    auth: true,
  },
  {
    path: "/releaseDeal",
    name: "ReleaseDeal",
    component: ReleaseDeal,
    auth: true,
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    auth: true,
  },
  {
    path: "/aboutUs",
    name: "AboutUs",
    component: AboutUs,
    auth: true,
  },
  {
    path: "/topUp",
    name: "TopUp",
    component: TopUp,
    auth: true,
  },
  {
    path: "/withdrawal",
    name: "Withdrawal",
    component: Withdrawal,
    auth: true,
  },
  {
    path: "/helpCenter",
    name: "HelpCenter",
    component: HelpCenter,
    auth: true,
  },
  {
    path: "/newsPage",
    name: "NewsPage",
    component: NewsPage,
    auth: true,
  },
  {
    path: "/log",
    name: "Log",
    component: Log,
    auth: true,
  },
  {
    path: "/fbUser",
    name: "FbUser",
    component: FbUser,
    auth: true,
  },
  {
    path: "/withdrawalInfo",
    name: "WithDrawalInfo",
    component: WithDrawalInfo,
    auth: true,
  },
  {
    path: "/inviteCode",
    name: "InviteCode",
    component: InviteCode,
    auth: true,
  },

  // 登录 注册 忘记密码
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
];
export default config;
