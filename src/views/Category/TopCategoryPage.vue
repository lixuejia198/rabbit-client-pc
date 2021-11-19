<template>
  <AppLayout>
    <div class="container">
      <XtxBread v-if="category">
        <XtxBreadItem path="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem :path="`/category/${category.id}`" :key="category.id">
            {{ category.name }}
          </XtxBreadItem>
        </transition>
      </XtxBread>
      <XtxCarousel
        :carousels="banners"
        :style="{ height: '500px' }"
        :autoPlay="true"
      />
      <ShowSubCategoryList :subCategories="category?.children" />
      <RecommendGoods />
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";
import useBanners from "@/hooks/useBanners";
import ShowSubCategoryList from "@/views/Category/components/ShowSubCategoryList";
import RecommendGoods from "@/views/Category/components/RecommendGoods";
export default {
  name: "TopCategoryPage",
  components: { RecommendGoods, ShowSubCategoryList, AppLayout },
  setup() {
    const category = useBread();
    const banners = useBanners();
    return { category, banners };
  },
};
// 获取面包屑组件数据
function useBread() {
  // 获取store对象
  const store = useStore();
  // 获取路由信息对象
  const route = useRoute();
  // 利用计算属性实时获取当前访问的分类信息(因为刚开始category.list里面只有name没有id，只有真实数据请求过来以后才有id，
  // 所以需要通过计算属性监控数据变化，当数据发生变化后重新查找分类数据)
  const category = computed(() => {
    return store.state.category.list.find(
      (item) => item.id === route.params.id
    );
  });
  return category;
}
</script>

<style scoped></style>
