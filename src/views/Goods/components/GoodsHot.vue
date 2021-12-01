<template>
  <div class="goods-hot">
    <h3>{{ titles[type] }}</h3>
    <GoodsItem
      v-for="item in hotGoods"
      :key="item.id"
      :goods="item"
    ></GoodsItem>
  </div>
</template>

<script>
import GoodsItem from "@/views/Category/components/GoodsItem";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { getGoodsHotApi } from "@/api/goods";
export default {
  name: "GoodsHot",
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { hotGoods, titles } = useHotGoods(props.type);
    return { hotGoods, titles };
  },
};
// 获取热销榜单数据
function useHotGoods(type) {
  // 用于存储热销榜单数据
  const hotGoods = ref();
  // 获取路由信息对象
  const route = useRoute();
  // 热销榜单名称
  const titles = ref({
    1: "24小时热榜",
    2: "周榜",
    3: "总榜",
  });
  // 用于获取热销榜单数据的方法
  const getData = () => {
    // 向服务器端发送请求 获取热销榜单数据
    getGoodsHotApi({ id: route.params.id, type }).then((data) => {
      // 存储热销榜单数据
      hotGoods.value = data.result;
    });
  };
  getData();
  return { hotGoods, titles };
}
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
