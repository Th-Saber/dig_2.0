export function numFormat(num) {
  if (typeof num === "number") num = num.toString();
  // 添加千位符号，
  var res = num.replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ",";
    });
  });
  return res;
}
// 判断是否为移动端
export function isPhone() {
  // 返回ture 移动端   false web端
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}
export function limitInputCharLen(str) {
  var w = 0;
  //length 获取字数数，不区分汉子和英文
  for (let i = 0; i < str.length; i++) {
    //charCodeAt()获取字符串中某一个字符的编码
    var c = str[i].charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      w++;
    } else {
      w += 2;
    }
  }
  return w;
}
