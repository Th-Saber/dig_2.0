import React, { Component } from "react";
import "./index.less";
import { Nav } from "@coms";
export default class NewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "帮助中心",
    };
  }
  componentDidMount() {
    let { state } = this.props.location;
    if (!state) {
      this.props.history.goBack();
    } else {
      this.setState({
        content: state.content,
        title:
          state.title.length > 6
            ? state.title.slice(0, 6) + "..."
            : state.title,
      });
    }
  }
  render() {
    let { content, title } = this.state;
    return (
      <div className="page_box">
        <Nav title={title} back />
        <div
          className="page_menu newsPage"
          dangerouslySetInnerHTML={{
            __html: content || "请关注新闻发布动态。。。。",
          }}
        ></div>
      </div>
    );
  }
}
