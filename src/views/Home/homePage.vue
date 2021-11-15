<template>
  <AppLayout>
    <div class="container">
      <HomeCategory />
      <HomeBanner />
      <HomeNew />
      <HomeHot />
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import HomeCategory from "@/views/Home/components/HomeCategory";
import HomeBanner from "@/views/Home/components/HomeBanner";
import HomeNew from "@/views/Home/components/HomeNew";
import HomeHot from "@/views/Home/components/HomeHot";
export default {
  name: "homePage",
  components: { HomeHot, HomeNew, HomeBanner, HomeCategory, AppLayout },
};
</script>

<style scoped></style>
