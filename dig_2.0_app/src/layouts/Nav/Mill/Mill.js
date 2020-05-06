import React from "react";
import "./mill.less";
import { Nav, ModelBox } from "@coms";
import { getUSDT } from "@serve/polling";
import { Toast } from "antd-mobile";
import { connect } from "react-redux";
import { toMoney } from "@apis/api";
class Mill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { title: "法币账户", name: "FIAT", moneyName: "num" },
        { title: "币币账户", name: "COIN", moneyName: "coinNum" },
        { title: "合约账户", name: "CONTRACT", moneyName: "contractNum" },
        { title: "期权账户", name: "DUAL", moneyName: "dualNum" },
      ],
      pullName: "",
      pullMoney: 0,
    };
  }
  componentDidMount() {}
  //   选中change
  pikerChange = (name) => {
    let { pullName, pullMoney } = this.state;
    if (pullName === name) {
      this.setState({
        pullName: "",
      });
      return;
    }
    ModelBox.open("inputModel", {
      showAll: true,
      allMoney: pullMoney,
      queryBack: async (text) => {
        if (!text || text <= 0) {
          Toast.show("提币数必须大于0");
          this.setState({
            pullName: "",
          });
          return;
        }
        if (text > pullMoney) {
          Toast.show("划币数量超过该币总币数");
          this.setState({
            pullName: "",
          });
          return;
        }
        try {
          await toMoney({
            pull: pullName,
            push: name,
            num: text,
          });
          Toast.success("划币成功");
          this.setState({
            pullName: "",
          });
          getUSDT();
        } catch (error) {
          console.log("error", error);
        }
      },
    });
  };
  //   刷新账户
  reflashFn = async () => {
    getUSDT(() => {
      Toast.success("刷新成功");
    });
  };
  //   点击充值提现按钮
  clickTopUp = (type) => {
    this.props.history.push("/" + type);
  };

  render() {
    let { Ubi } = this.props;
    let { tabs, pullName } = this.state;
    return (
      <div className="mill">
        <Nav title="资产" />
        <div className="mill_menu">
          <div className="reflas">
            <div className="jsjda_box" onClick={this.reflashFn}>
              <img src={require("@assets/imgs/icon_reflash.png")} alt="刷新" />
              刷新
            </div>
          </div>
          {tabs.map((v, i) => {
            return (
              <div key={i + "tanss"} className="card card_head">
                {pullName && (
                  <div
                    onClick={() => this.pikerChange(v.name)}
                    className={`zhuan_mask ${
                      pullName !== v.name ? "zhuan_mask_s" : null
                    }`}
                  ></div>
                )}
                <div className="top_car">
                  <div className="title">{v.title}</div>
                  <span className="money">{Ubi[v.moneyName] || 0}</span>
                </div>
                <div
                  className="zhuan"
                  onClick={() =>
                    this.setState({
                      pullName: v.name,
                      pullMoney: Ubi[v.moneyName],
                    })
                  }
                >
                  {pullName ? (pullName === v.name ? "取消" : "转入") : "转币"}
                </div>
                {i === 1 && (
                  <div className="topup_btn">
                    <div onClick={this.clickTopUp.bind(this, "topUp")}>
                      充值
                    </div>
                    <div onClick={this.clickTopUp.bind(this, "withdrawal")}>
                      提币
                    </div>
                  </div>
                )}
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
    Ubi: state.Ubi,
  };
}
export default connect(filter)(Mill);
