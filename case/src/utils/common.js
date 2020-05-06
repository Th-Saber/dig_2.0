/**
 * @package 公用js文件
 *
 */
// 前端下载方法
export function downJs(res) {
  var blob = new Blob([res.data], {
    type: "application/msexcel;charset=UTF-8"
  });
  var contentDisposition = res.headers["content-disposition"]; //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
  var result = patt.exec(contentDisposition);
  var filename = result[1];
  var downloadElement = document.createElement("a");
  var href = window.URL.createObjectURL(blob); //创建下载的链接
  var reg = /^["](.*)["]$/g;
  downloadElement.style.display = "none";
  downloadElement.href = href;
  downloadElement.download = decodeURI(filename.replace(reg, "$1")); //下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
  window.URL.revokeObjectURL(href); //释放掉blob对象
}
