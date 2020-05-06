import React, { Component } from "react";

import ReactEcharts from "echarts-for-react";
import moment from "moment";
// 引入柱状图
// import "echarts/lib/chart/candlestick";
// 引入提示框和标题组件
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/title";
// import "echarts/lib/component/legend";
// import "echarts/lib/component/markPoint";

// MA指标
function calculateMA(dayCount, data) {
  var result = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}
// EMA指标
function EMALin(day, data) {
  if (data.length === 0) return [];
  let a = 2 / (day + 1);
  let EMA_Y = data[0].close,
    len = data.length,
    arr = [];
  for (let i = 0; i < len; i++) {
    let EMA_D = a * data[i].close + (1 - a) * EMA_Y;
    arr.push(EMA_D);
    EMA_Y = EMA_D;
  }
  return arr;
}
// RSI指标
function RSILin(day, data) {
  if (data.length === 0) return [];
  let len = data.length,
    arr = [];
  for (let i = 0; i < len; i++) {
    let a = 0,
      b = 0;
    if (i < day) {
      arr.push("-");
      continue;
    }
    for (let j = 0; j < day; j++) {
      let last = data[j + i - day].close || 0;
      let now = data[j + i - day + 1].close || 0;
      if (now - last > 0) {
        a += now - last;
      } else if (now - last < 0) {
        b += last - now;
      }
    }
    let RSI = 100 - 100 / (1 + a / b);
    arr.push(RSI.toFixed(4));
  }
  return arr;
}

// MACD指标
function MACDLin(day, data) {}

class KEchat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defalutList: ["日K", "MA5", "MA10", "MA30", "EMA26"], //默认版
      majorList: ["RSI14"], //专业板数据
      option: {
        backgroundColor: "#152030",
        legend: {
          data: [],
          inactiveColor: "#777",
          textStyle: {
            color: "#fff",
          },
        },
        tooltip: {
          confine: true,
          trigger: "axis",
          axisPointer: {
            animation: false,
            type: "cross",
            lineStyle: {
              color: "#376df4",
              width: 2,
              opacity: 1,
            },
          },
        },
        xAxis: {
          type: "category",
          data: [],
          axisLine: { lineStyle: { color: "#8392A5" } },
        },
        yAxis: {
          scale: true,
          axisLine: { lineStyle: { color: "#8392A5" } },
          splitLine: { show: false },
        },
        grid: {
          bottom: 80,
          left: 50,
          right: 10,
        },
        dataZoom: [
          {
            show: false,
            // start: 95,
            // end: 100,
          },
          {
            type: "inside",
          },
        ],
        animation: false,
        series: [],
      },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let { defalutList, majorList } = prevState;
    let times = [],
      data = [],
      dayK = [];
    nextProps.data.forEach((v) => {
      times.push(moment(v.id * 1000).format("MM-DD HH:mm"));
      data.push(v.amount);
      dayK.push([+v.open, +v.close, +v.low, +v.high]);
    });
    let option = JSON.parse(JSON.stringify(prevState.option));
    let sData = nextProps.type ? majorList : defalutList;
    option.xAxis.data = times;
    option.legend.data = sData;

    //专业版
    option.series = sData.map((v) => {
      let testObj = {
        name: v,
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1,
        },
      };
      switch (v) {
        case "日K":
          return {
            type: "candlestick",
            name: "日K",
            data: dayK,
            itemStyle: {
              color: "#FD1050",
              color0: "#0CF49B",
              borderColor: "#FD1050",
              borderColor0: "#0CF49B",
            },
            tooltip: {
              trigger: "item", //此时不要为'axis',否则params.name或者params.value不显示
              formatter: function (params) {
                return (
                  params.name +
                  "<br>" +
                  "开盘:" +
                  params.value[0] +
                  "<br>" +
                  "收盘:" +
                  params.value[1] +
                  "<br>" +
                  "最低:" +
                  params.value[2] +
                  "<br>" +
                  "最高:" +
                  params.value[3]
                );
              },
            },
          };
        case "MA5":
          return {
            ...testObj,
            data: calculateMA(5, dayK),
          };
        case "MA10":
          return {
            ...testObj,
            data: calculateMA(10, dayK),
          };
        case "MA30":
          return {
            ...testObj,
            data: calculateMA(30, dayK),
          };
        case "EMA26":
          return {
            ...testObj,
            data: EMALin(26, nextProps.data),
          };
        case "RSI14":
          return {
            ...testObj,
            data: RSILin(14, nextProps.data),
          };
      }
    });
    return {
      option,
    };
  }
  coom;
  render() {
    let { option } = this.state;

    return (
      <div>
        <ReactEcharts
          option={option}
          style={{
            height: 400,
            width: "100%",
            letterSpacing: "0px",
          }}
        />
      </div>
    );
  }
}

export default KEchat;
