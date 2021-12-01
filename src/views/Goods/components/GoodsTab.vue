<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeComponentName === 'GoodsDetail' }"
        href="javascript:"
        @click="activeComponentName = 'GoodsDetail'"
      >
        商品详情
      </a>
      <a
        :class="{ active: activeComponentName === 'GoodsComment' }"
        href="javascript:"
        @click="activeComponentName = 'GoodsComment'"
      >
        商品评价
        <span>({{ goodsDetail.commentCount }})</span>
      </a>
    </nav>
    <!-- 切换内容的地方 -->
    <!-- <GoodsDetail v-if="activeComponentName === 'GoodsDetail'" /> -->
    <!-- <GoodsComment v-if="activeComponentName === 'GoodsComment'" /> -->
    <!-- 根据组件名称动态渲染组件 -->
    <component :is="activeComponentName" />
  </div>
</template>

<script>
import { inject, ref } from "vue";
import GoodsDetail from "@/views/Goods/components/GoodsDetail";
import GoodsComment from "@/views/Goods/components/GoodsComment";

export default {
  name: "GoodsTab",
  components: { GoodsComment, GoodsDetail },
  setup() {
    const activeComponentName = ref("GoodsDetail");
    const goodsDetail = inject("goodsDetail");
    return { activeComponentName, goodsDetail };
  },
};
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
