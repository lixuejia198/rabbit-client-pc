import { requestWithoutToken } from "@/utils/request";

// 品牌数据接口 包括热门品牌
export function getBrandApi(limit) {
  return requestWithoutToken("/home/brand", "get", { limit });
}
// 轮播图数据接口
export function getHomeBannerApi(distributionSite = 1) {
  return requestWithoutToken("/home/banner", "get", { distributionSite });
}
// 新鲜好物接口
export function getHomeNewApi(limit = 4) {
  return requestWithoutToken("/home/new", "get", { limit });
}
// 人气推荐接口
export function getHomeHotApi() {
  return requestWithoutToken("/home/hot", "get");
}
// 产品区块接口
export function getHomeProductApi() {
  return requestWithoutToken("/home/goods", "get");
}
// 最新专题接口
export function getHomeSpecialApi(limit = 3) {
  return requestWithoutToken("/home/special", "get", { limit });
}
