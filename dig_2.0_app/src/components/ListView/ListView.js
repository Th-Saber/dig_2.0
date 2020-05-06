import React, { useState, useEffect } from "react";
import { ListView, PullToRefresh } from "antd-mobile";
// 自定义列表
export default function MyList({
  data,
  total = 0,
  size = 10,
  refreshing = false,
  row
}) {
  //   const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);
  useEffect(() => {});
  return (
    <ListView
      dataSource={data}
      renderFooter={() => (
        <div style={{ padding: 30, textAlign: "center" }}>
          {load ? "Loading..." : "Loaded"}
        </div>
      )}
      renderRow={row}
      //   renderSeparator={separator}//每一行边框
      useBodyScroll
      pullToRefresh={
        <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={onEndReached}
      pageSize={size}
    />
  );
}
