import React, { Component } from "react";
import "./index.less";
import { ModelBox } from "@coms";
import { KEchat } from "@layouts/Nav/Wallet/Itme/Com";
import { Icon, WhiteSpace, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { buyCont, getCoinType } from "@apis/trading";
import sockte from "@serve";
class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeName: sessionStorage.coin || "BTC",
      kData: [],
      searchList: [
        {
          title: "1分钟",
          type: "minutes",
          value: "1min",
        },
        {
          title: "5分钟",
          type: "minutes",
          value: "5min",
        },
        {
          title: "30分钟",
          type: "minutes",
          value: "30min",
        },
        {
          title: "1小时",
          type: "hours",
          value: "60min",
        },
        {
          title: "1天",
          type: "days",
          value: "1day",
        },
        {
          title: "1周",
          type: "weeks",
          value: "1week",
        },
        {
          title: "1月",
          type: "month",
          value: "1mon",
        },
      ],
      actTime: "1min",
      isLike: true,
      bData: {},
      bType: 0,
      handNum: 0,
      lineType: false, //false:标准板 ; true:专业版
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (!data || Object.keys(data).length === 0) {
      return null;
    }
    let len = data.length;
    return {
      kData: data,
      bData: data[len - 1],
    };
  }
  //   数据
  componentDidMount() {
    this.searchType();
    this.sendTypeTo();
  }
  sendTypeTo = () => {
    let { typeName, actTime } = this.state;
    sockte.send(`KLINE-${typeName}-${actTime}`);
  };
  //   搜索可切换列表数据
  searchType = async () => {
    let { typeName } = this.state;
    try {
      let res = await getCoinType();
      let handObj = res.data.find((v) => v.coinType === typeName);
      this.setState({
        handNum: handObj ? handObj.contractHandNum : 0,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  componentWillUnmount() {
    let name = window.actTab || "home";
    if (name === "home" || name === "market") {
      sockte.send("DETAIL");
    } else if (name === "wallet") {
      if (sessionStorage.wAct === "two") {
        sockte.send("DUAL");
      } else {
        sockte.send(sessionStorage.actType || "BTC");
      }
    }
  }
  //   打开购买页面模态框
  changeMask = (type) => {
    this.setState(
      {
        bType: type,
      },
      this.mask.open
    );
  };
  //  改变喜欢
  changeLike = () => {
    this.setState((state) => ({
      isLike: !state.isLike,
    }));
  };
  //   改变时间
  changeTime = (val) => {
    let { actTime } = this.state;
    if (actTime === val) return;
    this.setState(
      {
        actTime: val,
      },
      this.sendTypeTo
    );
  };
  filterNum = () => {
    let { bData } = this.state,
      str = 0;
    if (!bData.close || !bData.open) {
      str = 0;
    } else {
      str = ((bData.close - bData.open) / bData.open) * 100;
    }
    return str.toFixed(4);
  };
  //   渲染tab
  showTabCom = () => {
    let { searchList, actTime, lineType } = this.state;
    let com = searchList.map((v, i) => {
      return (
        <div
          key={i + "time_jes"}
          onClick={this.changeTime.bind(this, v.value)}
          className={`tab_item ${v.value === actTime ? "b_act_tab" : ""}`}
        >
          {v.title}
        </div>
      );
    });
    return (
      <div className="tab_box">
        {com}
        <div
          className="tab_item T_primary"
          onClick={() => this.setState({ lineType: !lineType })}
        >
          {lineType ? "标准板" : "专业版"}
        </div>
      </div>
    );
  };
  render() {
    let {
      isLike,
      typeName,
      kData,
      bData,
      bType,
      lineType,
      handNum,
    } = this.state;
    let { Ubi } = this.props;
    let num = this.filterNum();
    return (
      <div className="page_box trend">
        <div className="t_head">
          <div className="left" onClick={() => this.props.history.goBack()}>
            <Icon type="left" size="md" />
            &emsp;
            <span>{typeName}/USDT</span>
          </div>
        </div>
        <div className="top_box">
          <div className={`top_left ${num > 0 ? "up" : "down"}`}>
            <div className="num">{bData.close}</div>
            <div className="rang">{num}%</div>
          </div>
          <div className="top_right">
            <div>
              <span className="name">高</span>
              <span className="value">{bData.high}</span>
            </div>
            <div>
              <span className="name">低</span>
              <span className="value">{bData.low}</span>
            </div>
            <div>
              <span className="name">24H量</span>
              <span className="value">
                {bData.count ? parseFloat(bData.amount).toFixed(4) : 0}
              </span>
            </div>
          </div>
        </div>
        <WhiteSpace size="lg" />
        <div className="page_menu">
          {this.showTabCom()}
          <KEchat data={kData} type={lineType} />
        </div>
        {/* bottomActon */}
        <div className="btm_group">
          <div>
            <button type="button" onClick={() => this.changeMask(1)}>
              买入
            </button>
            <button type="button" onClick={() => this.changeMask(0)}>
              卖出
            </button>
          </div>

          <div className="right_top">
            <span>添加自选</span>
            <img
              onClick={this.changeLike}
              src={
                isLike
                  ? require("@/assets/imgs/star-fill.png")
                  : require("@/assets/imgs/star.png")
              }
              alt=""
            />
          </div>
        </div>
        <Mask
          onRef={(e) => (this.mask = e)}
          dealType={bType}
          handNum={handNum}
          buyMoney={bData.close}
          useMoney={Ubi.contractNum}
        />
      </div>
    );
  }
}

function filter(state) {
  return {
    wsData: state.wsData.KLINE,
    Ubi: state.Ubi,
  };
}

export default connect(filter)(Trend);

class Mask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
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
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     return {
  //       visible: nextProps.visible,
  //     };
  //   }
  componentDidMount() {
    let { onRef } = this.props;
    onRef &&
      onRef({
        open: this.open,
        close: this.close,
      });
  }
  //   关闭模态框
  open = () => {
    this.setState({
      visible: true,
    });
  };
  close = () => {
    this.setState({
      visible: false,
    });
  };
  // 提交修改
  buyContFn = () => {
    let { numValue, timesValue } = this.state;
    let { bType, dealType } = this.props;
    // 打开输入密码模态框
    ModelBox.open("passModel", {
      onInputEnd: async (text) => {
        let params = {
          dealType,
          num: numValue,
          multiple: timesValue,
          coinType: bType,
          payPassword: text,
        };
        try {
          await buyCont(params);
          Toast.success("买入成功");
          this.close();
        } catch (error) {
          console.log("买入错误", error);
        }
      },
    });
  };
  changeGBtn = (value, type) => {
    if (this.state[type] === value) return;
    this.setState({
      [type]: value,
    });
  };
  //   渲染倍数
  showNumCom = (type) => {
    let { dealType } = this.props;
    let { timesData, numData } = this.state;
    let data = type === "timesValue" ? timesData : numData;
    let com = data.map((v, i) => {
      return (
        <div
          onClick={() => this.changeGBtn(v.value, type)}
          className={`num_group_btn ${
            this.state[type] === v.value ? `num_group_btn_act_${dealType}` : ""
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
    let { numValue, visible } = this.state;
    let { dealType, buyMoney, useMoney, handNum, bType } = this.props;
    return (
      visible && (
        <div className="trend_mask_box">
          <div className="to_my_mask" onClick={this.close} />
          <div className="L_box">
            <div className="buy_type">{dealType === 1 ? "买入" : "卖出"}</div>
            <div className={`G_text`}>市价</div>
            {/* 倍速输入 */}
            <div className="show_input">
              <input
                type="number"
                placeholder="请输入交易价格"
                disabled
                className="numInput"
                value={buyMoney}
              />
            </div>
            <div className="times_num_t_box">
              <p>选择倍数</p>
              {this.showNumCom("timesValue")}
              <div className="tip">
                1手等于 {handNum}
                {bType}
              </div>
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
              {this.showNumCom("numValue")}
              <div className="tip">可用余额 {useMoney || 0} USDT</div>
            </div>
            {/* 买入 卖出按钮 */}
            <button
              className={`b_btn_t ${dealType === 1 ? "buy_b" : "pay_b"}`}
              type="button"
              onClick={this.buyContFn}
            >
              {dealType === 1 ? "买入（做多）" : "卖出（做空）"}
            </button>
          </div>
        </div>
      )
    );
  }
}
