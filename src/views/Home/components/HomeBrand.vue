<template>
  <HomePanel title="热门品牌" subTitle="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a
        class="iconfont icon-angle-left prev"
        @click="toggle(-1)"
        :class="{ disabled: currentIndex === 0 }"
      >
      </a>
      <a
        class="iconfont icon-angle-right next"
        @click="toggle(1)"
        :class="{ disabled: currentIndex === 1 }"
      >
      </a>
    </template>
    <template v-slot:default>
      <div class="box">
        <ul
          class="list"
          :style="{ transform: `translateX(${-currentIndex * 1240}px)` }"
          v-if="hotBrands"
        >
          <li v-for="item in hotBrands" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" :alt="item.name" />
            </RouterLink>
          </li>
        </ul>
        <transition name="fade">
          <div class="skeleton" v-if="hotBrands == null">
            <XtxSkeleton
              v-for="i in 5"
              :key="i"
              class="item"
              animated="scroll"
              bg="#e4e4e4"
              width="240px"
              height="305px"
            />
          </div>
        </transition>
      </div>
    </template>
  </HomePanel>
</template>

<script>
import HomePanel from "@/views/Home/components/HomePanel";
import { getBrandApi } from "@/api/home";
import useLazyData from "@/hooks/useLazyData";
import { ref } from "vue";
export default {
  name: "HomeBrand",
  components: { HomePanel },
  setup() {
    const { target, result } = useLazyData(getBrandApi);
    const { currentIndex, toggle } = useToggle();
    return {
      hotBrands: result,
      target,
      currentIndex,
      toggle,
    };
  },
};
// 把图片切换逻辑抽离出来
function useToggle() {
  // 当前切换索引
  const currentIndex = ref(0);
  // 控制切换索引
  const toggle = (step) => {
    // 计算索引
    const nextIndex = currentIndex.value + step;
    // 控制切换索引 不能小于0也不能大于0
    if (nextIndex < 0 || nextIndex > 1) return;
    // alert(nextIndex);
    // 索引范围正常 就更改当前索引
    currentIndex.value = nextIndex;
  };
  return { currentIndex, toggle };
}
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
