import React, { Component } from "react";
import "./index.less";
import { Nav, NextPage } from "@coms";
import moment from "moment";
import { findLog } from "@apis/my";
import { Toast } from "antd-mobile";
export default class Log extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: {
        page: 1,
        size: 10,
      },
      dataList: [],
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  searchFn = async () => {
    let { page, size } = this.state.pages;
    try {
      let res = await findLog({ page, size });
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
  _renderList = () => {
    let { dataList } = this.state;
    let com = dataList.map((v, i) => {
      return (
        <div key={i + "log"} className="log_grid log_item">
          <div>{v.billType}</div>
          <div>{v.inOut ? "增加金额" : "扣除金额"}</div>
          <div className={v.inOut ? "up" : "down"}>{v.bringPrice}</div>
          <div>{moment(v.bringTime).format("MM/DD HH:mm:ss")}</div>
        </div>
      );
    });
    return (
      <div className="log_box">
        <div className="log_grid log_title">
          <div>详细</div>
          <div>类型</div>
          <div>金额</div>
          <div>时间</div>
        </div>
        {com}
      </div>
    );
  };
  render() {
    let { pages, dataList } = this.state;
    return (
      <div className="page_box">
        <Nav title="账单日志" back />
        <div className="page_menu logPage">
          {this._renderList()}

          <NextPage
            page={pages.page}
            size={pages.size}
            total={pages.total}
            onNext={this.clickNext}
            hidden={!dataList.length}
          />

          {!dataList.length && <div className="empty_data">暂无交易记录</div>}
        </div>
      </div>
    );
  }
}
