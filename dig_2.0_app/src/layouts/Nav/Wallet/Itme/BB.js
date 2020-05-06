import React from "react";
import { WhiteSpace, Icon, Picker } from "antd-mobile";
import "./index.less";
import { LineItem, LineData } from "./Com";

export default class BB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actBtn: "buy", //buy 买入；pay 卖出
      num: "",
      pNum: "",
      pass: "",
      upData: [
        {
          money: 2110.44546545,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
      ],
      downData: [
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
        {
          money: 2110.44,
          num: 0.0391,
        },
      ],
      tabList: [
        {
          title: "当前委托",
          sub: "卖出",
        },
        {
          title: "当前委托",
          sub: "买入",
        },
        {
          title: "历史委托",
          sub: "已完成",
        },
      ],
      tabMenuData: [
        {
          name: "ETC",
          time: new Date(),
          money: 0.33335,
          num: 10.85,
        },
        {
          name: "ETC",
          time: new Date(),
          money: 0.33335,
          num: 10.85,
        },
        {
          name: "ETC",
          time: new Date(),
          money: 0.33335,
          num: 10.85,
        },
        {
          name: "ETC",
          time: new Date(),
          money: 0.33335,
          num: 10.85,
        },
      ],
      actIndex: 0,
      pikerData: [
        { value: 1, label: "限价交易" },
        { value: 2, label: "全价交易" },
        { value: 3, label: "等价交易" },
      ],
      pickerValue: [1],
      visible: false,
    };
  }
  clickBtn = (type) => {
    let { actBtn } = this.state;
    if (type === actBtn) return;
    this.setState({
      actBtn: type,
    });
  };
  clickTab = (index) => {
    let { actIndex } = this.state;
    if (actIndex === index) return;
    this.setState({
      actIndex: index,
    });
  };
  //  底部买入卖出按钮
  BottomFn = () => {
    // let { actBtn } = this.state;
  };
  //  选中框改变
  pikerChange = (value) => {
    this.setState({ pickerValue: value });
  };
  //   公用
  _tablesCom = (data, type) => {
    return data.map((v, i) => {
      return (
        <div className="com_tab" key={i + "tav"}>
          <div>{i + 1}</div>
          <div className={`${type === "up" ? "div_up" : "div_down"}`}>
            <span>{v.money}</span>
          </div>
          <div>
            <span>{v.num}</span>
          </div>
        </div>
      );
    });
  };
  //   渲染tab
  showTabCom = () => {
    let { tabList, actIndex } = this.state;
    let com = tabList.map((v, i) => {
      return (
        <div
          key={i + "tagv_jes"}
          onClick={this.clickTab.bind(this, i)}
          className={`tab_item ${i === actIndex ? "b_act_tab" : ""}`}
        >
          {v.title}
          <span>（{v.sub}）</span>
        </div>
      );
    });
    return <div className="tab_box">{com}</div>;
  };
  render() {
    let {
      actBtn,
      num,
      pNum,
      pass,
      upData,
      downData,
      tabMenuData,
      pikerData,
      visible,
      pickerValue,
    } = this.state;
    return (
      <div className="bb">
        <div className="bb_head_top">
          <img src={require("@/assets/imgs/icon_menu.png")} alt="" />
          <div className="name">EOS/USDT</div>
          <img src={require("@/assets/imgs/icon_line.png")} alt="" />
        </div>
        <WhiteSpace size="lg" />
        <div className="bb_buy_box">
          <div className="L_box">
            <div className="btn_group">
              <button
                type="button"
                onClick={this.clickBtn.bind(this, "buy")}
                className={`b_btn ${actBtn === "buy" ? "act_buy_btn" : ""}`}
              >
                买入
              </button>
              <button
                type="button"
                onClick={this.clickBtn.bind(this, "pay")}
                className={`b_btn ${actBtn === "pay" ? "act_pay_btn" : ""}`}
              >
                卖出
              </button>
            </div>
            {/* 左侧下拉框 */}
            <div className="L_select">
              <span onClick={() => this.setState({ visible: true })}>
                {pikerData.filter((v) => v.value === pickerValue[0])[0].label}
                &emsp;
              </span>
              <Icon type="down" color="#fff" size="xs" />
            </div>

            {/* 左侧输入框 */}
            <div className="num_price_box">
              <button type="button">-</button>
              <div className="input_box">
                <input
                  type="number"
                  onChange={(e) => this.setState({ num: e.target.value })}
                  value={num}
                />
              </div>

              <button type="button">+</button>
            </div>
            {/* 数量输入 */}
            <div className="show_input">
              <input
                type="number"
                placeholder="输入数量"
                onChange={(e) => this.setState({ pNum: e.target.value })}
                value={pNum}
              />
            </div>
            {/* 密码输入 */}
            <div className="show_input">
              <input
                type="password"
                placeholder="输入交易密码"
                maxLength={6}
                onChange={(e) => this.setState({ pass: e.target.value })}
                value={pass}
              />
            </div>
            {/* 底部可用 */}
            <div className="L_b_msg">
              <div className="b_msg_item clearfix">
                <span>可用&emsp;</span>
                <span>123444</span>
                <span style={{ float: "right" }}>USDT</span>
              </div>
              <div className="b_msg_item clearfix">
                <span>交易额&emsp;</span>
                <span>123444</span>
                <span style={{ float: "right" }}>USDT</span>
              </div>
            </div>
            {/* 买入 卖出按钮 */}
            <button
              className={`b_btn_t ${actBtn === "buy" ? "buy_b" : "pay_b"}`}
              type="button"
              onClick={this.BottomFn}
            >
              {actBtn === "buy" ? "买入" : "卖出"}
            </button>
          </div>
          <div className="R_box">
            <LineItem upData={upData} downData={downData} />
          </div>
        </div>
        <WhiteSpace size="lg" />
        {/* tabsMenu */}
        <div className="my_tab_box">
          {this.showTabCom()}
          {/* <LineData data={tabMenuData} /> */}
        </div>
        {/* piker选择器 */}
        <Picker
          visible={visible}
          data={pikerData}
          onChange={this.pikerChange}
          value={pickerValue}
          cols={1}
          onOk={() => this.setState({ visible: false })}
          onDismiss={() => this.setState({ visible: false })}
          className="forss"
        />
      </div>
    );
  }
}
