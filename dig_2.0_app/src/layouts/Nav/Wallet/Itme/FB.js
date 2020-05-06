import React, { Component } from "react";
import "./index.less";
import { WhiteSpace, Toast } from "antd-mobile";
import { ModelBox, NextPage } from "@coms";
import { numFormat } from "@utils/com";
import { getFbList, buyFiat, agreeDeal } from "@apis/trading";

import { connect } from "react-redux";
class FB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pages: {
        size: 10,
        page: 1,
        total: 0,
      },
    };
  }
  //   修改数据
  componentDidMount() {
    this.searchFn();
  }

  upReleaseFn = () => {
    this.props.history.push({
      pathname: "ReleaseDeal",
    });
  };
  //  搜索数据
  searchFn = async () => {
    let { page, size } = this.state.pages;
    try {
      let res = await getFbList({ size, page });
      this.setState((state) => ({
        dataList:
          page === 1
            ? res.data.records
            : [...state.dataList, ...res.data.records],
        pages: Object.assign({}, state.pages, {
          total: res.data.total,
        }),
      }));
    } catch (error) {
      console.log("error", error);
    }
  };
  //   点击下一页
  clickNext = (page) => {
    let { pages } = this.state;
    this.setState(
      {
        pages: Object.assign({}, pages, {
          page,
        }),
      },
      this.searchFn
    );
  };
  //   刷新数据
  refeshFn = () => {
    this.setState(
      {
        pages: Object.assign({}, this.state.pages, {
          page: 1,
        }),
      },
      this.searchFn
    );
  };
  //   数据
  payBox = async (obj) => {
    ModelBox.open("inputModel", {
      title: "请输入数量",
      queryBack: (val) => {
        if (val > obj.num) {
          Toast.info("输入的数量超过当前币数量");
        } else {
          setTimeout(() => {
            ModelBox.open("passModel", {
              onInputEnd: async (pass) => {
                try {
                  let res = await buyFiat({
                    num: val,
                    fiatId: obj.fiatId,
                    payPassword: pass,
                  });
                  Toast.success("买入成功", 2, () => {
                    this.props.history.push({
                      pathname: "FbUser",
                      state: {
                        data: {
                          fiatLogId: res.data,
                          num: val,
                          dealStatus: 6,
                          unitPrice: obj.unitPrice,
                          isMe: true,
                          platform: obj.platform,
                          dealType: obj.dealType,
                        },
                      },
                    });
                  });
                } catch (error) {
                  console.log("error", error);
                }
              },
            });
          }, 500);
        }
      },
    });
  };
  //   渲染列表组件
  _renderMenuList = () => {
    let { dataList, pages } = this.state;
    let dom = dataList.map((v, i) => {
      return (
        <div className="dom_item" key={i + "do"}>
          <img
            className="avator"
            src={require("@/assets/imgs/test_avator.jpg")}
            alt=""
          />
          <div className="center">
            <div className="topName">
              {v.named || "..."}&emsp;
              <img
                src={
                  v.platform === 1
                    ? require("@/assets/imgs/svg_alipay.svg")
                    : require("@/assets/imgs/svg_bank.svg")
                }
                alt="支付"
              />
            </div>
            <div className="num">数量&emsp;{numFormat(v.num)}</div>
            <div className="edu">
              限额&emsp;{v.low}~{v.high}
            </div>
          </div>
          <div className="right">
            <p>{v.unitPrice}&nbsp;CNY</p>
            <button
              className={`${v.dealType === 1 ? "b_buy" : "b_mill"}`}
              onClick={() => this.payBox(v)}
              type="button"
            >
              {v.dealType === 1 ? "购买" : "卖出"}
            </button>
          </div>
        </div>
      );
    });
    return (
      <div className="dom_box">
        {dom}
        {/* 点击下一页 */}
        <NextPage
          page={pages.page}
          size={pages.size}
          total={pages.total}
          onNext={this.clickNext}
          hidden={!dataList.length}
        />
        {!dataList.length && <div className="empty_data">暂无交易记录</div>}
      </div>
    );
  };
  render() {
    return (
      <div className="fb">
        <div className="or_top_box">
          <span>USDT</span>
          <div className="or_right">
            <img
              src={require("@/assets/imgs/icon_record.png")}
              onClick={() => {
                this.props.history.push({
                  pathname: "FbPayList",
                  state: {},
                });
              }}
              alt="图标"
            />
            {this.props.userdata.userType === 1 && (
              <button
                className="release_btn"
                onClick={this.upReleaseFn}
                type="button"
              >
                +发布
              </button>
            )}
          </div>
        </div>
        <WhiteSpace size="lg" />
        {/* 表格数据 */}
        {this._renderMenuList()}
      </div>
    );
  }
}
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(FB);
