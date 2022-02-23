import { createRouter, createWebHashHistory } from "vue-router";
import homePage from "@/views/Home/homePage";
import authGuard from "@/router/authGuard";

// 懒加载路由
const TopCategoryPage = () => import("@/views/Category/TopCategoryPage");
const SubCategoryPage = () => import("@/views/Category/SubCategoryPage");
const GoodsDetailPage = () => import("@/views/Goods/GoodsDetailPage");
const LoginPage = () => import("@/views/Login/LoginPage");
const LoginCallbackPage = () => import("@/views/Login/LoginCallbackPage");
const CartPage = () => import("@/views/Cart/CartPage");
const CheckoutPage = () => import("@/views/Pay/CheckoutPage");
const PayPage = () => import("@/views/Pay/PayPage");
const PayResultPage = () => import("@/views/Pay/PayResultPage");
const MemberHomePage = () => import("@/views/Member/home/MemberHomePage");
const OrderListPage = () => import("@/views/Member/order/OrderListPage");
const OrderDetailPage = () => import("@/views/Member/order/OrderDetailPage");
const OrderView = () => import("@/views/Member/order/OrderView");

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
  // 登录
  {
    path: "/login",
    component: LoginPage,
  },
  // 登录回调页
  {
    path: "/login/callback",
    component: LoginCallbackPage,
  },
  // 购物车页面
  {
    path: "/cart",
    component: CartPage,
  },
  // 结算页面
  {
    path: "/checkout/order",
    component: CheckoutPage,
  },
  // 支付页面
  {
    path: "/checkout/pay",
    component: PayPage,
  },
  // 支付结果页面
  {
    path: "/pay/callback",
    component: PayResultPage,
  },
  // 个人中心页面
  {
    path: "/member/home",
    component: MemberHomePage,
  },
  {
    path: "/member/order",
    component: OrderView,
    children: [
      // 订单列表页面
      {
        path: "",
        component: OrderListPage,
      },
      // 订单详情页面
      {
        path: ":id",
        component: OrderDetailPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
  linkActiveClass: "fuzzy-active",
  linkExactActiveClass: "exact-active",
});

// 检测用户是否登录
router.beforeEach(authGuard);

export default router;
