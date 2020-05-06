import React from "react";
import "./index.less";
import { ModelBox } from "@coms";
import { findNotice } from "@apis/api";
export default function Notice({ value = false, onChange }) {
  let content = "";
  async function clickBox() {
    try {
      if (!content) {
        let res = await findNotice();
        content = res.data.content;
      }
      ModelBox.open("noticeModel", { content });
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <div className="agreement">
      <label className="ridio_box">
        <input
          type="checkbox"
          hidden={true}
          checked={value}
          name="type"
          onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <div className="ridio_menu" />
      </label>
      <div className="tip" onClick={clickBox}>
        请勾选 <span>《币行用户须知》</span>
        协议
      </div>
    </div>
  );
}
