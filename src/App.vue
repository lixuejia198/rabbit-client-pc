<template>
  <!--  <button @click="onClickHandle" class="box">button</button>-->
  <router-view />
</template>

<script>
// import { requestWithoutToken } from "@/utils/request";
export default {
  name: "App",
  setup() {
    // const onClickHandle = () => {
    //   requestWithoutToken("/home/banner", "get", { distributionSite: 1 }).then(
    //     (data) => {
    //       console.log(data);
    //     }
    //   );
    // };
    // return {
    //   onClickHandle,
    // };
  },
};
</script>

<style lang="less">
//.box {
//  color: @warnColor;
//}
</style>
