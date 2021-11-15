import { requestWithoutToken } from "@/utils/request";

export function getCategoriesApi() {
  return requestWithoutToken("/home/category/head", "get");
}
