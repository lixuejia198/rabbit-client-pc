const path = require("path");
module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      //指定要注入的less文件
      patterns: [
        path.join(__dirname, "src", "assets", "styles", "variables.less"),
        path.join(__dirname, "src", "assets", "styles", "mixin.less"),
      ],
    },
  },
  // 将小于 10kb 的图片打包为 base64 的格式
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 10240 }));
    // 禁用域名检查
    config.devServer.disableHostCheck(true);
  },
};
