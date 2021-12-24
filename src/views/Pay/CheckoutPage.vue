<template>
  <AppLayout>
    <div class="xtx-pay-checkout-page" v-if="orderInfo">
      <div class="container">
        <XtxBread>
          <XtxBreadItem path="/">首页</XtxBreadItem>
          <XtxBreadItem path="/cart">购物车</XtxBreadItem>
          <XtxBreadItem>填写订单</XtxBreadItem>
        </XtxBread>
        <div class="wrapper">
          <!-- 收货地址 -->
          <h3 class="box-title">收货地址</h3>
          <div class="box-body">
            <CheckoutAddress ref="checkoutAddressInstance" />
          </div>
          <!-- 商品信息 -->
          <h3 class="box-title">商品信息</h3>
          <div class="box-body">
            <table class="goods">
              <thead>
                <tr>
                  <th>商品信息</th>
                  <th>单价</th>
                  <th>数量</th>
                  <th>小计</th>
                  <th>实付</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="goods in orderInfo.goods" :key="goods.id">
                  <td>
                    <a href="javascript:" class="info">
                      <img :src="goods.picture" alt="" />
                      <div class="right">
                        <p>{{ goods.name }}</p>
                        <p>{{ goods.attrsText }}</p>
                      </div>
                    </a>
                  </td>
                  <td>&yen;{{ goods.price }}</td>
                  <td>{{ goods.count }}</td>
                  <td>&yen;{{ goods.totalPrice }}</td>
                  <td>&yen;{{ goods.totalPayPrice }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 配送时间 -->
          <h3 class="box-title">配送时间</h3>
          <div class="box-body">
            <a class="my-btn active" href="javascript:"
              >不限送货时间：周一至周日</a
            >
            <a class="my-btn" href="javascript:">工作日送货：周一至周五</a>
            <a class="my-btn" href="javascript:"
              >双休日、假日送货：周六至周日</a
            >
          </div>
          <!-- 支付方式 -->
          <h3 class="box-title">支付方式</h3>
          <div class="box-body">
            <a class="my-btn active" href="javascript:">在线支付</a>
            <a class="my-btn" href="javascript:">货到付款</a>
            <span style="color: #999">货到付款需付5元手续费</span>
          </div>
          <!-- 金额明细 -->
          <h3 class="box-title">金额明细</h3>
          <div class="box-body">
            <div class="total">
              <dl>
                <dt>商品件数：</dt>
                <dd>{{ orderInfo.summary.goodsCount }}件</dd>
              </dl>
              <dl>
                <dt>商品总价：</dt>
                <dd>¥{{ orderInfo.summary.totalPrice }}</dd>
              </dl>
              <dl>
                <dt>运<i></i>费：</dt>
                <dd>¥{{ orderInfo.summary.postFee }}</dd>
              </dl>
              <dl>
                <dt>应付总额：</dt>
                <dd class="price">¥{{ orderInfo.summary.totalPayPrice }}</dd>
              </dl>
            </div>
          </div>
          <!-- 提交订单 -->
          <div class="submit">
            <XtxButton type="primary" @click="saveOrder">提交订单</XtxButton>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import { createOrder, submitOrder } from "@/api/order";
import { ref } from "vue";
import CheckoutAddress from "@/views/Pay/components/CheckoutAddress";
import Message from "@/components/library/Message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  name: "CheckoutPage",
  components: { CheckoutAddress, AppLayout },
  setup() {
    // 获取订单信息
    const { orderInfo } = getOrderInfo();
    // 收货地址组件实例对象
    const checkoutAddressInstance = ref();
    // 获取路由对象
    const router = useRouter();
    // 获取store对象
    const store = useStore();
    // 当用户点击提交订单按钮的时候执行
    const saveOrder = () => {
      // 收集订单信息
      const order = {
        // 订单商品集合
        goods: orderInfo.value.goods.map((item) => ({
          skuId: item.skuId,
          count: item.count,
        })),
        // 收货地址id
        addressId: checkoutAddressInstance.value.finalAddress?.id,
        // 配送时间 1不限
        deliveryTimeType: 1,
        // 支付方式 1支付宝
        payType: 1,
        // 支付渠道 支付宝
        payChannel: 1,
        // 买家留言
        buyerMessage: "",
      };
      // 判断收货地址id是否存在
      if (!order.addressId) {
        // 提示用户
        return Message({ type: "error", text: "请添加收货地址" });
      }
      // 向服务器发送请求 提交订单
      submitOrder(order)
        .then((data) => {
          console.log(data, "data");
          // 订单提交成功以后要做什么？
          // 1.跳转到支付页面 将订单id作为路由参数
          router.push({
            path: "/checkout/pay",
            query: {
              orderId: data.result.id,
            },
          });
          // 2.将服务器端购物车中的商品同步到客户端
          store.dispatch("cart/updateCartList");
        })
        .catch(() => {
          Message({ type: "error", text: "订单提交失败" });
        });
    };
    return { orderInfo, checkoutAddressInstance, saveOrder };
  },
};
function getOrderInfo() {
  // 用于存储订单信息
  const orderInfo = ref(null);
  // 发送请求 获取订单信息 并将订单信息存储
  createOrder().then((data) => (orderInfo.value = data.result));
  // 返回订单信息
  return { orderInfo };
}
</script>

<style scoped lang="less">
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: @xtxColor;
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
