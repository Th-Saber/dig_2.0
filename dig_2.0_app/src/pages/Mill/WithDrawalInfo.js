import React, { Component } from "react";
import "./index.less";
import { Nav, ModelBox, NextPage } from "@coms";
import { wallFormList } from "@apis/mill";
import { connect } from "react-redux";
import moment from "moment";
class WithDrawalInfo extends Component {
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
  componentDidMount() {
    this.searchFn();
  }
  //   显示box
  showBox = (v) => {
    ModelBox.open("infoBox", {
      address: v.address,
      msg: v.remark,
    });
  };
  // 交易状态
  showType = (status) => {
    //   显示tu
    switch (status) {
      case 0:
        return {
          value: "已驳回",
          color: "down",
        };
      case 1:
        return { value: "已确认", color: "up" };
      case 2:
        return { value: "待审核", color: "warning" };
      default:
        return { value: "", color: "down" };
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
  //  搜索数据显示
  searchFn = async () => {
    let {
      pages: { page, size },
    } = this.state;
    try {
      let res = await wallFormList({ size, page });
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
    let { dataList, pages } = this.state;
    let com = dataList.map((v, i) => {
      let types = this.showType(v.state);
      return (
        <div className="fb_grid list_box_item" key={i + "it_e"}>
          <div className="type_name"> {v.addressType}</div>
          <div className="type_num">{v.num}</div>
          <div className={`fb_status ${types.color}`}>{types.value}</div>

          <button
            onClick={this.showBox.bind(this, v)}
            type="button"
            className="bn_btn"
          >
            查看
          </button>
          <div className="time_s">
            &emsp;提币时间：
            {moment(v.createTime).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      );
    });
    return (
      <div className="fb_list_box">
        <div className="fb_grid fb_list_head">
          <div>提币类型</div>
          <div>数量</div>
          <div>提币状态</div>
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
    return (
      <div className="page_box">
        <Nav title="提现记录" back />
        <div className="page_menu withDrawall_menu">{this._renderList()}</div>
      </div>
    );
  }
}
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(WithDrawalInfo);
