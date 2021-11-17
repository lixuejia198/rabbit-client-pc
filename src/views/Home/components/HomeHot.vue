<template>
  <HomePanel title="人气推荐" subTitle="人气爆款 不容错过" ref="target">
    <template v-slot:default>
      <ul class="goods-list" v-if="hots">
        <li v-for="item in hots" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.title }}</p>
            <p class="desc">{{ item.alt }}</p>
          </RouterLink>
        </li>
      </ul>
      <Transition name="fade">
        <!-- 骨架屏效果 -->
        <HomeSkeleton v-if="hots == null" />
      </Transition>
    </template>
  </HomePanel>
</template>

<script>
import HomePanel from "@/views/Home/components/HomePanel";
import { getHomeHotApi } from "@/api/home";
import useLazyData from "@/hooks/useLazyData";
import HomeSkeleton from "@/views/Home/components/HomeSkeleton";
// import { ref } from "vue";
export default {
  name: "HomeHot",
  components: { HomeSkeleton, HomePanel },
  setup() {
    // const hots = useHomeHot();
    // return { hots };
    const { target, result } = useLazyData(getHomeHotApi);
    return {
      hots: result,
      target,
    };
  },
};
// function useHomeHot() {
//   const hots = ref(null);
//   getHomeHotApi().then((data) => {
//     hots.value = data.result;
//   });
//   return hots;
// }
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
