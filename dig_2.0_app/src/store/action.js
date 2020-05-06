//保存用户数据
export function save_user(data) {
  return {
    type: "save_user",
    data,
  };
}
//销毁用户
export function remove_user() {
  return {
    type: "remove_user",
  };
}
// ws的数据类型
//销毁用户
export function save_ws(data) {
  return {
    type: "save_ws",
    data,
  };
}
//销毁用户
export function remove_ws() {
  return {
    type: "remove_ws",
  };
}

//存储USDT
export function save_USDT(data) {
  return {
    type: "save_USDT",
    data,
  };
}
