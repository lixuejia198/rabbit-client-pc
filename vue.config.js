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
};
