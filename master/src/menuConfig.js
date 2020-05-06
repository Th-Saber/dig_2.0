const menuConfig = [
  {
    path: "/user",
    name: "用户中心",
    icon: "user",
  },
  {
    path: "/trading",
    name: "交易中心",
    icon: "trading",
    children: [
      {
        path: "/fb",
        name: "法币交易",
      },
      {
        path: "/contract",
        name: "合约交易",
      },
      {
        path: "/two",
        name: "二元期权",
      },
      {
        path: "/bb",
        name: "币币管理",
      },
      {
        path: "/money",
        name: "余额管理",
      },
    ],
  },
  {
    path: "/role",
    name: "角色管理",
    icon: "role",
  },
  {
    path: "/fund",
    name: "资金管理",
    icon: "fund",
  },
  {
    path: "/setting",
    name: "设置",
    icon: "setting",
    children: [
      {
        path: "/setDeal",
        name: "交易设置",
      },
      {
        path: "/setting",
        name: "其他设置",
      },
    ],
  },
];
// 代理商数据
const agencyConfig = [
  {
    path: "/b_customer",
    name: "客户中心",
    icon: "b_customer",
  },
  {
    path: "/trading",
    name: "交易中心",
    icon: "trading",
    children: [
      {
        path: "/fb",
        name: "法币交易",
      },
      {
        path: "/contract",
        name: "合约交易",
      },
      {
        path: "/two",
        name: "二元期权",
      },
      {
        path: "/bb",
        name: "币币管理",
      },
      {
        path: "/money",
        name: "余额管理",
      },
    ],
  },
  {
    path: "/fund",
    name: "资金管理",
    icon: "fund",
  },
];
// 其他角色
const orderConfig = [
  {
    path: "/user",
    name: "用户中心",
    icon: "user",
    auth: [1, 6],
  },
  {
    path: "/trading",
    name: "交易中心",
    icon: "trading",
    auth: [3],
    children: [
      {
        path: "/fb",
        name: "法币交易",
        auth: [3],
      },
      {
        path: "/contract",
        auth: [3],
        name: "合约交易",
      },
      {
        path: "/two",
        name: "二元期权",
        auth: [3],
      },
      {
        path: "/bb",
        name: "币币管理",
        auth: [2],
      },
      {
        path: "/money",
        name: "余额管理",
        auth: [2],
      },
    ],
  },
  {
    path: "/role",
    name: "角色管理",
    auth: [6],
    icon: "role",
  },
  {
    path: "/fund",
    name: "资金管理",
    icon: "fund",
    auth: [2],
  },
  {
    path: "/setting",
    name: "设置",
    auth: [4],
    icon: "setting",
    children: [
      {
        path: "/setDeal",
        name: "交易设置",
      },
      {
        path: "/setting",
        name: "其他设置",
      },
    ],
  },
];
export { menuConfig, agencyConfig, orderConfig };
