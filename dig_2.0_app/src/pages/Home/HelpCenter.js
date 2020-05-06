import React, { Component } from "react";
import "./index.less";
import { Icon } from "antd-mobile";
import { NextPage } from "@coms";
import { findNews } from "@apis/api";
export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: {
        page: 1,
        size: 10,
        total: 0,
      },
      newsList: [],
    };
  }
  componentDidMount() {
    this.searchNews();
  }
  // 点击下一页
  clickNext = (page) => {
    let { pages } = this.state;
    this.setState(
      {
        pages: Object.assign({}, pages, {
          page,
        }),
      },
      this.searchNews
    );
  };
  //   搜索新闻
  searchNews = async () => {
    let {
      pages: { size, page },
    } = this.state;
    try {
      let res = await findNews({ page, size, type: 1 });
      this.setState((state) => ({
        newsList:
          page === 1
            ? res.data.records
            : [...state.newsList, ...res.data.records],
        pages: Object.assign({}, state.pages, {
          total: res.data.total,
        }),
      }));
    } catch (error) {
      console.log("error", error);
    }
  };
  //  跳转到新闻page
  jumpNewsPage = (v) => {
    this.props.history.push({
      pathname: "NewsPage",
      state: v,
    });
  };
  render() {
    let { newsList, pages } = this.state;
    return (
      <div className="page_box helpCenter">
        <div className="help_head">
          <div className="top_s">
            <div
              className="help_head_icon"
              onClick={() => this.props.history.goBack()}
            >
              <Icon type="left" size="md" />
            </div>
            <span className="title">帮助中心</span>
          </div>
        </div>
        <div className="page_menu center_box">
          {newsList.map((v, i) => {
            return (
              <div
                className="news_title"
                key={i + "news"}
                onClick={() => this.jumpNewsPage(v)}
              >
                {v.title}
              </div>
            );
          })}
          {/* 点击下一页 */}
          <NextPage
            page={pages.page}
            size={pages.size}
            total={pages.total}
            onNext={this.clickNext}
            hidden={!newsList.length}
          />
          {/* 空数据处理 */}
          {!newsList.length && <div className="empty_data">暂无数据</div>}
        </div>
      </div>
    );
  }
}
