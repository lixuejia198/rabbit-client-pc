import { requestWithoutToken } from "@/utils/request";

// 获取头部分类数据
export function getCategoriesApi() {
  return requestWithoutToken("/home/category/head", "get");
}
// 获取具体一级类目信息的 API 接口
export function getTopCategoryById(id) {
  return requestWithoutToken("/category", "get", { id });
}
// 根据二级分类id获取筛选条件
export function getSubCategoryFilterById(id) {
  return requestWithoutToken("/category/sub/filter", "get", { id });
}
