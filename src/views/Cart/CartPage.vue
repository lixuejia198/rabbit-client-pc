<template>
  <AppLayout>
    <div class="cart-page">
      <div class="container">
        <XtxBread>
          <XtxBreadItem path="/">首页</XtxBreadItem>
          <XtxBreadItem>购物车</XtxBreadItem>
        </XtxBread>
        <div class="cart">
          <table>
            <thead>
              <tr>
                <th>
                  <XtxCheckbox
                    :modelValue="selectAllButtonStatus"
                    @update:modelValue="selectAllGoods($event)"
                  >
                    全选
                  </XtxCheckbox>
                </th>
                <th>商品信息</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <!-- 有效商品 -->
            <tbody>
              <tr v-if="effectiveGoodsCount === 0">
                <td colspan="6">
                  <EmptyCart />
                </td>
              </tr>
              <tr v-for="goods in effectiveGoodsList" :key="goods.id">
                <td>
                  <XtxCheckbox
                    :modelValue="goods.selected"
                    @update:modelValue="selectGoods(goods.skuId, $event)"
                  />
                </td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/goods/${goods.id}`">
                      <img :src="goods.picture" alt="" />
                    </RouterLink>
                    <div>
                      <p class="name ellipsis">
                        {{ goods.name }}
                      </p>
                      <!-- 选择规格组件 -->
                      <CartSku
                        :attrsText="goods.attrsText"
                        :skuId="goods.skuId"
                      />
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <p>&yen;{{ goods.nowPrice }}</p>
                  <p v-if="goods.price - goods.nowPrice > 0">
                    比加入时降价
                    <span class="red">
                      &yen;{{ (goods.price - goods.nowPrice).toFixed(2) }}
                    </span>
                  </p>
                </td>
                <td class="tc">
                  <XtxNumberBox
                    :max="goods.stock"
                    :modelValue="goods.count"
                    @update:modelValue="
                      changeGoodsCountOfCartBySkuId(goods.skuId, $event)
                    "
                  ></XtxNumberBox>
                </td>
                <td class="tc">
                  <p class="f16 red">
                    &yen;{{ (goods.nowPrice * goods.count).toFixed(2) }}
                  </p>
                </td>
                <td class="tc">
                  <p><a href="javascript:">移入收藏夹</a></p>
                  <p>
                    <a
                      class="green"
                      href="javascript:"
                      @click="deleteGoodsOfCartBySkuId(goods.skuId)"
                    >
                      删除
                    </a>
                  </p>
                  <p><a href="javascript:">找相似</a></p>
                </td>
              </tr>
            </tbody>
            <!-- 无效商品 -->
            <tbody>
              <tr>
                <td colspan="6"><h3 class="tit">失效商品</h3></td>
              </tr>
              <tr v-for="goods in invalidGoodsList" :key="goods.id">
                <td></td>
                <td>
                  <div class="goods">
                    <RouterLink :to="`/goods/${goods.id}`">
                      <img :src="goods.picture" alt="" />
                    </RouterLink>
                    <div>
                      <p class="name ellipsis">
                        {{ goods.name }}
                      </p>
                      <p class="attr">{{ goods.attrsText }}</p>
                    </div>
                  </div>
                </td>
                <td class="tc">
                  <p>&yen;{{ goods.nowPrice }}</p>
                </td>
                <td class="tc">{{ goods.count }}</td>
                <td class="tc">
                  <p>&yen;{{ (goods.nowPrice * goods.count).toFixed(2) }}</p>
                </td>
                <td class="tc">
                  <p><a class="green" href="javascript:">删除</a></p>
                  <p><a href="javascript:">找相似</a></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 操作栏 -->
        <div class="action">
          <div class="batch">
            <XtxCheckbox>全选</XtxCheckbox>
            <a
              href="javascript:"
              @click="deleteGoodsOfCart('userSelectedGoodsList')"
            >
              删除商品
            </a>
            <a href="javascript:"> 移入收藏夹 </a>
            <a
              href="javascript:"
              @click="deleteGoodsOfCart('invalidGoodsList')"
            >
              清空失效商品
            </a>
          </div>
          <div class="total">
            共 {{ effectiveGoodsCount }} 件商品， 已选择
            {{ userSelectedGoodsCount }}
            件，商品合计：
            <span class="red">¥{{ userSelectedGoodsPrice }}</span>
            <XtxButton type="primary">下单结算</XtxButton>
          </div>
        </div>
        <!-- 猜你喜欢 -->
        <GoodsRelevant />
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import GoodsRelevant from "@/views/Goods/components/GoodsRelevant";
import { useStore } from "vuex";
import { computed } from "vue";
import Message from "@/components/library/Message";
import EmptyCart from "@/views/Cart/components/EmptyCart";
import Confirm from "@/components/library/Confirm";
import CartSku from "@/views/Cart/components/CartSku";
export default {
  name: "CartPage",
  components: { CartSku, EmptyCart, GoodsRelevant, AppLayout },
  setup() {
    // 获取store对象
    const store = useStore();
    // 获取有效商品列表
    const effectiveGoodsList = computed(
      () => store.getters["cart/effectiveGoodsList"]
    );
    // 获取有效商品数量
    const effectiveGoodsCount = computed(
      () => store.getters["cart/effectiveGoodsCount"]
    );
    // 获取无效商品列表
    const invalidGoodsList = computed(
      () => store.getters["cart/invalidGoodsList"]
    );
    // 获取用户选择的商品数量
    const userSelectedGoodsCount = computed(
      () => store.getters["cart/userSelectedGoodsCount"]
    );
    // 获取用户选择的商品总价
    const userSelectedGoodsPrice = computed(
      () => store.getters["cart/userSelectedGoodsPrice"]
    );
    // 更新本地购物车商品信息
    store.dispatch("cart/updateCartList").then(() => {
      Message({ type: "success", text: "本地购物车中的商品信息更新成功" });
    });
    // 单选
    const selectGoods = (skuId, isSelected) => {
      // 根据skuId更新单个商品信息
      store.dispatch("cart/updateGoodsOfCartBySkuId", {
        skuId,
        selected: isSelected,
      });
    };
    // 获取全选按钮状态
    const selectAllButtonStatus = computed(
      () => store.getters["cart/selectAllButtonStatus"]
    );
    // 全选全不选
    const selectAllGoods = (isAll) => {
      // console.log(isAll, "isAll");
      store.dispatch("cart/selectAll", isAll);
    };
    // 删除商品
    const deleteGoodsOfCartBySkuId = (skuId) => {
      Confirm({ content: "您确定要删除该商品吗？" }).then(() => {
        store.dispatch("cart/deleteCart", skuId);
      });
    };
    // 批量删除用户选择的商品、清空无效商品
    const deleteGoodsOfCart = (flag) => {
      // 确认框的提示内容
      let content = "";
      // 如果当前操作是删除用户选择的商品
      if (flag === "userSelectedGoodsList") {
        // 判断用户是否选择了商品
        if (userSelectedGoodsCount.value === 0) {
          Message({ type: "warn", text: "至少要选中一件商品" });
          return;
        }
        // 设置确认框提示内容
        content = "您确定要删除选中的商品吗？";
      } else if (flag === "invalidGoodsList") {
        // 如果当前操作是清空无效商品
        // 判断当前是否有无效商品
        if (invalidGoodsList.value.length === 0) {
          Message({ type: "warn", text: "没有无效商品" });
          return;
        }
        // 设置确认框提示内容
        content = "您确定要删除无效商品吗？";
      }
      // 和用户进行确认
      Confirm({ content }).then(() => {
        // 执行操作
        store.dispatch("cart/deleteSelectedCartOrInvalid", flag);
      });
    };
    // 更改购物车中的商品数量
    const changeGoodsCountOfCartBySkuId = (skuId, count) => {
      console.log(skuId, count);
      store.dispatch("cart/updateGoodsOfCartBySkuId", { skuId, count });
    };
    return {
      effectiveGoodsList,
      effectiveGoodsCount,
      invalidGoodsList,
      userSelectedGoodsCount,
      userSelectedGoodsPrice,
      selectGoods,
      selectAllButtonStatus,
      selectAllGoods,
      deleteGoodsOfCartBySkuId,
      deleteGoodsOfCart,
      changeGoodsCountOfCartBySkuId,
    };
  },
};
</script>

<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-number-box {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      width: 100%;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
