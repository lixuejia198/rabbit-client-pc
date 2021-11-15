<template>
  <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
    <template v-slot:default>
      <ul class="goods-list">
        <li v-for="item in hots" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <p class="name">{{ item.title }}</p>
            <p class="desc">{{ item.alt }}</p>
          </RouterLink>
        </li>
      </ul>
    </template>
  </HomePanel>
</template>

<script>
import HomePanel from "@/views/Home/components/HomePanel";
import { getHomeHotApi } from "@/api/home";
import { ref } from "vue";
export default {
  name: "HomeHot",
  components: { HomePanel },
  setup() {
    const hots = useHomeHot();
    return { hots };
  },
};
function useHomeHot() {
  const hots = ref(null);
  getHomeHotApi().then((data) => {
    hots.value = data.result;
  });
  return hots;
}
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
