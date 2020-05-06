import React from "react";
import "./index.less";
import { Tabs, WhiteSpace } from "antd-mobile";
import { connect } from "react-redux";
import Cont1 from "./Cont_items/Cont1";
import Cont2 from "./Cont_items/Cont2";

import socket from "@serve";

class Cont extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topHeadList: [
        { labal: "合约下单", value: "cont" },
        { labal: "合约持仓", value: "bb" },
      ],
      actTop: "cont", //cont 合约；bb 持币
      open: false,
      handNum: 0,
      //   自定义数据
      upData: [],
      downData: [],
      rate: 0, //当前价格
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (Object.keys(data).length === 0) {
      return null;
    }
    let upData = data.depth.asks.splice(0, 5).reverse();
    let downData = data.depth.bids.splice(0, 5);
    return {
      upData,
      downData,
      rate: data.detail.tick.close,
    };
  }

  //  选中数据
  changeTop = (type) => {
    let { actTop } = this.state;
    if (type === actTop) return;
    if (type === "cont") {
      this.cont_1_flash && this.cont_1_flash();
    } else {
      this.onReflash && this.onReflash();
    }
    socket.send(type === "cont" ? sessionStorage.actType || "BTC" : "DETAIL");
    this.setState({
      actTop: type,
    });
  };
  render() {
    let { topHeadList, actTop, upData, downData, rate } = this.state;
    return (
      <div className="cont">
        <div className="top_type">
          {topHeadList.map((v, i) => {
            return (
              <div
                key={i + "top"}
                onClick={this.changeTop.bind(this, v.value)}
                className={`T_text ${actTop === v.value ? "top_active" : ""}`}
              >
                {v.labal}
              </div>
            );
          })}
          {/*右侧图标 */}
          <div className="bb_head_top">
            <img
              src={require("@/assets/imgs/icon_line.png")}
              onClick={() => {
                this.props.history.push({ pathname: "trend" });
              }}
              alt=""
            />
            &emsp;
            <img
              src={require("@/assets/imgs/icon_record.png")}
              onClick={() => {
                this.props.history.push({
                  pathname: "contractWare",
                  state: {},
                });
              }}
              alt="图标"
            />
          </div>
        </div>
        <WhiteSpace size="lg" />
        <Tabs
          tabs={[{ title: "交易" }, { title: "记录" }]}
          page={actTop === "cont" ? 0 : 1}
          renderTabBar={() => null}
          swipeable={false}
          tabBarUnderlineStyle={{
            height: 0,
            backgroundColor: "#f60",
          }}
        >
          <Cont1
            upData={upData}
            downData={downData}
            rate={rate}
            onReflash={(e) => (this.cont_1_flash = e)}
            loadType={this.onReflash}
          />
          <Cont2 onReflash={(e) => (this.onReflash = e)} />
        </Tabs>
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData.CONT,
  };
}
export default connect(filter)(Cont);
