import React, { Component } from "react";

import { NextPage } from "@coms";

import { dualList } from "@apis/trading";
import moment from "moment";
export default class Two_2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pages: {
        pag: 1,
        size: 10,
        total: 0,
      },
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  //   搜索列表
  searchFn = async () => {
    let { page, size } = this.state.pages;
    try {
      let res = await dualList({ page, size });
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
          page: page,
        }),
      },
      this.searchFn
    );
  };
  //   刷新账户
  reflashFn = async () => {
    let { pages } = this.state;
    this.setState(
      {
        pages: Object.assign({}, pages, {
          page: 1,
        }),
      },
      this.searchFn
    );
  };
  //  渲染列表数据
  _renderList = () => {
    let { dataList, pages } = this.state;
    let com = dataList.map((v, i) => {
      return (
        <div key={i + "me_two"} className="two_list_box">
          <p>{v.named}</p>
          <div className="two_list_item grid_box">
            <div className="two_CC_box">
              <div className="title">金额</div>
              <div className="value_box invest">{v.fundPrice}</div>
            </div>
            <div className="two_CC_box">
              <div className="title">方向</div>
              <div className={`value_box ${v.dealType == 1 ? "up" : "down"}`}>
                {v.dealType == 1 ? "买涨" : "买跌"}
              </div>
            </div>
            <div className="two_CC_box">
              <div className="title">时间</div>
              <div className="value_box">
                {moment(v.joinTime).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div className="two_CC_box">
              <div className="title">利润</div>
              <div className="value_box">{v.obtainProfit}</div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="two_list">
        {com}
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
  //   渲染头部组件
  _renderHead = (data) => {
    let com = data.map((v, i) => {
      return (
        <span key={i + "head_two"} className="two_header">
          {v}
        </span>
      );
    });
    return <div className="grid_box head_m_box">{com}</div>;
  };

  render() {
    return (
      <div className="tab_2">
        <div className="reflas">
          <div className="jsjda_box" onClick={this.reflashFn}>
            <img src={require("@assets/imgs/icon_reflash.png")} alt="刷新" />
            刷新
          </div>
        </div>
        {this._renderList()}
      </div>
    );
  }
}
