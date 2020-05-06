import React, { useState, useEffect } from "react";
import { TabBar } from "antd-mobile";
import { getUSDT } from "@serve/polling";
import socket from "@serve";

// 选项
import Home from "./Home/Home";
import Market from "./Market/Market";
import Wallet from "./Wallet/Wallet";
import Mill from "./Mill/Mill";
import My from "./My/My";

// 导航配置
export default function Nav({ history }) {
  const [actTab, setActTab] = useState(window.actTab || "home");
  useEffect(() => {
    getUSDT();
    return () => {};
  });
  const tabsConfig = [
    {
      name: "home",
      title: "首页",
      icon: require("@assets/imgs/home.png"),
      active: require("@assets/imgs/home_act.png"),
      item: Home,
    },
    {
      name: "market",
      title: "行情",
      icon: require("@assets/imgs/market.png"),
      active: require("@assets/imgs/market_act.png"),
      item: Market,
    },
    {
      name: "wallet",
      title: "交易",
      icon: require("@assets/imgs/wallet.png"),
      active: require("@assets/imgs/wallet_act.png"),
      item: Wallet,
    },
    {
      name: "mill",
      title: "资产",
      icon: require("@assets/imgs/mill.png"),
      active: require("@assets/imgs/mill_act.png"),
      item: Mill,
    },
    {
      name: "my",
      title: "我的",
      icon: require("@assets/imgs/my.png"),
      active: require("@assets/imgs/my_act.png"),
      item: My,
    },
  ];
  return (
    <TabBar
      barTintColor="#1b2538"
      tintColor="#3787e5"
      unselectedTintColor="#797f93"
      prerenderingSiblingsNumber={0}
    >
      {tabsConfig.map((v) => {
        return (
          <TabBar.Item
            title={v.title}
            key={v.name}
            icon={<img src={v.icon} width="26em" height="26em" alt={v.title} />}
            selectedIcon={
              <img src={v.active} width="26em" height="26em" alt={v.title} />
            }
            selected={actTab === v.name}
            onPress={() => {
              if (actTab === v.name) return;
              window.actTab = v.name;
              //   首页资产
              if (v.name === "home" || v.name === "market") {
                socket.send("DETAIL");
              } else if (v.name === "wallet") {
                if (sessionStorage.wAct === "two") {
                  socket.send("DUAL");
                } else {
                  socket.send(sessionStorage.actType || "BTC");
                }
              }
              setActTab(v.name);
              getUSDT();
            }}
          >
            <v.item history={history} />
          </TabBar.Item>
        );
      })}
    </TabBar>
  );
}
