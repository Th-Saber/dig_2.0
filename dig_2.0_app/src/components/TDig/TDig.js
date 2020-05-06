import React, { Component } from "react";
import "./TDig.less";
import { connect } from "react-redux";

class TDig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (Object.keys(data).length === 0) {
      return null;
    }
    return {
      data,
    };
  }
  _jump = (obj) => {
    let { history } = this.props;
    sessionStorage.coin = obj.coin;
    history.push({ pathname: "trend" });
  };
  //   数据
  forNum = (num) => {
    let cc = num.toString();
    let str = cc.split(".")[0];
    if (str.length < 9) {
      return num.toFixed(4);
    } else {
      return str;
    }
  };

  filterNum = (data) => {
    let str = 0,
      pre = data.close - data.open;
    if (!data.close || !data.open) {
      str = 0;
    } else {
      str = (pre / data.open) * 100;
    }
    return {
      num: str.toFixed(4),
      pre: pre.toFixed(4),
    };
  };
  render() {
    let { data } = this.state;
    return (
      <div className="list_box">
        <div className="t_grid t_head">
          <span>交易对</span>
          <span>最新价</span>
          <span>24H涨跌幅</span>
        </div>
        <div className="t_body">
          {data.map((v, i) => {
            let price = this.filterNum(v.detail);
            return (
              <div
                className="t_grid tr"
                key={i + "tr"}
                onClick={() => this._jump(v)}
              >
                <div className="t_coll t_name">
                  <div className="tit">
                    {v.coin}
                    <span>/USDT</span>
                  </div>
                  <div className="tme">
                    24H&nbsp;<span>{this.forNum(v.detail.amount)}</span>
                  </div>
                </div>
                <div className="t_coll t_money">
                  <div>{v.detail.close}</div>
                  <div className={`${price.pre < 0 ? "down" : "up"}`}>
                    {price.pre > 0 ? `+${price.pre}` : price.pre}
                  </div>
                </div>
                <div className="t_coll t_btn">
                  <div
                    className={`set_btn ${price.num < 0 ? "dow_btn" : null}`}
                  >
                    {price.num > 0 ? "+" : ""}
                    {price.num}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
export default connect(filter)(TDig);
