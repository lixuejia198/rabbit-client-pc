<script>
import { useVModel } from "@vueuse/core";

export default {
  name: "XtxTabs",
  props: {
    current: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { slots, emit }) {
    // 获取插槽内容
    const defaults = slots.default();
    console.log(defaults, "defaults");
    // 用于存储选项卡标题
    const titles = [];
    // 用于存储选项卡内容
    const contents = [];
    // 收集选项卡标题和内容
    defaults.forEach((item) => {
      if (typeof item.type === "symbol") {
        item.children.forEach((child) => {
          if (child.type.name === "XtxTabTitle") {
            titles.push(child);
          } else {
            contents.push(child);
          }
        });
      } else {
        if (item.type.name === "XtxTabTitle") {
          titles.push(item);
        } else {
          contents.push(item);
        }
      }
    });
    // 选项卡索引
    const index = useVModel(props, "current", emit);
    // 当选项卡标题被点击时
    const onTabTitleClickHandler = (i) => {
      index.value = i;
    };
    return () => {
      return (
        <div className="xtx-tabs">
          <nav>
            {titles.map((item, i) => (
              <a
                href="javascript:"
                onClick={() => onTabTitleClickHandler(i)}
                className={i === index.value ? "active" : ""}
              >
                {item}
              </a>
            ))}
          </nav>
          {contents.map((item, i) => (
            <div className={i === index.value ? "active" : ""}>{item}</div>
          ))}
        </div>
      );
    };
  },
};
</script>

<style lang="less" scoped>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
  > div {
    display: none;
    &.active {
      display: block;
    }
  }
}
</style>
