<template>
  <div
    class="ref-goods"
    v-for="item in topCategoryById?.children"
    :key="item.id"
  >
    <div class="head">
      <h3>- {{ item.name }} -</h3>
      <p class="tag">{{ item.saleProperties }}</p>
      <XtxMore />
    </div>
    <div class="body">
      <GoodsItem :goods="good" v-for="good in item.goods" :key="good.id" />
    </div>
  </div>
</template>

<script>
import GoodsItem from "@/views/Category/components/GoodsItem";
import { useRoute } from "vue-router";
import { getTopCategoryById } from "@/api/category";
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
export default {
  name: "RecommendGoods",
  components: { GoodsItem },
  setup() {
    // 获取路由信息对象
    const route = useRoute();
    const { topCategoryById, getData } = useTopCategoryById();
    // 向服务端发送请求获取一级分类数据
    getData(route.params.id);
    return { topCategoryById };
  },
};

// 根据一级分类ID获取一级分类信息
function useTopCategoryById() {
  // 用于存储一级分类具体信息
  const topCategoryById = ref(null);
  // 获取一级分类的方法
  const getData = (id) => {
    getTopCategoryById(id).then((data) => {
      // 存储一级分类
      topCategoryById.value = data.result;
    });
  };
  // 在路由切换之前 获取到目标路由参数id 根据id获取最新的一级分类信息
  onBeforeRouteUpdate((to) => {
    getData(to.params.id);
  });
  return { topCategoryById, getData };
}
</script>

<style lang="less" scoped>
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
</style>
