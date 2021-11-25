<template>
  <AppLayout>
    <div class="container">
      <XtxBread v-if="category.topCategory">
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <XtxBreadItem :path="`/category/${category.topCategory.id}`">
          {{ category.topCategory.name }}
        </XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem
            :path="`/category/sub/${category.subCategory.id}`"
            :key="category.subCategory.id"
          >
            {{ category.subCategory.name }}
          </XtxBreadItem>
        </transition>
      </XtxBread>
      <SubFilter @onFilterParamsChanged="onFilterSortParamsChanged" />
      <div class="goods-list" v-if="goodsList">
        <!--  商品排序  -->
        <SubSort @onSortParamsChanged="onFilterSortParamsChanged" />
        <!--  商品列表  -->
        <GoodsList :goods="goodsList.items" />
        <!--  无限列表加载组件  -->
        <XtxInfiniteLoading
          @infinite="loadMore"
          :loading="loading"
          :finished="finished"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import SubFilter from "@/views/Category/components/SubFilter";
import SubSort from "@/views/Category/components/SubSort";
import GoodsList from "@/views/Category/components/GoodsList";
import { getGoodsReq } from "@/api/category";
export default {
  name: "SubCategoryPage",
  components: { GoodsList, SubSort, SubFilter, AppLayout },
  setup() {
    const category = useBreadItem();

    const {
      goodsList,
      onFilterSortParamsChanged,
      loadMore,
      loading,
      finished,
    } = useGoods();
    return {
      category,
      goodsList,
      onFilterSortParamsChanged,
      loadMore,
      loading,
      finished,
    };
  },
};
// 获取面包屑组件数据
function useBreadItem() {
  // 获取store对象
  const store = useStore();
  // 获取路由信息对象
  const route = useRoute();
  return computed(() => {
    // 临时存储一级分类
    let topCategory = null;
    // 临时存储二级分类
    let subCategory = null;
    // 遍历一级分类
    store.state.category.list.forEach((top) => {
      // 遍历二级分类
      top.children?.forEach((sub) => {
        // 判断是否是当前分类
        if (sub.id === route.params.id) {
          // 存储一级分类
          topCategory = top;
          // 存储二级分类
          subCategory = sub;
        }
      });
    });
    return {
      topCategory,
      subCategory,
    };
  });
}
// 获取商品列表数据
function useGoods() {
  // 用于标识加载状态
  const loading = ref(false);
  // 用于标识是否全部数据都已经加载完成
  const finished = ref(false);
  // 用于存储商品数据
  const goodsList = ref(null);
  // 获取路由信息对象
  const route = useRoute();
  // 用于存储请求参数
  const reqParams = ref({
    categoryId: route.params.id,
    page: 1,
    pageSize: 10,
  });
  // 用于获取商品数据(初始进入页面 筛选条件变化 排序条件变化都要调用getData)
  const getData = () => {
    // 加载中
    loading.value = true;
    // 向服务端发送请求获取商品数据
    getGoodsReq(reqParams.value).then((data) => {
      // 如果当前页是第一页
      if (reqParams.value.page === 1) {
        // 当页面重置为1 重置finished
        finished.value = false;
        // 直接赋值
        goodsList.value = data.result;
      } else {
        // 如果当前页不是第一页 做商品数据的累加
        goodsList.value = {
          ...data.result,
          items: [...goodsList.value.items, ...data.result.items],
        };
      }
      // 如果当前页已经是最后一页
      if (reqParams.value.page === data.result.pages) {
        // 所有数据加载完成
        finished.value = true;
      }
      // 加载完成
      loading.value = false;
    });
  };
  // 加载更多
  const loadMore = () => {
    // 当前页+1
    reqParams.value = { ...reqParams.value, page: reqParams.value.page + 1 };
  };
  // 当筛选条件和排序条件发生变化时 重新获取商品数据 并将页码重置为1
  const onFilterSortParamsChanged = (target) => {
    // console.log(target);
    reqParams.value = { ...reqParams.value, ...target, page: 1 };
  };
  // 监听请求参数变化 重新获取数据
  watch(
    () => reqParams.value,
    () => {
      getData();
    },
    // 初始进入页面需要获取商品数据
    {
      immediate: true,
    }
  );
  // 实现路由参数更新 重新获取商品数据
  onBeforeRouteUpdate((to) => {
    reqParams.value = {
      categoryId: to.params.id,
      // 路由更新 重置页码
      page: 1,
    };
  });

  return { goodsList, onFilterSortParamsChanged, loading, finished, loadMore };
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>
