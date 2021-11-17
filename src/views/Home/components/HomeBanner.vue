<template>
  <div class="home-banner">
    <XtxCarousel
      v-if="banners"
      :carousels="banners"
      :autoPlay="true"
      :duration="3000"
    />
  </div>
</template>
<script>
import { ref } from "vue";
import { getHomeBannerApi } from "@/api/home";

export default {
  name: "HomeBanner",
  setup() {
    const banners = useBanners();
    return { banners };
  },
};
function useBanners() {
  // 用于存储轮播图数据
  const banners = ref(null);
  // 获取轮播图数据
  getHomeBannerApi().then((data) => {
    // 存储轮播图数据
    banners.value = data.result;
  });
  return banners;
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    // 样式穿透 覆盖子组件中的样式
    :deep(.carousel-btn.prev) {
      left: 270px;
    }
    :deep(.carousel-indicator) {
      padding-left: 250px;
    }
  }
}
</style>
