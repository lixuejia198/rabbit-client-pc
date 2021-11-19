import lazy from "@/components/directive/lazy";
// require.context 批量导入模块 第一个参数为目录 第二个参数为是否查找子目录 第三个参数为通过正则匹配文件
// 方法的返回值是一个导入函数 通过这个导入函数导入组件
const importFn = require.context("./", false, /\.vue$/);
// 导入函数下有一个方法叫做keys 通过该方法可以获取匹配到的所有文件路径 数组类型
const keys = importFn.keys();
const library = {
  install(app) {
    // 全局注册图片懒加载指令
    app.directive("lazy", lazy);
    // 遍历文件路径
    keys.forEach((item) => {
      // 导入组件
      const component = importFn(item).default;
      // 注册组件
      app.component(component.name, component);
    });
  },
};

export default library;
