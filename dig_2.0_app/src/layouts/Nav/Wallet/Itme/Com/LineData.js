import React, { Component } from "react";
import "./index.less";
import moment from "moment";
import { NextPage, ModelBox } from "@coms";

import { getEntrustList, outDan, setYK, onePinC } from "@apis/trading";
import { Toast } from "antd-mobile";
import sockte from "@serve";
import { connect } from "react-redux";
class LineData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabMenuData: [], //委托数据详情
      pages: {
        page: 1,
        size: 10,
        total: 0,
      },
      moneyData: [],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (Object.keys(data).length === 0) {
      return null;
    }
    return {
      moneyData: data.map((v) => ({
        name: v.coin,
        newMoney: v.detail.close,
      })),
    };
  }
  componentDidMount() {
    let { onReflash, onPin, type } = this.props;
    onReflash && onReflash(this.reFlashFn);
    onPin && onPin(this.setPin);
    this.searchListFn();
    if (type != 0 && type != 2) {
      sockte.send("DETAIL");
    }
  }
  componentWillUnmount() {
    let { type } = this.props;
    if (type != 0 && type != 2) {
      let name = window.actTab || "home";
      if (name === "wallet") {
        sockte.send(sessionStorage.actType || "BTC");
      }
    }
  }

  //   搜索当前列表fn
  searchListFn = async () => {
    let { page, size } = this.state.pages;
    let { status } = this.props;
    try {
      let res = await getEntrustList({ page, size, status });
      this.setState((state) => ({
        tabMenuData:
          page === 1
            ? res.data.records
            : [...state.tabMenuData, ...res.data.records],
        pages: Object.assign({}, state.pages, {
          total: res.data.total,
        }),
      }));
    } catch (error) {
      console.log("错误", error);
    }
  };
  //   数据
  reFlashFn = () => {
    this.setState(
      {
        pages: Object.assign({}, this.state.pages, {
          page: 1,
        }),
      },
      this.searchListFn
    );
  };
  //   根据货币类型显示当前价格
  showNewMoney = ({ coinType, stopHigh, stopLow, unitPrice }) => {
    let { moneyData } = this.state;
    let obj = moneyData.find((v) => v.name === coinType);
    if (obj) {
      return obj.newMoney;
    } else {
      return 0;
    }
  };
  //   计算盈亏幅
  showRage = (nowData, oldData) => {
    if (!nowData && !oldData) {
      return 0;
    }
    return (nowData - oldData).toFixed(2);
  };
  //  撤单
  delCont = (id) => {
    ModelBox.open("hintModel", {
      title: "提示",
      msg: "确定撤销该订单吗？",
      onClick: async () => {
        try {
          await outDan({
            contractId: id,
          });
          Toast.success("撤销成功");
          this.reFlashFn();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  // 点击下一页
  clickNext = (page) => {
    let { pages } = this.state;
    this.setState(
      {
        pages: Object.assign({}, pages, {
          page,
        }),
      },
      this.searchListFn
    );
  };
  //   设置盈亏
  setYKFnshow = (obj) => {
    ModelBox.open("ykModel", {
      high: obj.stopHigh,
      low: obj.stopLow,
      onClick: async ({ up, out }) => {
        try {
          let param = {
            contractId: obj.contractId,
            stopHigh: up,
            stopLow: out,
          };
          !param.stopHigh && delete param.stopHigh;
          !param.stopLow && delete param.stopLow;
          await setYK(param);
          Toast.success("设置成功");
          this.reFlashFn();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  //   平仓
  setPin = (id, isAll = false) => {
    if (isAll && !this.state.tabMenuData.length) {
      Toast.show("当前没有可平仓的订单");
      return;
    }
    ModelBox.open("hintModel", {
      title: "提示",
      msg: isAll ? "确定平仓所有订单？" : "确定平仓该订单？",
      onClick: async () => {
        try {
          let param = {
            contractId: id,
            isAll,
          };
          param.isAll && delete param.contractId;
          await onePinC(param);
          Toast.success("平仓成功");
          this.reFlashFn();
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  //   type0 显示的列表
  _renderType_0 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      return (
        <div key={i + "menu_i"} className="my_menu_box">
          <div className="title_box">
            {v.coinType}&emsp;
            <span>{moment(v.dealTime).format("MM-DD HH:mm:ss")}</span>
          </div>
          <div className="fn_box">
            <div className="fn_com fn_1">
              <span>价格</span>
              <span>{v.unitPrice}</span>
            </div>
            <div className="fn_com fn_2">
              <span>数量</span>
              <span>{v.num}</span>
            </div>
            <div className="fn_com fn_3">
              <span>操作</span>
              <span onClick={() => this.delCont(v.contractId)}>撤单</span>
            </div>
          </div>
          <div className="buy_type">
            建仓类型:
            {v.dealType === 1 ? "做多" : "做空"}
          </div>
        </div>
      );
    });
  };
  // type1 委托中
  _renderType_1 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      let nowData = this.showNewMoney(v);
      let isDuo = v.dealType === 1;
      return (
        <div key={i + "menu_i"} className="type2_menu_box">
          <div className="t_grid_box">
            <GridItem label="持币类型" value={`${v.coinType}（x${v.num}）`} />
            <GridItem label="建仓类型" value={isDuo ? "做多" : "做空"} />
            <GridItem label="当前价格" value={nowData} />
            <GridItem label="买入价" value={v.unitPrice} />
            <GridItem
              label="买入时间"
              value={moment(v.dealTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="保证金" value={v.stopHigh} />
            <GridItem label="止盈" value={v.stopHigh} />
            <GridItem label="止损" value={v.stopLow} />
            <GridItem label="保证金" value={v.margin} />
            <GridItem label="手续费" value={v.tfPrice} />
          </div>
          <div className="t_group_btn">
            <button
              type="button"
              onClick={() => this.delCont(v.contractId)}
              className="setPin"
            >
              撤单
            </button>
          </div>
        </div>
      );
    });
  };
  // type2 合约持仓
  _renderType_2 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      let nowData = this.showNewMoney(v);
      let rage = this.showRage(nowData, v.unitPrice);
      let isDuo = v.dealType === 1;
      return (
        <div key={i + "menu_i"} className="type2_menu_box">
          <div className="t_grid_box">
            <GridItem label="持币类型" value={`${v.coinType}（x${v.num}）`} />
            <GridItem label="建仓类型" value={isDuo ? "做多" : "做空"} />
            <GridItem label="当前价格" value={nowData} />
            <GridItem label="买入价" value={v.unitPrice} />
            <GridItem
              label="买入时间"
              value={moment(v.dealTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="止盈" value={v.stopHigh} />
            <GridItem label="止损" value={v.stopLow} />
            <GridItem label="手续费" value={v.tfPrice} />
            <GridItem
              label="盈亏"
              value={(rage * v.num).toFixed(2) * (isDuo ? 1 : -1)}
            />
          </div>
          <div className="t_group_btn">
            <button
              type="button"
              onClick={() => this.setYKFnshow(v)}
              className="setIn"
            >
              设定止盈止损
            </button>
            <button
              type="button"
              onClick={() => this.setPin(v.contractId)}
              className="setPin"
            >
              平仓
            </button>
          </div>
        </div>
      );
    });
  };
  // type3 持仓中
  _renderType_3 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      let nowData = this.showNewMoney(v);
      let rage = this.showRage(nowData, v.unitPrice);
      let isDuo = v.dealType === 1;
      return (
        <div key={i + "menu_i"} className="type2_menu_box">
          <div className="t_grid_box">
            <GridItem label="持币类型" value={`${v.coinType}（x${v.num}）`} />
            <GridItem label="建仓类型" value={isDuo ? "做多" : "做空"} />
            <GridItem label="当前价格" value={nowData} />
            <GridItem label="开仓价" value={v.unitPrice} />
            <GridItem
              label="开仓时间"
              value={moment(v.dealTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="止盈" value={v.stopHigh} />
            <GridItem label="止损" value={v.stopLow} />
            <GridItem label="保证金" value={v.margin} />
            <GridItem label="手续费" value={v.tfPrice} />
            <GridItem
              label="盈亏"
              value={(rage * v.num).toFixed(2) * (isDuo ? 1 : -1)}
            />
          </div>
          <div className="t_group_btn">
            <button
              type="button"
              onClick={() => this.setYKFnshow(v)}
              className="setIn"
            >
              设定止盈止损
            </button>
            <button
              type="button"
              onClick={() => this.setPin(v.contractId)}
              className="setPin"
            >
              平仓
            </button>
          </div>
        </div>
      );
    });
  };
  // type4 已平仓
  _renderType_4 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      let isDuo = v.dealType === 1;
      let my_num = (v.closePrice - v.unitPrice) * v.num * (isDuo ? 1 : -1);
      return (
        <div key={i + "menu_i"} className="type2_menu_box">
          <div className="t_grid_box">
            <GridItem label="持币类型" value={`${v.coinType}（x${v.num}）`} />
            <GridItem
              label="建仓类型"
              value={v.dealType === 1 ? "做多" : "做空"}
            />
            <GridItem label="买入价" value={v.unitPrice} />
            <GridItem
              label="买入时间"
              value={moment(v.dealTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="平仓价" value={v.closePrice} />
            <GridItem
              label="平仓时间"
              value={moment(v.closeTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="止盈" value={v.stopHigh} />
            <GridItem label="止损" value={v.stopLow} />
            <GridItem label="保证金" value={v.margin} />
            <GridItem label="手续费" value={v.tfPrice} />
            <GridItem label="盈利" value={my_num.toFixed(2)} />
          </div>
        </div>
      );
    });
  };
  // type5 已撤单
  _renderType_5 = () => {
    let { tabMenuData } = this.state;
    return tabMenuData.map((v, i) => {
      return (
        <div key={i + "menu_i"} className="type2_menu_box">
          <div className="t_grid_box">
            <GridItem label="持币类型" value={`${v.coinType}（x${v.num}）`} />
            <GridItem
              label="建仓类型"
              value={v.dealType === 1 ? "做多" : "做空"}
            />
            <GridItem label="买入价" value={v.unitPrice} />
            <GridItem
              label="买入时间"
              value={moment(v.dealTime).format("YYYY-MM-DD HH:mm:ss")}
            />
            <GridItem label="止盈" value={v.stopHigh} />
            <GridItem label="止损" value={v.stopLow} />
            <GridItem label="保证金" value={v.margin} />
            <GridItem label="手续费" value={v.tfPrice} />
          </div>
        </div>
      );
    });
  };
  render() {
    let { tabMenuData, pages } = this.state;
    let { type } = this.props;
    return (
      <div className="lineData">
        {/* 合约委托 */}
        {this["_renderType_" + (type !== undefined ? type : 0)]()}
        {/* 点击下一页 */}
        <NextPage
          page={pages.page}
          size={pages.size}
          total={pages.total}
          onNext={this.clickNext}
          hidden={!tabMenuData.length}
        />
        {/* 空数据处理 */}
        {!tabMenuData.length && <div className="empty_data">暂无数据</div>}
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData.DETAIL,
  };
}
export default connect(filter)(LineData);

class GridItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { value, label } = this.props;
    return (
      <div className="t_2_box">
        <span className="t_name">{label}</span>
        <span className="t_value">{value || 0}</span>
      </div>
    );
  }
}
