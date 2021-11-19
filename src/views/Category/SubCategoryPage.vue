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
      <SubFilter />
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";
import SubFilter from "@/views/Category/components/SubFilter";
export default {
  name: "SubCategoryPage",
  components: { SubFilter, AppLayout },
  setup() {
    const category = useBreadItem();
    return { category };
  },
};
// 获取面包屑组件数据
function useBreadItem() {
  // 获取store对象
  const store = useStore();
  // 获取路由信息对象
  const route = useRoute();
  const category = computed(() => {
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
  // 返回分类数据
  return category;
}
</script>

<style scoped></style>
