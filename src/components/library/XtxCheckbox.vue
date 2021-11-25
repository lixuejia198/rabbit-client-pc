<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <!-- 如果插槽存在内容 -->
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>

<script>
// import { ref, watchEffect } from "vue";

import { useVModel } from "@vueuse/core";

export default {
  name: "XtxCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // 用于存储复选框是否选中的状态
    // const isChecked = ref(false);
    // useVModel 实现双向绑定 useVModel的返回值是一个新的响应式数据 可以在当前模板中直接使用
    const isChecked = useVModel(props, "modelValue", emit);
    // 更改复选框状态
    const toggle = () => {
      // 对当前复选框的值进行取反 就是让它变成当前值的反向值
      isChecked.value = !isChecked.value;
      // 监听内部值的变化 同步给外部值
      // emit("update:modelValue", isChecked.value);
    };
    // 监听外部值的变化 将其同步给内部值
    // watchEffect(() => {
    //   isChecked.value = props.modelValue;
    // });
    return { isChecked, toggle };
  },
};
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
