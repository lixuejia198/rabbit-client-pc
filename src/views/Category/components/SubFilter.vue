<template>
  <div class="sub-filter" v-if="filters && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="
            filters.selectedBrandId = brand.id;
            updateSelectedFilters();
          "
          :class="{ active: brand.id === filters.selectedBrandId }"
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
          @click="
            item.selectedFilterName = property.name;
            updateSelectedFilters();
          "
          :class="{ active: property.name === item.selectedFilterName }"
          v-for="property in item.properties"
          :key="property.id"
        >
          {{ property.name }}
        </a>
      </div>
    </div>
  </div>
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { ref } from "vue";
import { getSubCategoryFilterById } from "@/api/category";

export default {
  name: "SubFilter",
  setup(props, { emit }) {
    const { filters, updateSelectedFilters, getData, filterLoading } =
      useSubCategoryFilter(emit);
    // 获取路由信息对象
    const route = useRoute();
    // 发送请求获取筛选条件
    getData(route.params.id);
    return { filters, updateSelectedFilters, filterLoading };
  },
};
// 获取筛选条件
function useSubCategoryFilter(emit) {
  // 用于存储所有筛选条件数据
  const filters = ref(null);
  // 表示是否正在加载数据
  const filterLoading = ref(false);
  // 用于存储最终的筛选条件数据
  const selectedFilters = {
    brandId: null,
    attrs: [],
  };
  // 汇总用户选择的筛选条件
  const updateSelectedFilters = () => {
    // 汇总用户选择的品牌id
    selectedFilters.brandId = filters.value.selectedBrandId;
    // 清除原有的筛选条件数据
    selectedFilters.attrs = [];
    // 汇总用户选择的其他筛选条件
    filters.value.saleProperties.forEach((item) => {
      // 如果用户选择了筛选条件并且用户选择的筛选条件不是全部
      if (item.selectedFilterName && item.selectedFilterName !== "全部") {
        // 将用户选择的筛选条件存储在attrs数组中
        selectedFilters.attrs.push({
          // 筛选类别名称(比如颜色、尺寸...)
          groupName: item.name,
          // 具体的筛选条件名称(比如黑色、10cm...)
          propertyName: item.selectedFilterName,
        });
      }
    });
    // console.log(selectedFilters, "selectedFilters");
    // 将用户选择的筛选条件传递到父组件 以备后续使用
    emit("onFilterParamsChanged", selectedFilters);
  };
  // 用于获取筛选条件的方法
  const getData = (id) => {
    // 更新加载状态
    filterLoading.value = true;
    // 向服务器端发送请求获取筛选条件数据
    getSubCategoryFilterById(id).then((data) => {
      // console.log(data);
      // 在品牌筛选条件的前面加上 全部 筛选选项
      data.result.brands.unshift({ id: null, name: "全部" });
      // 在其他筛选条件的前面加上 全部 筛选选项
      data.result.saleProperties.forEach((item) => {
        item.properties.unshift({ id: null, name: "全部" });
        // 用于存储用户选择的具体筛选条件名称
        item.selectedFilterName = "全部";
      });
      // 用于存储用户选择的品牌id
      data.result.selectedBrandId = null;
      // 存储筛选条件
      filters.value = data.result;
      // 更新加载状态
      filterLoading.value = false;
    });
  };
  // 监听路由参数的变化 当路由参数发生变化以后重新获取筛选条件数据
  onBeforeRouteUpdate((to) => getData(to.params.id));

  return {
    filters,
    updateSelectedFilters,
    getData,
    filterLoading,
  };
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
.xtx-skeleton {
  padding: 10px 0;
}
</style>
