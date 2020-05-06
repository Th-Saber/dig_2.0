import React, { Component } from "react";
import "./index.less";
import { WhiteSpace, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { ModelBox } from "@coms";
import { buyDual, getRageTime } from "@apis/trading";
import moment from "moment";

class Two_1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roseData: [], //
      timeOpen: {
        "000001": [
          ["09:30", "11:30"],
          ["13:00", "15:00"],
        ],
        HSI: [
          ["09:15", "12:00"],
          ["13:00", "16:30"],
        ],
        DJIA: [["21:30", "04:00"]],
        SPX: [["21:30", "04:00"]],
        NDX: [["21:30", "04:00"]],
        N225: [
          ["08:00", "10:00"],
          ["11:30", "14:00"],
        ],
      },
      buyType: {
        //购买期权指数
        roseName: "",
        money: "",
        type: 1, //涨 1 跌 0
      },
      pikerData: [],
      itemTime: {},
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (Object.keys(data).length === 0) {
      return null;
    }
    return {
      roseData: data,
    };
  }
  componentDidMount() {
    this.getRageFn();
  }
  getRageFn = async () => {
    try {
      let res = await getRageTime();
      this.setState({
        pikerData: res.data,
        itemTime: res.data[0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   打开选择时间
  openPiker = () => {
    let { pikerData } = this.state;
    ModelBox.open("pikerModel", {
      option: pikerData.map((v) => {
        return {
          label: v.minute + "分钟",
          value: v.minute,
        };
      }),
      title: "请选择到期时间",
      onClick: (value, index) => {
        this.setState({
          itemTime: pikerData[index],
        });
      },
    });
  };
  //   数据
  openRose = (val) => {
    let { timeOpen } = this.state;
    let flag = true; //true 显示
    for (const v of timeOpen[val]) {
      let start = moment().format("YYYY-MM-DD ") + v[0];
      let end = moment().format("YYYY-MM-DD ") + v[1];
      if (moment(end) < moment(start)) {
        flag = !(moment() < moment(start) && moment() > moment(end));
      } else if (moment(end) === moment(start)) {
        flag = true;
      } else {
        flag = moment() > moment(start) && moment() < moment(end);
      }
      //   如果存在在一个时间段里面 就返回
      if (flag) return flag;
    }
    return flag;
  };
  // 提交购买价格
  submitFn = () => {
    let {
      buyType: { roseName, money, type },
      itemTime,
    } = this.state;
    if (!roseName) {
      Toast.info("请点击选择下列指数");
      return;
    }
    if (!money) {
      Toast.info("请输入买入金额");
      return;
    }
    ModelBox.open("passModel", {
      onInputEnd: async (pass) => {
        try {
          await buyDual({
            fundPrice: money,
            dealType: type,
            named: roseName,
            payPassword: pass,
            profitId: itemTime.profitId,
          });
          this.setState((state) => ({
            buyType: Object.assign({}, state.buyType, {
              roseName: "",
              money: "",
            }),
          }));
          Toast.success("买入成功");
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  };
  //   改变input按钮等数据
  changeInputBtn = (value) => {
    let { buyType } = this.state;
    if (buyType.type === value) return;
    this.setState({
      buyType: Object.assign({}, buyType, {
        type: value,
      }),
    });
  };
  //   选择购买的指数
  selectRose = (value) => {
    let { buyType } = this.state;
    if (buyType.roseName === value) return;
    this.setState({
      buyType: Object.assign({}, buyType, {
        roseName: value,
      }),
    });
  };
  //  展示涨跌幅数据
  showRoseCom = () => {
    let { roseData, buyType } = this.state;
    let com = roseData.map((v, i) => {
      let isOpen = this.openRose(v.f12);
      return (
        <div
          key={i + "rose"}
          className={`grid_box ${
            buyType.roseName === v.f14 ? "item_click_act" : ""
          }
          ${isOpen ? "" : "dis_item"}
          `}
          onClick={() => isOpen && this.selectRose(v.f14)}
        >
          <div className="name">{v.f14}</div>
          <div className="nowPrice">{v.f2}</div>
          <div className={`rosePrice ${v.f4 > 0 ? "up" : "down"}`}>{v.f4}</div>
          <div className={`rose ${v.f3 > 0 ? "up" : "down"}`}>{v.f3}%</div>
        </div>
      );
    });

    return (
      <div className="rose_box">
        <div className="grid_box title_rose">
          <div className="name">指数</div>
          <div className="nowPrice">当前价</div>
          <div className="rosePrice">涨跌价</div>
          <div className="rose">涨跌幅</div>
        </div>
        {com}
        {!roseData.length && <div className="rose_empty">暂无指数详情</div>}
      </div>
    );
  };
  render() {
    let { buyType, itemTime } = this.state;
    return (
      <div className="tab_1">
        <div className="rose_tip">注：购买前请先点击并选择下列指数</div>
        {/* 搜索框 */}
        <div className="serch_box">
          <div className="input_box">
            <span>到期时间</span>
            <div className="serch_input" onClick={this.openPiker}>
              {itemTime.minute}分钟
            </div>
          </div>
          <div className="input_box">
            <span>投注资金</span>
            <div className="serch_input">
              <input
                type="number"
                value={buyType.money}
                placeholder="USDT"
                onChange={(e) =>
                  this.setState({
                    buyType: Object.assign({}, buyType, {
                      money: e.target.value,
                    }),
                  })
                }
              />
            </div>
          </div>
          <div className="input_box">
            <span>投资利润</span>
            <div className="serch_input down_int">{itemTime.profit}%</div>
          </div>
          {/*  */}
          <div className="input_box">
            <div className="bth_group">
              <button
                type="button"
                className={buyType.type === 1 ? "input_act_btn_1" : ""}
                onClick={() => this.changeInputBtn(1)}
              >
                看涨
              </button>
              <button
                type="button"
                className={buyType.type === 0 ? "input_act_btn_2" : ""}
                onClick={() => this.changeInputBtn(0)}
              >
                看跌
              </button>
            </div>
            <button className="b_query" type="button" onClick={this.submitFn}>
              确定
            </button>
          </div>
        </div>
        <WhiteSpace size="lg" />
        {this.showRoseCom()}
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData.DUAL,
  };
}
export default connect(filter)(Two_1);
