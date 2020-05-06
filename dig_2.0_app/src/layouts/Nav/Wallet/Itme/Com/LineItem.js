import React, { Component } from "react";
import "./index.less";
export default class LineItem extends Component {
  _tablesCom = (data, type) => {
    return data.map((v, i) => {
      return (
        <div className="l_grid com_tab" key={i + "tav"}>
          <div className={`${type === "up" ? "div_up" : "div_down"}`}>
            {v[0]}
          </div>
          <div>{v[1]}</div>
        </div>
      );
    });
  };
  render() {
    let { upData, downData, rate } = this.props;
    return (
      <div className="lineItem">
        <div className="down_box">
          <div className="l_grid title">
            <div>价格</div>
            <div>数量</div>
          </div>
          {this._tablesCom(upData, "up")}
        </div>
        <div className="down_box">
          <div className="down_title">
            ≈&nbsp;{rate}
            <span>&nbsp;USDT</span>
          </div>
          {this._tablesCom(downData, "down")}
        </div>
      </div>
    );
  }
}
