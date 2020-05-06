import React, { Component } from "react";
import "./index.less";
import { numFormat } from "@utils/com";
import { WhiteSpace } from "antd-mobile";
import { connect } from "react-redux";
import { LineData } from "../Com";
class Cont2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "USDT",
      allMoney: 5000000,
      tabData: [
        {
          id: 1,
          num: 5,
          money: 900.08,
          gains: 8,
        },
        {
          id: 1,
          num: 5,
          money: 900.08,
          gains: 8,
        },
        {
          id: 1,
          num: 5,
          money: 900.08,
          gains: 8,
        },
      ],
    };
  }
  componentDidMount() {
    let { onReflash } = this.props;
    onReflash && onReflash(this.flashFn);
  }
  flashFn = () => {
    this.onReflash && this.onReflash();
  };
  render() {
    let { name, allMoney } = this.state;
    let { Ubi } = this.props;
    return (
      <div className="cont2">
        <div className="cont2_title">
          {name}&emsp;{Ubi.contractNum || 0}
        </div>
        <LineData
          type="2"
          onReflash={(e) => (this.onReflash = e)}
          status="1"
          onPin={(e) => (this.onPin = e)}
        />
        <div className="bottom_tip">
          <div
            className="pin"
            onClick={() => this.onPin && this.onPin(0, true)}
          >
            一键平仓
          </div>
        </div>
      </div>
    );
  }
}
function filter(state) {
  return {
    Ubi: state.Ubi,
  };
}

export default connect(filter)(Cont2);
