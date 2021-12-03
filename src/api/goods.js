import { requestWithoutToken } from "@/utils/request";

// 获取商品详细信息接口
export function getGoodsDetailApi(id) {
  return requestWithoutToken("/goods", "get", { id });
}

/***
 * 获取同类商品、猜你喜欢
 * @param id 商品id 如果传了id参数表示获取同类商品数据 如果没有传id参数表示获取猜你喜欢数据
 * @param limit 限制请求数据的数量
 * @returns {Promise}
 */
export function getRelevantGoods({ id, limit = 16 }) {
  return requestWithoutToken("/goods/relevant", "get", { id, limit });
}

/***
 * 获取热销商品
 * @param id 商品id 根据该商品推荐其同类的热销商品
 * @param limit 获取多少条商品数据
 * @param type 热销类型 1为24小时 2为周榜 3为总榜 默认为1
 * @returns {Promise}
 */
export function getGoodsHotApi({ id, limit = 3, type = 1 }) {
  return requestWithoutToken("/goods/hot", "get", { id, limit, type });
}

/***
 * 获取商品评价头部信息
 * @param id 商品id
 * @returns {Promise}
 */
export function getCommentInfoApi(id) {
  return requestWithoutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    "get"
  );
}

/***
 * 获取评论列表数据
 * @param id 商品id
 * @param params 其他的查询参数
 * @returns {Promise}
 */
export function getCommentListApi(params) {
  return requestWithoutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${params.id}/evaluate/page`,
    "get",
    params
  );
}
