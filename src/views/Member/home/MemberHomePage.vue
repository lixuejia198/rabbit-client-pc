<template>
  <AppMemberLayout>
    <div class="member-home">
      <MemberHomeOverview />
      <MemberHomePanel title="我的收藏" v-if="collection">
        <GoodsItem
          v-for="goods in collection.items"
          :key="goods.id"
          :goods="goods"
        />
      </MemberHomePanel>
      <MemberHomePanel title="我的足迹"></MemberHomePanel>
      <GoodsRelevant />
    </div>
  </AppMemberLayout>
</template>

<script>
import AppMemberLayout from "@/components/AppMemberLayout";
import MemberHomeOverview from "@/views/Member/home/components/MemberHomeOverview";
import MemberHomePanel from "@/views/Member/home/components/MemberHomePanel";
import GoodsRelevant from "@/views/Goods/components/GoodsRelevant";
import { ref } from "vue";
import { getCollection } from "@/api/member";
import GoodsItem from "@/views/Category/components/GoodsItem";
export default {
  name: "MemberHomePage",
  components: {
    GoodsItem,
    GoodsRelevant,
    MemberHomePanel,
    MemberHomeOverview,
    AppMemberLayout,
  },
  setup() {
    // 获取收藏数据
    const collection = useCollection();
    return { collection };
  },
};
function useCollection() {
  // 用于存储收藏数据
  const collection = ref(null);
  // 向服务器端发送请求 获取收藏数据
  getCollection({ pageSize: 4 }).then((data) => {
    // 存储收藏数据
    collection.value = data.result;
  });
  // 返回收藏数据
  return collection;
}
</script>

<style scoped lang="less">
.member-home {
  :deep(.xtx-carousel) .carousel-btn.prev {
    left: 5px;
  }
  :deep(.xtx-carousel) .carousel-btn.next {
    right: 5px;
  }
}
</style>
