import React, { Component } from "react";
import { Tabs } from "antd-mobile";
import Two1 from "./Two_itmes/Two_1";
import Two2 from "./Two_itmes/Two_2";

export default class Two extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actBtn: "trading", //交易：trading  记录：record
    };
  }
  //   改变交易等数据
  changeBuyGroup = (value) => {
    let { actBtn } = this.state;
    if (actBtn === value) return;
    this.setState({
      actBtn: value,
    });
  };

  render() {
    let { actBtn } = this.state;
    return (
      <div className="two">
        <Tabs
          tabs={[{ title: "交易" }, { title: "记录" }]}
          page={actBtn === "trading" ? 0 : 1}
          renderTabBar={() => (
            <div className="buy_group">
              <button
                type="button"
                onClick={() => this.changeBuyGroup("trading")}
                className={actBtn === "trading" ? "buy_group_act_btn" : ""}
              >
                交易
              </button>
              <button
                type="button"
                onClick={() => this.changeBuyGroup("record")}
                className={actBtn === "record" ? "buy_group_act_btn" : ""}
              >
                记录
              </button>
            </div>
          )}
          swipeable={false}
          tabBarUnderlineStyle={{ height: 0, backgroundColor: "#f60" }}
        >
          <Two1 />
          <Two2 />
        </Tabs>
      </div>
    );
  }
}
