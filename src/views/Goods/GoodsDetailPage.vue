<template>
  <AppLayout>
    <div class="xtx-goods-page">
      <div class="container" v-if="goodsDetail">
        <!-- 面包屑 -->
        <XtxBread>
          <XtxBreadItem path="/">首页</XtxBreadItem>
          <XtxBreadItem :path="`/category/${goodsDetail.categories[1].id}`">
            {{ goodsDetail.categories[1].name }}
          </XtxBreadItem>
          <XtxBreadItem :path="`/category/${goodsDetail.categories[0].id}`">
            {{ goodsDetail.categories[0].name }}
          </XtxBreadItem>
          <XtxBreadItem>{{ goodsDetail.name }}</XtxBreadItem>
        </XtxBread>
        <!-- 商品信息 -->
        <div class="goods-info">
          <!-- 左侧 -->
          <div class="media">
            <GoodsImages :images="goodsDetail.mainPictures"></GoodsImages>
            <!-- 商品售卖组件 -->
            <GoodsSales></GoodsSales>
          </div>
          <!-- 右侧 -->
          <div class="spec">
            <!-- 商品基本信息组件 -->
            <GoodsInfo :goods="goodsDetail"></GoodsInfo>
            <!-- 规格组件 -->
            <GoodsSku
              :specs="goodsDetail.specs"
              :skus="goodsDetail.skus"
              @onSpecChanged="onSpecChanged"
              @onSpecHalfChanged="goodsDetail.currentSelectedSkuId = null"
            ></GoodsSku>
            <!-- 商品数量选择组件 -->
            <XtxNumberBox
              label="数量"
              :max="goodsDetail.inventory"
              v-model="goodsCount"
            />
            <!-- 加入购物车 -->
            <XtxButton type="primary" style="margin-top: 15px" @click="addCart">
              加入购物车
            </XtxButton>
          </div>
        </div>
        <!-- 商品推荐 -->
        <GoodsRelevant :goodsId="goodsDetail.id"></GoodsRelevant>
        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <!-- 商品+评价 -->
            <div class="goods-tabs">
              <GoodsTab />
            </div>
            <!-- 注意事项 -->
            <div class="goods-warn">
              <GoodsWarn />
            </div>
          </div>
          <!-- 24热榜 -->
          <div class="goods-aside">
            <GoodsHot :type="1" />
            <GoodsHot :type="2" />
            <GoodsHot :type="3" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import GoodsRelevant from "@/views/Goods/components/GoodsRelevant";
import { getGoodsDetailApi } from "@/api/goods";
import { provide, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import GoodsImages from "@/views/Goods/components/GoodsImages";
import GoodsSales from "@/views/Goods/components/GoodsSales";
import GoodsInfo from "@/views/Goods/components/GoodsInfo";
import GoodsSku from "@/views/Goods/components/GoodsSku";
import GoodsTab from "@/views/Goods/components/GoodsTab";
import GoodsHot from "@/views/Goods/components/GoodsHot";
import GoodsWarn from "@/views/Goods/components/GoodsWarn";
import Message from "@/components/library/Message";
import { useStore } from "vuex";
export default {
  name: "GoodsDetailPage",
  components: {
    GoodsWarn,
    GoodsHot,
    GoodsTab,
    GoodsSku,
    GoodsInfo,
    GoodsSales,
    GoodsImages,
    GoodsRelevant,
    AppLayout,
  },
  setup() {
    // 获取商品详细信息
    const { goodsDetail } = useGoodsDetail();
    // 用于存储用户选择的商品数量
    const goodsCount = ref(1);
    // 获取store对象
    const store = useStore();
    // 当用户选择完整的规格以后 更新视图
    const onSpecChanged = (data) => {
      // console.log(data);
      goodsDetail.value.price = data.price;
      goodsDetail.value.oldPrice = data.oldPrice;
      goodsDetail.value.inventory = data.inventory;
      goodsDetail.value.currentSelectedSkuId = data.skuId;
      goodsDetail.value.currentSelectedSkuText = data.attrsText;
    };
    // 将goodsDetail数据开放到子组件
    provide("goodsDetail", goodsDetail);
    // 加入购物车
    const addCart = () => {
      // 1.判断用户是否选择了规格 如果用户没有选择规格的话 不能让他将商品加入购物车
      if (!goodsDetail.value.currentSelectedSkuId) {
        return Message({ type: "error", text: "请选择商品规格" });
      }
      // 2.收集商品信息
      const goods = {
        // 商品id
        id: goodsDetail.value.id,
        // 商品skuId
        skuId: goodsDetail.value.currentSelectedSkuId,
        // 商品名称
        name: goodsDetail.value.name,
        // 商品规格属性文字
        attrsText: goodsDetail.value.currentSelectedSkuText,
        // 商品图片
        picture: goodsDetail.value.mainPictures[0],
        // 商品原价
        price: goodsDetail.value.oldPrice,
        // 商品现价
        nowPrice: goodsDetail.value.price,
        // 是否选中
        selected: true,
        // 商品库存
        stock: goodsDetail.value.inventory,
        // 用户选择的商品数量
        count: goodsCount.value,
        // 如果用户选择了规格 该商品就一定是有效商品 因为能够选择的规格都是有库存的
        isEffective: true,
      };
      // 3.将商品加入购物车
      store
        .dispatch("cart/addGoodsToCart", goods)
        // 添加成功
        .then(() => {
          Message({ type: "success", text: "商品已经成功被添加到购物车中" });
        })
        // 添加失败
        .catch((error) => {
          Message({ type: "error", text: `${error.response.data.message}` });
        });
    };
    return { goodsDetail, onSpecChanged, goodsCount, addCart };
  },
};
// 获取商品详细信息的方法
function useGoodsDetail() {
  // 用于存储商品详细信息
  const goodsDetail = ref(null);
  // 获取路由信息对象
  const route = useRoute();
  // 用于获取商品详细信息的方法
  const getData = (id) => {
    // 向服务端发送请求获取商品详细信息
    getGoodsDetailApi(id).then((data) => {
      // console.log(data);
      // 用于存储商品详细信息
      goodsDetail.value = data.result;
    });
  };
  // 初始调用获取商品详情数据
  getData(route.params.id);
  // 当路由更新时 重新获取商品详情数据
  onBeforeRouteUpdate((to) => {
    getData(to.params.id);
  });
  return { goodsDetail };
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
