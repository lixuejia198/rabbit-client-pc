<template>
  <XtxDialog title="更换收货地址" v-model:visible="visible">
    <template v-slot:default>
      <div class="address-switch">
        <div
          class="text item"
          @click="onAddressSwitchHandler(item.id)"
          v-for="item in list"
          :key="item.id"
          :class="{ active: item.id === activeAddressId }"
        >
          <ul>
            <li>
              <span>收<i />货<i />人：</span>{{ item.receiver }}
            </li>
            <li><span>联系方式：</span>{{ item.contact }}</li>
            <li>
              <span>收货地址：</span>{{ item.fullLocation + item.address }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <XtxButton
        @click="visible = false"
        type="primary"
        style="margin-right: 20px"
      >
        取消
      </XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AddressSwitch",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    activeAddressId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    // 用于控制对话框是否显示
    const visible = ref(false);
    const onAddressSwitchHandler = (id) => {
      // 通过自定义事件将用户选择的收货地址ID传递到父组件
      // 父组件会根据收货地址ID查找收货地址并优先渲染用户选择的收货地址
      emit("onAddressChanged", id);
      // 隐藏对话框
      visible.value = false;
    };
    return { visible, onAddressSwitchHandler };
  },
};
</script>

<style scoped lang="less">
.address-switch {
  height: 478px;
  overflow-y: auto;
}
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
</style>
