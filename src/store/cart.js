import {
  addGoodsToCart,
  deleteGoodsOfCartBySkuIds,
  getCartList,
  mergeCart,
  selectOrUnselectCartGoods,
  updateGoodsOfCartBySkuId,
  updateLocalCart,
} from "@/api/cart";

export default {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  state() {
    return {
      // 存储购物车列表
      list: [],
    };
  },
  mutations: {
    // 将商品加入购物车
    addGoodsToCart(state, goods) {
      /*
       * 需求：
       *   如果购物车中已经存在该商品,那就累加购物车中该商品的数量
       *   新添加到购物车中的商品应该被自动显示在列表顶部(包括累加数量的商品)
       * */
      // 在购物车列表中查找当前要添加的商品
      const index = state.list.findIndex((item) => item.skuId === goods.skuId);
      // 如果购物车中已经存在该商品
      if (index > -1) {
        // 商品数量累加
        state.list[index].count += goods.count;
        // 将商品从购物车中删除 再将它重新添加到购物车顶端
        state.list.unshift(state.list.splice(index, 1)[0]);
      } else {
        // 将商品直接添加到购物车中
        state.list.unshift(goods);
      }
    },
    // 根据skuId删除商品
    deleteCart(state, skuId) {
      // 1.获取要被删除商品的索引
      const index = state.list.findIndex((item) => item.skuId === skuId);
      // 2.删除商品
      if (index > -1) {
        // slice 从数组中进行截取 返回截取数组
        // ["a", "b", "c", "d"]
        state.list = [
          ...state.list.slice(0, index),
          ...state.list.slice(index + 1),
        ];
      }
    },
    // 根据skuId更新商品信息
    // 注意：partOfGoods中必须有skuId 但是服务器端返回的数据中是没有的 记得手动添加
    updateGoodsBySkuId(state, partOfGoods) {
      // 根据skuId更新商品信息
      const index = state.list.findIndex(
        // 根据skuId在购物车列表中查找要更新的商品
        (item) => item.skuId === partOfGoods.skuId
      );
      // 更新商品
      state.list[index] = {
        ...state.list[index],
        ...partOfGoods,
      };
    },
    // 设置购物车列表
    setCart(state, payload) {
      state.list = payload;
    },
  },
  actions: {
    // 将商品加入购物车
    async addGoodsToCart({ rootState, commit, dispatch }, goods) {
      // 判断用户是否登录
      if (rootState.user.profile.token) {
        // 登录
        // 发送请求 将商品添加到服务器端购物车
        await addGoodsToCart({
          skuId: goods.skuId,
          count: goods.count,
        });
        // 更新购物车商品列表
        dispatch("updateCartList");
      } else {
        // 未登录
        commit("addGoodsToCart", goods);
      }
    },
    // 根据skuId删除商品
    async deleteCart({ rootState, commit, dispatch }, skuId) {
      // 判断用户是否登录
      if (rootState.user.profile.token) {
        //  已登录
        // 发送请求 删除购物车列表的商品
        await deleteGoodsOfCartBySkuIds([skuId]);
        // 更新购物车商品列表
        dispatch("updateCartList");
      } else {
        //  未登录
        commit("deleteCart", skuId);
      }
    },
    // 更新购物车中商品(many)
    async updateCartList({ rootState, state, commit }) {
      if (rootState.user.profile.token) {
        // 登录
        // 获取服务器端购物车列表数据
        let data = await getCartList();
        // 将服务器端购物车列表数据存储到vuex中
        commit("setCart", data.result);
      } else {
        // 未登录
        // 遍历购物车中的商品 发送请求获取该商品的最新信息
        const cartListPromises = state.list.map(({ skuId, id }) => {
          // 将方法调用后返回的Promise对象存储在一个数组中
          return updateLocalCart({ skuId, id });
        });
        // 批量获取多个请求的响应数据 所有响应数据被存储在一个数组中
        Promise.all(cartListPromises).then((dataCollection) => {
          // 遍历响应结果
          dataCollection.forEach((data, index) => {
            // 为数据添加skuId
            data.result.skuId = state.list[index].skuId;
            // 更新本地的商品数据
            commit("updateGoodsBySkuId", data.result);
          });
        });
      }
    },
    // 更新购物车中商品(one)(支持商品数量和选中状态)
    async updateGoodsOfCartBySkuId({ rootState, commit, dispatch }, goods) {
      if (rootState.user.profile.token) {
        // 登录
        // 更新购物车商品数量信息
        await updateGoodsOfCartBySkuId(goods);
        // 更新购物车商品列表
        dispatch("updateCartList");
      } else {
        // 未登录
        commit("updateGoodsBySkuId", goods);
      }
    },
    // 实现全选全不选
    async selectAll({ rootState, getters, commit, dispatch }, isAll) {
      if (rootState.user.profile.token) {
        // 登录
        // 获取商品skuId数组
        const ids = getters.effectiveGoodsList.map((item) => item.skuId);
        // 发送请求执行 全选、全不选操作
        await selectOrUnselectCartGoods({ selected: isAll, ids });
        // 更新购物车商品列表
        dispatch("updateCartList");
      } else {
        // 未登录
        getters.effectiveGoodsList.forEach((item) => {
          commit("updateGoodsBySkuId", { skuId: item.skuId, selected: isAll });
        });
      }
    },
    // 删除用户选择的商品 清空无效商品
    async deleteSelectedCartOrInvalid(
      { rootState, getters, commit, dispatch },
      flag
    ) {
      if (rootState.user.profile.token) {
        // 登录
        // 获取要批量删除商品的skuId数组
        const skuIds = getters[flag].map((item) => item.skuId);
        // 发送请求 批量删除商品
        await deleteGoodsOfCartBySkuIds(skuIds);
        // 更新商品列表
        dispatch("updateCartList");
      } else {
        // 未登录
        getters[flag].forEach((item) => {
          commit("deleteCart", item.skuId);
        });
      }
    },
    // 商品规格信息发生变化 更新商品信息
    async updateGoodsOfCartBySkuChanged(
      { rootState, state, commit, dispatch },
      { oldSkuId, userSelectedNewSku }
    ) {
      if (rootState.user.profile.token) {
        // 登录
        // 查找原有商品信息 通过原有商品信息获取用户选择的商品数据
        const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
        // 删除原有商品
        await deleteGoodsOfCartBySkuIds([oldSkuId]);
        // 添加新商品
        await addGoodsToCart({
          skuId: userSelectedNewSku.skuId,
          count: oldGoods.count,
        });
        // 更新购物车商品列表
        await dispatch("updateCartList");
      } else {
        //  未登录
        // 先根据旧的skuId查找商品 根据旧商品生成新商品 删除旧商品 插入新商品
        // 查找旧商品
        const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
        // console.log(oldGoods);
        // console.log(userSelectedNewSku);
        // 生成新商品
        const newGoods = {
          ...oldGoods,
          skuId: userSelectedNewSku.skuId,
          stock: userSelectedNewSku.inventory,
          oldPrice: userSelectedNewSku.oldPrice,
          nowPrice: userSelectedNewSku.price,
          attrsText: userSelectedNewSku.attrsText,
        };
        // 删除旧商品
        commit("deleteCart", oldSkuId);
        // 插入新商品
        commit("addGoodsToCart", newGoods);
      }
    },
    // 合并购物车
    async mergeCart({ state, commit }) {
      // 如果本地购物车中没有数据 不用进行合并
      if (state.list.length === 0) return;
      // 准备合并购物车接口所需数据
      const carts = state.list.map((item) => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count,
      }));
      try {
        // 合并购物车
        await mergeCart(carts);
        // 清空本地购物车
        commit("setCart", []);
      } catch (error) {
        // 购物车合并失败 抛出异常
        throw new Error(error);
      }
    },
  },
  getters: {
    // 可购买商品列表(有效商品+商品库存数量大于0)
    effectiveGoodsList(state) {
      return state.list.filter((item) => item.isEffective && item.stock > 0);
    },
    // 可购买商品总价
    effectiveGoodsPrice(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (totalPrice, item) => totalPrice + item.count * Number(item.nowPrice),
        0
      );
    },
    // 可购买商品数量
    effectiveGoodsCount(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (totalCount, item) => totalCount + item.count,
        0
      );
    },
    // 不可购买的商品列表(无效商品列表)
    invalidGoodsList(state) {
      return state.list.filter((item) => !item.isEffective || item.stock === 0);
    },
    // 用户选择的商品列表
    userSelectedGoodsList(state, getters) {
      return getters.effectiveGoodsList.filter((item) => item.selected);
    },
    // 用户选择的商品数量
    userSelectedGoodsCount(state, getters) {
      return getters.userSelectedGoodsList.reduce((count, item) => {
        return count + item.count;
      }, 0);
    },
    // 用户选择的商品总价
    userSelectedGoodsPrice(state, getters) {
      return getters.userSelectedGoodsList
        .reduce((price, item) => {
          return price + Number(item.nowPrice) * item.count;
        }, 0)
        .toFixed(2);
    },
    // 计算全选按钮的状态
    selectAllButtonStatus(state, getters) {
      // 有效商品数量大于0
      // 用户选择的商品列表中的商品数量和有效商品列表中商品数量相同
      return (
        getters.effectiveGoodsCount > 0 &&
        getters.userSelectedGoodsCount === getters.effectiveGoodsCount
      );
    },
  },
};
