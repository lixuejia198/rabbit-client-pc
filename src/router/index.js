import { createRouter, createWebHashHistory } from "vue-router";
import homePage from "@/views/Home/homePage";

// 懒加载路由
const TopCategoryPage = () => import("@/views/Category/TopCategoryPage");
const SubCategoryPage = () => import("@/views/Category/SubCategoryPage");
const GoodsDetailPage = () => import("@/views/Goods/GoodsDetailPage");

const routes = [
  // 首页
  {
    path: "/",
    component: homePage,
  },
  // 一级分类
  {
    path: "/category/:id",
    component: TopCategoryPage,
  },
  // 二级分类
  {
    path: "/category/sub/:id",
    component: SubCategoryPage,
  },
  //  商品详情
  {
    path: "/goods/:id",
    component: GoodsDetailPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
});

export default router;
