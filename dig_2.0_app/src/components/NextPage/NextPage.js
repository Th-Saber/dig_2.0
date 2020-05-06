import React from "react";
import "./index.less";
export default function NextPage({
  total,
  page,
  size,
  onNext,
  hidden = false,
}) {
  let pages = total % size !== 0 ? Math.ceil(total / size) : total / size;
  return (
    !hidden && (
      <div
        className="next_page"
        onClick={() => pages > page && onNext(page + 1)}
      >
        {pages > page ? "下一页" : "到底了。。。"}
      </div>
    )
  );
}
