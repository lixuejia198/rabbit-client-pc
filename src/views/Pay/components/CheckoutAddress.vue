<template>
  <div class="address">
    <div class="text">
      <div class="none" v-if="!finalAddress">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="finalAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ finalAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span>
          {{ finalAddress.contact.replace(/(\d{3})\d{4}(\d{4})/g, `$1****$2`) }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ finalAddress.fullLocation }}{{ finalAddress.address }}
        </li>
      </ul>
      <a href="javascript:" @click="modifyAddress">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="switchAddress">切换地址</XtxButton>
      <AddressSwitch
        ref="addressSwitchInstance"
        :list="addresses"
        @onAddressChanged="updateUserSelectedAddress"
        :activeAddressId="finalAddress?.id"
      />
      <XtxButton class="btn" @click="addAddress">添加地址</XtxButton>
      <AddressEdit
        ref="addressEditInstance"
        @onAddressChanged="updateUserSelectedAddress"
      />
    </div>
  </div>
</template>

<script>
import AddressEdit from "@/views/Pay/components/AddressEdit";
import { computed, ref } from "vue";
import { getAddressList } from "@/api/order";
import AddressSwitch from "@/views/Pay/components/AddressSwitch";
export default {
  name: "CheckoutAddress",
  components: { AddressSwitch, AddressEdit },
  setup() {
    // 用于存储编辑收货地址组件实例对象
    const addressEditInstance = ref();
    // 用于存储切换收货地址组件实例对象
    const addressSwitchInstance = ref();
    // 添加收货地址
    const addAddress = () => {
      // 显示对话框
      addressEditInstance.value.visible = true;
      // 收货地址参数的初始状态
      addressEditInstance.value.address = {
        receiver: "",
        contact: "",
        provinceCode: "",
        cityCode: "",
        address: "",
        postalCode: "",
        addressTags: "",
        isDefault: false,
      };
    };
    const { addresses, finalAddress, updateUserSelectedAddress } =
      useAddressList();
    // 修改收货地址
    const modifyAddress = () => {
      // 显示对话框
      addressEditInstance.value.visible = true;
      const { fullLocation, isDefault, ...rest } = finalAddress.value;
      // 将现有的收货地址渲染到对话框内
      addressEditInstance.value.address = {
        ...rest,
        isDefault: isDefault === 0,
      };
      setTimeout(() => {
        addressEditInstance.value.xtxCityInstance.location = fullLocation;
      }, 0);
    };
    // 切换收货地址
    const switchAddress = () => {
      // 显示对话框
      addressSwitchInstance.value.visible = true;
    };
    return {
      addressEditInstance,
      addAddress,
      addresses,
      finalAddress,
      updateUserSelectedAddress,
      modifyAddress,
      addressSwitchInstance,
      switchAddress,
    };
  },
};
// 获取收货地址列表
function useAddressList() {
  // 用于存储收货地址列表
  const addresses = ref(null);
  // 用于存储用户新增的收货地址或者切换的收货地址
  const userSelectedAddress = ref();
  // 计算最终能够渲染到页面中的收货地址
  const finalAddress = computed(() => {
    let result = null;
    // 如果用户添加了新的收货地址或者切换了收货地址
    if (userSelectedAddress.value) {
      // 优先渲染
      result = userSelectedAddress.value;
    } else {
      // 查看收货地址列表中是否存在收货地址
      if (addresses.value && addresses.value.length > 0) {
        // 渲染默认收货地址
        result = addresses.value.find((item) => item.isDefault === 0);
        // 如果默认收货地址不存在
        if (!result) {
          // 渲染收货地址列表中的第一条收货地址
          result = addresses.value[0];
        }
      }
    }
    return result;
  });
  // 用于获取收货地址列表
  const getData = (callback) => {
    // 发送请求 获取收货地址列表
    getAddressList().then((data) => {
      // 存储收货地址列表
      addresses.value = data.result;
      // 在调用getData方法的时候 如果传递了callback 就调用callback并传递最新的收货地址列表
      callback && callback(data.result);
    });
  };
  // 初始获取收货地址列表
  getData();
  // 用于更新用户添加的收货地址或者切换的收货地址
  // 用户更改了收货地址
  // 重新向服务器端发送请求 获取新的收货地址列表
  // 从新的收货地址列表中查找用户新添加的收货地址
  // 将用户新添加的收货地址赋值给 userSelectedAddress
  const updateUserSelectedAddress = (id) => {
    getData((list) => {
      userSelectedAddress.value = list.find((list) => list.id === id);
    });
  };
  // 返回收货地址列表
  return { addresses, finalAddress, updateUserSelectedAddress };
}
</script>

<style scoped lang="less">
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
</style>
