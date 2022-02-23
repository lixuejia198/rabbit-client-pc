<template>
  <AppMemberLayout>
    <div class="member-order">
      <XtxTabs v-model:current="current">
        <XtxTabTitle v-for="item in tabsData" :key="item.title">
          {{ item.title }}
        </XtxTabTitle>
        <XtxTabTitle>测试标题三</XtxTabTitle>
        <XtxTabContent v-for="item in tabsData" :key="item.content">
          {{ item.content }}
        </XtxTabContent>
        <XtxTabContent>测试内容三</XtxTabContent>
      </XtxTabs>
    </div>
  </AppMemberLayout>
</template>

<script>
import AppMemberLayout from "@/components/AppMemberLayout";
import { ref } from "vue";
export default {
  name: "OrderListPage",
  components: { AppMemberLayout },
  setup() {
    // 订单标题索引
    const current = ref(0);
    // 测试代码
    const tabsData = ref([
      { title: "选项卡标题一", content: "选项卡内容一" },
      { title: "选项卡标题二", content: "选项卡内容二" },
    ]);
    return { current, tabsData };
  },
};
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
  position: relative;
}
</style>
