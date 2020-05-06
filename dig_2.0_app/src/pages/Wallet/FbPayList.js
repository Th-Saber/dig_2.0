import React, { Component } from "react";
import "./index.less";
import { Nav, NextPage } from "@coms";
import { getFbLog } from "@apis/trading";
import { connect } from "react-redux";
import moment from "moment";
class FbPayList extends Component {
  constructor(props) {
    super(props);
    let userdata = JSON.parse(localStorage.userdata);
    this.state = {
      dataList: [],
      isStore: userdata.userType === 1,
      isMe: true,
      pages: {
        size: 10,
        page: 1,
        total: 0,
      },
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  showTitleName = (dealStatus, dealType) => {
    let { isMe } = this.state,
      color = "",
      value = "";
    if (isMe) {
      //用户
      if (dealStatus === 6) {
        value = dealType === 1 ? "待付款" : "商家付款中";
        color = dealType === 1 ? "warning" : "primary";
      } else if (dealStatus === 2) {
        value = dealType === 1 ? "商家收款中" : "待收款";
        color = dealType === 1 ? "primary" : "warning";
      }
    } else {
      //商家
      if (dealStatus === 6) {
        value = dealType === 1 ? "用户付款中" : "待收款";
        color = dealType === 1 ? "primary" : "warning";
      } else if (dealStatus === 2) {
        value = dealType === 1 ? "待付款" : "用户收款中";
        color = dealType === 1 ? "warning" : "primary";
      }
    }
    return {
      value,
      color,
    };
  };
  // 交易状态
  showType = (status, dealType) => {
    //   显示tu
    switch (status) {
      case 0:
        return {
          value: "取消",
          color: "down",
        };
      case 1:
        return { value: "交易完成", color: "up" };
      case 5:
        return { value: "系统撤销", color: "down" };
      case 2:
      case 6:
        let { value, color } = this.showTitleName(status, dealType);
        return {
          value,
          color,
        };
      default:
        return { value: "", color: "down" };
    }
  };

  //   修改数据列表
  changeBtn = (val) => {
    let { isMe } = this.state;
    if (isMe === val) return;
    this.setState(
      (state) => ({
        isMe: val,
        pages: Object.assign({}, state.pages, {
          page: 1,
        }),
      }),
      this.searchFn
    );
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
  //  搜索数据显示
  searchFn = async () => {
    let {
      isMe,
      pages: { page, size },
    } = this.state;
    try {
      let res = await getFbLog({ size, page, isMe });
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
  //   显示list
  _renderList = () => {
    let { dataList, pages, isMe } = this.state;
    let com = dataList.map((v, i) => {
      if (!v) return null;
      let types = this.showType(v.dealStatus, v.dealType);
      return (
        <div className="fb_grid list_box_item" key={i + "it_e"}>
          <div>{v.dealPeopleName}</div>
          <div>{v.num}</div>
          <div className={`fb_status ${types.color}`}>{types.value}</div>
          <div className={v.dealType === 1 ? "up" : "down"}>
            {v.dealType === 1 ? "买入" : "卖出"}
          </div>
          <button
            onClick={() =>
              this.props.history.push({
                pathname: "/fbUser",
                state: {
                  data: { ...v, isMe },
                },
              })
            }
            type="button"
            className="bn_btn"
          >
            查看
          </button>
          <div className="time_s">
            &emsp;交易时间：
            {moment(v.buyTime).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      );
    });
    return (
      <div className="fb_list_box">
        <div className="fb_grid fb_list_head">
          <div>交易人</div>
          <div>数量</div>
          <div>交易状态</div>
          <div>交易类型</div>
          <div>操作</div>
        </div>
        {com}
        {/* 点击下一页 */}
        <NextPage
          page={pages.page}
          size={pages.size}
          total={pages.total}
          onNext={this.clickNext}
          hidden={!dataList.length}
        />
        {!dataList.length && <div className="s_empty_data">暂无数据</div>}
      </div>
    );
  };
  render() {
    let { isMe, isStore } = this.state;
    return (
      <div className="page_box fbPayList">
        <Nav title="法币交易" back />
        <div className="page_menu set_menu">
          {isStore && (
            <div className="top_msg">
              <div className="right_box">
                <div
                  className={`${isMe === true ? "btn_g_act" : null} btn_g`}
                  onClick={() => this.changeBtn(true)}
                >
                  买入记录
                </div>
                <div
                  className={`${isMe === false ? "btn_g_act" : null} btn_g`}
                  onClick={() => this.changeBtn(false)}
                >
                  卖出记录
                </div>
              </div>
            </div>
          )}

          {this._renderList()}
        </div>
      </div>
    );
  }
}
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(FbPayList);
