/**
 * @package 代理配置
 */

const proxy = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    proxy("/dev", {
      secure: false,
      target: "https://btch.com.cn/api-web/",
      changeOrigin: true,
      pathRewrite: {
        "^/dev": "",
      },
    })
  );
  app.use(
    proxy("/test", {
      secure: false,
      target: "http://192.168.0.39:9001/api-web/",
      changeOrigin: true,
      pathRewrite: {
        "^/test": "",
      },
    })
  );
};
