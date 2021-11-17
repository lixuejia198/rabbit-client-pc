<template>
  <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱" ref="target">
    <template v-slot:right>
      <XtxMore />
    </template>
    <template v-slot:default>
      <ul class="goods-list" v-if="news">
        <li v-for="item in news" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <Transition name="fade">
        <!-- 骨架屏效果 -->
        <HomeSkeleton v-if="news == null" />
      </Transition>
    </template>
  </HomePanel>
</template>
<script>
import HomePanel from "@/views/Home/components/HomePanel";
import { getHomeNewApi } from "@/api/home";
import useLazyData from "@/hooks/useLazyData";
import HomeSkeleton from "@/views/Home/components/HomeSkeleton";
// import { ref } from "vue";
export default {
  name: "HomeNew",
  components: { HomeSkeleton, HomePanel },
  setup() {
    // const news = useHomeNew();
    // return { news };
    const { target, result } = useLazyData(getHomeNewApi);
    return {
      news: result,
      target,
    };
  },
};
// function useHomeNew() {
//   const news = ref(null);
//   getHomeNewApi(4).then((data) => {
//     news.value = data.result;
//   });
//   return news;
// }
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
