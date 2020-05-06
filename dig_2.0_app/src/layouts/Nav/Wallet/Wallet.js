import React from "react";
import { Nav } from "@coms";
import { Tabs } from "antd-mobile";
import "./wallet.less";
import { FB, Cont, Two } from "./Itme";
import { connect } from "react-redux";
import sockte from "@serve";
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { title: "法币交易", component: FB, key: "fb" },
        {
          title: "合约交易",
          component: Cont,
          key: "cont",
        },
        { title: "期权交易", component: Two, key: "two" },
      ],
    };
  }

  render() {
    let { tabs } = this.state;
    return (
      <div className="wallet">
        <Nav title="交易" />
        <div className="wa_box">
          <Tabs
            tabs={tabs}
            initialPage={sessionStorage.wAct || "fb"}
            tabBarBackgroundColor="#152030"
            tabBarInactiveTextColor="#cfd7dc"
            swipeable={false}
            onChange={(tab) => {
              switch (tab.key) {
                case "cont":
                  sockte.send(sessionStorage.actType || "BTC");
                  break;
                case "two":
                  sockte.send("DUAL");
                  break;

                default:
                  break;
              }
              sessionStorage.wAct = tab.key;
            }}
          >
            {(tab) => <tab.component history={this.props.history} />}
          </Tabs>
        </div>
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData,
  };
}
export default connect()(Wallet);
