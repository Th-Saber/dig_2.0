import React, { Component } from "react";
import "./index.less";
import { WhiteSpace, Toast } from "antd-mobile";
import { LineItem, LineData } from "../Com";
import { ModelBox } from "@coms";
import { connect } from "react-redux";
import { buyCont, getCoinType } from "@apis/trading";
import socket from "@serve";
class Cont1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drewData: [], //抽屉数据
      bType: sessionStorage.actType || "BTC",
      handNum: 0, //手数
      actBtn: 1, //1 买入；0 卖出
      actGroup: "market", //market 市场价；price 限价
      pTimes: "",
      maxNum: 500, //最大手数
      timesData: [
        {
          label: "5倍",
          value: 5,
        },
        {
          label: "20倍",
          value: 20,
        },
        {
          label: "50倍",
          value: 50,
        },
        {
          label: "100倍",
          value: 100,
        },
      ],
      numData: [
        {
          label: "10手",
          value: 10,
        },
        {
          label: "20手",
          value: 20,
        },
        {
          label: "50手",
          value: 50,
        },
        {
          label: "100手",
          value: 100,
        },
      ],
      timesValue: 5, //倍数激活
      numValue: 10, //手数激活
    };
  }
  componentDidMount() {
    // console.log("shuju", ModelBox.);
    let { onReflash } = this.props;
    onReflash && onReflash(this.onReflash);
    this.searchType();
  }
  //   搜索可切换列表数据
  searchType = async () => {
    let { bType } = this.state;
    try {
      let res = await getCoinType();
      let handObj = res.data.find((v) => v.coinType === bType);
      this.setState({
        drewData: res.data,
        handNum: handObj ? handObj.contractHandNum : 0,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  //   买入币种
  buyContFn = async () => {
    let { actBtn, actGroup, pTimes, timesValue, numValue, bType } = this.state;
    let { Ubi, loadType } = this.props;
    if (actGroup !== "market" && !pTimes) {
      Toast.info("请输入交易价格");
      return;
    }
    if (!numValue) {
      Toast.info("请输入买入手数");
      return;
    }
    if (Ubi.contractNum < this.showNumPrice()) {
      Toast.info("当前可用USDT不足");
      return;
    }
    // 打开输入密码模态框
    ModelBox.open("passModel", {
      onInputEnd: async (text) => {
        let params = {
          dealType: actBtn,
          num: numValue,
          multiple: timesValue,
          coinType: bType,
          unitPrice: pTimes,
          payPassword: text,
        };
        // 判断如果选择市价就删除unitPrice
        actGroup === "market" && delete params.unitPrice;
        try {
          await buyCont(params);
          Toast.success("买入成功", 2, () => {
            this.onReflash && this.onReflash();
            loadType && loadType();
          });
        } catch (error) {
          console.log("买入错误", error);
        }
      },
    });
    return;
  };
  //   显示抽屉
  showDrawer = () => {
    let { drewData, bType } = this.state;
    ModelBox.open("drawerModel", {
      value: bType,
      data: drewData.map((v) => ({
        value: v.coinType,
        label: v.coinType,
      })),
      onClick: (value, index) => {
        sessionStorage.actType = value;
        sessionStorage.coin = value;
        socket.send(value);
        this.setState({
          bType: value,
          handNum: drewData[index].contractHandNum,
        });
      },
    });
  };
  clickBtn = (type) => {
    let { actBtn } = this.state;
    if (type === actBtn) return;
    this.setState({
      actBtn: type,
    });
  };
  changeGroup = (type) => {
    let { actGroup } = this.state;
    if (type === actGroup) return;
    this.setState({
      actGroup: type,
    });
  };
  changeGBtn = (value, type) => {
    if (this.state[type] === value) return;
    this.setState({
      [type]: value,
    });
  };

  //   显示输入价格后 每一手价格
  showNumPrice = () => {
    let { actGroup, timesValue, pTimes, numValue } = this.state,
      money = 0,
      { rate } = this.props;
    if (actGroup === "market") {
      money = (rate * numValue) / timesValue;
    } else {
      money = (pTimes * numValue) / timesValue;
    }
    return money.toFixed(2);
  };
  //  选中框改变
  pikerChange = (value) => {
    this.setState({ pickerValue: value });
  };
  //   渲染倍数
  showNumCom = (data, type) => {
    let { actBtn } = this.state;
    let com = data.map((v, i) => {
      return (
        <div
          onClick={() => this.changeGBtn(v.value, type)}
          className={`num_group_btn ${
            this.state[type] === v.value ? `num_group_btn_act_${actBtn}` : ""
          }`}
          key={i + type}
        >
          {v.label}
        </div>
      );
    });
    return <div className="num_group">{com}</div>;
  };
  render() {
    let {
      actBtn,
      actGroup,
      pTimes,
      timesData,
      numValue,
      numData,
      bType,
      handNum,
    } = this.state;
    let { Ubi, downData, rate, upData } = this.props;
    return (
      <div className="cont1">
        <div className="cont_head_top">
          <div className="cont_select" onClick={this.showDrawer}>
            <img src={require("@/assets/imgs/icon_menu.png")} alt="" />
            <div className="name">&emsp;{bType}/USDT</div>
          </div>
        </div>
        {/* 买入卖出 */}
        <div className="bb_buy_box">
          <div className="L_box">
            <div className="btn_group">
              <button
                type="button"
                onClick={this.clickBtn.bind(this, 1)}
                className={`b_btn ${actBtn === 1 ? "act_buy_btn" : ""}`}
              >
                买入
              </button>
              <button
                type="button"
                onClick={this.clickBtn.bind(this, 0)}
                className={`b_btn ${actBtn === 0 ? "act_pay_btn" : ""}`}
              >
                卖出
              </button>
            </div>
            {/* 左侧下拉框 */}
            <div className="L_buy_group">
              <div
                onClick={this.changeGroup.bind(this, "market")}
                className={`G_text ${actGroup === "market" ? "G_active" : ""}`}
              >
                市价
              </div>
              <div
                onClick={this.changeGroup.bind(this, "price")}
                className={`G_text ${actGroup === "price" ? "G_active" : ""}`}
              >
                限价
              </div>
            </div>

            {/* 倍速输入 */}
            <div className="show_input">
              <input
                type="number"
                placeholder="请输入交易价格"
                disabled={actGroup === "market"}
                className="numInput"
                onChange={(e) => this.setState({ pTimes: e.target.value })}
                value={actGroup === "market" ? rate : pTimes}
              />
            </div>
            <div className="times_num_t_box">
              <p>选择倍数</p>
              {this.showNumCom(timesData, "timesValue")}
              <div className="tip">1手等于 {handNum + bType}</div>
            </div>
            <div className="times_num_t_box">
              <p>交易手数</p>
              {/* 交易手数 */}
              <div className="show_input times_input">
                <input
                  type="number"
                  placeholder="请输入交易手数"
                  onChange={(e) => this.setState({ numValue: e.target.value })}
                  value={numValue}
                />
              </div>
              {this.showNumCom(numData, "numValue")}
              <div className="tip">可用余额 {Ubi.contractNum || 0} USDT</div>
            </div>
            {/* 买入 卖出按钮 */}
            <button
              className={`b_btn_t ${actBtn === 1 ? "buy_b" : "pay_b"}`}
              type="button"
              onClick={this.buyContFn}
            >
              {actBtn === 1 ? "买入（做多）" : "卖出（做空）"}
            </button>
          </div>
          <div className="R_box">
            <LineItem upData={upData} rate={rate} downData={downData} />
          </div>
        </div>
        <WhiteSpace size="lg" />
        {/* tabsMenu */}
        <div className="my_tab_box">
          <div className="tab_box">
            <div className="title">
              当前委托<span></span>
            </div>
            <div className="r_btn">全部</div>
          </div>
          <LineData
            onReflash={(e) => (this.onReflash = e)}
            type="0"
            status="2"
          />
        </div>
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData,
    Ubi: state.Ubi,
  };
}
export default connect(filter)(Cont1);
