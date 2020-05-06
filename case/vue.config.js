const path = require("path");
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: "./", //build打包改变静态资源路径
  // 代理配置
  devServer: {
    host: "127.0.0.1",
    port: 8080,
    // https: false, // 是否使用https
    // open: true,// 是否自动打开浏览器
    proxy: {
      // 正式接口代理地址
      "/dev": {
        target: "http://47.110.145.22/sms",
        ws: true,
        changeOrigin: true,
        // 用/api代替target里面的请求
        pathRewrite: {
          "^/dev": "",
        },
      },
      "/test": {
        target: "http://192.168.0.111:8080",
        ws: true,
        changeOrigin: true,
        // 用/api代替target里面的请求
        pathRewrite: {
          "^/test": "",
        },
      },
    },
  },

  // webpack配置 哈哈哈
  configureWebpack: {
    externals: {
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      "element-ui": "ElementUI",
      axios: "axios",
    },
    resolve: {
      extensions: [".js", ".json", ".vue"],
      alias: {
        // 重新设置 alias,扩展项目路径别名
        "@": path.resolve(__dirname, "./src"),
        "@api": path.resolve(__dirname, "./src/apis/api.js"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@coms": path.resolve(__dirname, "./src/components"),
        "@imgs": path.resolve(__dirname, "./src/assets/imgs"),
        "@plug": path.resolve(__dirname, "./src/plugins"),
        "@layout": path.resolve(__dirname, "./src/layout"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
  },
  //   chainWebpack: (config) => {
  //     // 一个规则里的 基础Loader
  //     // svg是个基础loader
  //     const svgRule = config.module.rule("svg");

  //     // 清除已有的所有 loader。
  //     // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
  //     svgRule.uses.clear();

  //     // 添加要替换的 loader
  //     svgRule
  //       .use("svg-sprite-loader")
  //       .loader("svg-sprite-loader")
  //       .options({
  //         symbolId: "icon-[name]",
  //       });
  //   },
};
