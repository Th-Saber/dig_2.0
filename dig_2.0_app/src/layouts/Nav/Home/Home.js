import React, { Component } from "react";
import { Icon, Carousel, WhiteSpace } from "antd-mobile";
import "./Home.less";
import { TDig } from "@coms";
import { findCarousel, findNews } from "@apis/api";
import IP from "@apis/ip";
import { connect } from "react-redux";
import moment from "moment";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: [
        { url: require("@assets/imgs/banner.png") },
        { url: require("@assets/imgs/banner.png") },
      ],
      msgData: [{ title: "xxx" }, { title: "xxx" }],
      infoData: [
        {
          title: "。。。",
          money: 0,
          gains: 0,
        },
        {
          title: "。。。",
          money: 0,
          gains: 0,
        },
        {
          title: "。。。",
          money: 0,
          gains: 0,
        },
      ],
      gridData: [
        {
          icon: require("@assets/imgs/grid_help.svg"),
          name: "帮助中心",
        },
      ],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let data = nextProps.wsData;
    if (Object.keys(data).length === 0) {
      return null;
    }
    let arr = prevState.infoData.map((v, i) => {
      let obj = data[i].detail;
      let str = 0,
        pre = obj.close - obj.open;
      if (!obj.close || !obj.open) {
        str = 0;
      } else {
        str = (pre / obj.open) * 100;
      }
      return {
        title: data[i].coin + "/USDT",
        money: obj.close,
        gains: str.toFixed(4),
      };
    });
    return {
      infoData: arr,
    };
  }
  componentDidMount() {
    this.searchCarousel();
    this.searchNews();
  }
  //   点击msg
  clickMsg = (v) => {
    this.props.history.push({
      pathname: "NewsPage",
      state: v,
    });
  };
  //   搜索轮播图
  searchCarousel = async () => {
    try {
      let res = await findCarousel();
      this.setState({
        imgData: res.data.map((v) => ({
          uri: IP + "files-upload/" + v.uri,
        })),
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  //   搜索
  searchNews = async () => {
    try {
      let res = await findNews({ page: 1, size: 5, type: 2 });
      this.setState({
        msgData: res.data.records,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  //  点击功能
  clickGrid = (i) => {
    switch (i) {
      case 0:
        this.props.history.push("/helpCenter");
        break;

      default:
        break;
    }
  };
  //   渲染首页功能宫格
  _renderGrid = () => {
    let { gridData } = this.state;
    let dom = gridData.map((v, i) => {
      return (
        <div
          key={i + "grid"}
          className="grid_item"
          onClick={() => this.clickGrid(i)}
        >
          <img src={v.icon} alt="hel" />
          <span>{v.name}</span>
        </div>
      );
    });
    return <div className="grid_box">{dom}</div>;
  };
  render() {
    let { imgData, msgData, infoData } = this.state;
    return (
      <div className="home">
        <Carousel className="cousoul" autoplay infinite>
          {imgData.map((val, i) => (
            <img
              key={i + "banner"}
              src={val.uri}
              alt="图片"
              style={{ width: "100%", verticalAlign: "top" }}
            />
          ))}
        </Carousel>
        <div className="infoBox">
          <div className="notice_box">
            <img
              className="no_img"
              src={require("@assets/imgs/notice.png")}
              alt=""
            />
            <Carousel
              className="msg_carousel"
              vertical
              dots={false}
              dragging={false}
              swiping={false}
              autoplay
              infinite
            >
              {msgData.map((v, i) => (
                <div
                  key={i + "msg"}
                  className="msg_text"
                  onClick={() => this.clickMsg(v)}
                >
                  <span className="title">{v.title}&emsp;</span>
                  <span className="msg_time">
                    {moment(v.createTime).format("MM-DD HH:mm:ss")}
                  </span>
                </div>
              ))}
            </Carousel>
            <Icon className="not_icon" type="right" />
          </div>
          {/* 数据info */}
          <div className="info_box">
            {infoData.map((v, i) => {
              return (
                <div key={i + "bc"} className="item_info">
                  <div className="title">{v.title}</div>
                  <div className={`money`}>{v.money}</div>
                  <div className={`gains ${v.gains < 0 ? "act_fains" : ""}`}>
                    {v.gains > 0 ? "+" : ""}
                    {v.gains}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <WhiteSpace size="lg" />
        {this._renderGrid()}
        <WhiteSpace size="lg" />
        <TDig history={this.props.history} />
      </div>
    );
  }
}

// 数据刷单
function filter(state) {
  return {
    wsData: state.wsData.DETAIL,
  };
}
export default connect(filter)(Home);
