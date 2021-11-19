<script>
import { h } from "vue";
export default {
  name: "XtxBread",
  render() {
    // 获取组件默认插槽内容 获取 XtxBreadItem 组件
    const items = this.$slots.default();
    // 存储子组件内容 因为icon(>)需要需要动态生成
    const childern = [];
    // 遍历插槽内容
    items.forEach((item, index) => {
      // 将当前遍历插槽存储起来
      childern.push(item);
      // 如果当前不是最后一项 动态生成icon
      if (index < items.length - 1) {
        childern.push(h("i", { class: "iconfont icon-angle-right" }));
      }
    });
    // 创建面包屑最外层元素
    return h("div", { class: "xtx-bread" }, childern);
  },
};
</script>

<style scoped lang="less">
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
