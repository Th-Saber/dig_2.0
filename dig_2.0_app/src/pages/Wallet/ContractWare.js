import React, { Component } from "react";
import "./index.less";
import { Nav } from "@coms";
import { LineData } from "@layouts/Nav/Wallet/Itme/Com";
export default class ContractWare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabList: [
        {
          label: "委托中",
          value: 1,
          status: 2,
        },
        {
          label: "持仓中",
          value: 3,
          status: 1,
        },
        {
          label: "已平仓",
          value: 4,
          status: 3,
        },
        {
          label: "已撤单",
          value: 5,
          status: 5,
        },
      ],
      actTab: 1,
      actStatus: 2,
      dataList: [],
    };
  }
  //  改变数据类型
  changeTab = (val, status) => {
    let { actTab } = this.state;
    if (val === actTab) return;
    this.setState(
      {
        actTab: val,
        actStatus: status,
      },
      () => {
        this.onReflash && this.onReflash();
      }
    );
  };
  //   渲染数据
  _renderTab = () => {
    let { tabList, actTab } = this.state;
    let com = tabList.map((v, i) => {
      return (
        <div
          key={i + "sdf"}
          className={`tab_item ${actTab === v.value ? "tab_item_act" : ""}`}
          onClick={() => this.changeTab(v.value, v.status)}
        >
          {v.label}
        </div>
      );
    });
    return <div className="frid_box">{com}</div>;
  };
  render() {
    let { actTab, actStatus } = this.state;
    return (
      <div className="page_box contractWare">
        <Nav title="合约交易" back />
        <div className="page_menu set_menu">
          {this._renderTab()}
          <LineData
            onReflash={(e) => (this.onReflash = e)}
            status={actStatus}
            type={actTab}
          />
        </div>
      </div>
    );
  }
}
