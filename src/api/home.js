import { requestWithoutToken } from "@/utils/request";

// 品牌数据接口
export function getBrandApi(limit) {
  return requestWithoutToken("/home/brand", "get", { limit });
}
// 轮播图数据接口
export function getHomeBannerApi(distributionSite = 1) {
  return requestWithoutToken("/home/banner", "get", { distributionSite });
}
// 新鲜好物接口
export function getHomeNewApi(limit) {
  return requestWithoutToken("/home/new", "get", { limit });
}
// 人气推荐接口
export function getHomeHotApi() {
  return requestWithoutToken("/home/hot", "get");
}
