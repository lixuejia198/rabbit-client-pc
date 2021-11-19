import { ref } from "vue";
import { getHomeBannerApi } from "@/api/home";

export default function useBanners() {
  // 用于存储轮播图数据
  const banners = ref(null);
  // 获取轮播图数据
  getHomeBannerApi().then((data) => {
    // 存储轮播图数据
    banners.value = data.result;
  });
  return banners;
}
