import React, { Component } from "react";
import { Nav } from "@coms";
import { TDig } from "@coms";
import "./market.less";
export default class Market extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //  改变tab
  changeTab = (name) => {
    let { actTab } = this.state;
    if (actTab === name) return;
    this.setState({
      actTab: name,
    });
  };

  render() {
    return (
      <div className="page_box market">
        <Nav title="行情" />
        <div className="page_menu">
          <TDig history={this.props.history} />
        </div>
      </div>
    );
  }
}
