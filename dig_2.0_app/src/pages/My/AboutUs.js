import React, { Component } from "react";
import "./index.less";
import { Toast } from "antd-mobile";
import { Nav, CountDown } from "@coms";
import { findNews } from "@apis/api";
export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
  }
  componentDidMount() {
    this.searchNews();
  }
  //   搜索新闻
  searchNews = async () => {
    try {
      let res = await findNews({ type: 3 });
      let data = res.data.records[0];
      this.setState({
        content: data ? data.content : "",
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  render() {
    let { content } = this.state;
    return (
      <div className="page_box aboutUs">
        <Nav title="关于我们" back />
        <div
          className="page_menu"
          dangerouslySetInnerHTML={{
            __html: content || "关于我们。。。。",
          }}
        ></div>
      </div>
    );
  }
}
