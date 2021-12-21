import { requestWithoutToken, requestWithToken } from "@/utils/request";

/**
 * 更新购物车中的商品信息(库存，是否有效，现价)
 * @param skuId
 * @param id
 * @returns {Promise}
 */
export function updateLocalCart({ skuId, id }) {
  return requestWithoutToken(`/goods/stock/${skuId}`, "get", { id });
}

/**
 * 根据skuId获取规格信息(供用户选择的规格选项数据、所有可组合的规格组合)
 * @param skuId 商品规格id
 * @returns {Promise}
 */
export function getSkuInfoBySkuId(skuId) {
  return requestWithoutToken(`/goods/sku/${skuId}`, "get");
}

/**
 * 将本地购物车和服务器端购物车进行合并
 * @param cart {Array<{skuId:string, selected:boolean, count:number}>}
 * @returns {Promise}
 */
export function mergeCart(cart) {
  return requestWithToken("/member/cart/merge", "post", cart);
}

/**
 * 获取服务器端购物车列表数据
 * @returns {Promise}
 */
export function getCartList() {
  return requestWithToken("/member/cart", "get");
}

/**
 * 将商品加入购物车
 * @param skuId{string} 商品skuId
 * @param count{number} 商品数量
 * @returns {Promise}
 */
export function addGoodsToCart({ skuId, count }) {
  return requestWithToken("/member/cart", "post", { skuId, count });
}

/**
 * 删除购物车中的商品 支持批量删除 支持单个删除
 * @param ids {Array<string>} 商品skuId数组
 * @returns {Promise}
 */
export function deleteGoodsOfCartBySkuIds(ids) {
  return requestWithToken("/member/cart", "delete", { ids });
}

/**
 * 更新购物车中的商品信息(支持是否选中和商品数量)
 * @param skuId{string} 商品skuId
 * @param selected{boolean} 是否选中状态
 * @param count{number} 商品数量
 * @returns {Promise}
 */
export function updateGoodsOfCartBySkuId({ skuId, selected, count }) {
  return requestWithToken(`/member/cart/${skuId}`, "put", { selected, count });
}

/**
 * 全选全不选
 * @param selected 选中状态
 * @param ids skuId数组
 * @returns {Promise}
 */
export function selectOrUnselectCartGoods({ selected, ids }) {
  return requestWithToken("/member/cart/selected", "put", { selected, ids });
}
