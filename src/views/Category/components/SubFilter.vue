<template>
  <div class="sub-filter" v-if="filters">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="filters.selectedBrandId = brand.id"
          v-for="brand in filters.brands"
          :key="brand.id"
        >
          {{ brand.name }}
        </a>
      </div>
    </div>
    <div class="item" v-for="item in filters.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}：</div>
      <div class="body">
        <a
          @click="item.selectedFilterName = property.name"
          v-for="property in item.properties"
          :key="property.id"
        >
          {{ property.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { getSubCategoryFilterById } from "@/api/category";

export default {
  name: "SubFilter",
  setup() {
    const filters = useSubCategoryFilter();
    return { filters };
  },
};
// 获取筛选条件
function useSubCategoryFilter() {
  // 获取路由信息对象
  const route = useRoute();
  // 用于存储所有筛选条件数据
  const filters = ref(null);
  // 获取筛选条件方法
  getSubCategoryFilterById(route.params.id).then((data) => {
    // console.log(data);
    // 在品牌筛选条件的前面加上 全部 筛选选项
    data.result.brands.unshift({ id: null, name: "全部" });
    // 在其他筛选条件的前面加上 全部 筛选选项
    data.result.saleProperties.forEach((item) => {
      item.properties.unshift({ id: null, name: "全部" });
      // 用于存储用户选择的品牌id
      item.selectedFilterName = "全部";
    });
    // 用于存储用户选择的品牌id
    data.result.selectedBrandId = null;
    // 存储筛选条件
    filters.value = data.result;
  });
  return filters;
}
</script>

<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
