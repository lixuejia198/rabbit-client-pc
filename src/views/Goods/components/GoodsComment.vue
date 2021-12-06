<template>
  <div class="goods-comment" v-if="commentInfo">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span>
          <span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:"
            v-for="item in commentInfo.tags"
            :key="item.title"
            :class="{ active: item.title === currentTagsTitle }"
            @click="
              currentTagsTitle = item.title;
              updateReqParams({ tag: item.title });
            "
          >
            {{ item.title }} ({{ item.tagCount }})
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:"
        :class="{ active: reqParams.sortField === '' }"
        @click="updateReqParams({ sortField: '' })"
        >默认</a
      >
      <a
        href="javascript:"
        :class="{ active: reqParams.sortField === 'createTime' }"
        @click="updateReqParams({ sortField: 'createTime' })"
        >最新</a
      >
      <a
        href="javascript:"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        @click="updateReqParams({ sortField: 'praiseCount' })"
        >最热</a
      >
    </div>
    <!-- 评论列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <!-- 此处由于 i 标记是通过两个 for 循环遍历生成的, 将索引作为 key 值, key 值重复 -->
            <i
              class="iconfont icon-wjx01"
              v-for="i in item.score"
              :key="i + 's'"
            ></i>
            <i
              class="iconfont icon-wjx02"
              v-for="i in 5 - item.score"
              :key="i + 'k'"
            ></i>
            <span class="attr">{{ formatAttrs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <GoodsCommentImage :pictures="item.pictures" />
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan">
              <i class="iconfont icon-dianzan"></i>
              {{ item.praiseCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <XtxPagination
      :pageSize="reqParams.pageSize"
      :counts="counts"
      v-model:page="reqParams.page"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { getCommentInfoApi, getCommentListApi } from "@/api/goods";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import GoodsCommentImage from "@/views/Goods/components/GoodsCommentImage";

export default {
  name: "GoodsComment",
  components: { GoodsCommentImage },
  setup() {
    const { commentInfo } = useCommentInfo();
    const {
      commentList,
      formatNickname,
      formatAttrs,
      updateReqParams,
      reqParams,
      counts,
    } = useCommentList();
    // 默认是让全部评价标签选中
    const currentTagsTitle = ref("全部评价");
    return {
      commentInfo,
      currentTagsTitle,
      commentList,
      formatNickname,
      formatAttrs,
      updateReqParams,
      reqParams,
      counts,
    };
  },
};
// 获取商品评价头部数据
function useCommentInfo() {
  // 获取路由信息对象
  const route = useRoute();
  // 用于存储商品评价信息
  const commentInfo = ref(null);
  // 用于获取商品评价信息的方法
  const getData = (id) => {
    // 向服务器端发送请求 获取商品评价信息数据
    getCommentInfoApi(id).then((data) => {
      // 每个商品的评论头部信息中都会包含 '全部评价' 和 '有图'
      // 但是接口数据中不包含, 所以需要手动添加
      data.result.tags.unshift(
        { title: "全部评价", tagCount: data.result.evaluateCount },
        { title: "有图", tagCount: data.result.hasPictureCount }
      );
      // 存储商品评价信息
      commentInfo.value = data.result;
    });
  };
  // 初始调用获取商品评价信息方法
  getData(route.params.id);
  // 当路由更新时 重新获取商品评价信息
  onBeforeRouteUpdate((to) => {
    getData(to.params.id);
  });
  return { commentInfo };
}
// 获取商品评论列表数据
function useCommentList() {
  // 用于存储商品评论列表数据
  const commentList = ref(null);
  // 获取路由信息对象
  const route = useRoute();
  // 参数对象
  const reqParams = ref({
    // 商品id
    id: route.params.id,
    // 当前页
    page: 1,
    // 每页显示的数据条数
    pageSize: 10,
    // 是否有图
    hasPicture: false,
    // 评价标签
    tag: "",
    // 排序字段
    sortField: "",
  });
  // 更新reqParams
  const updateReqParams = (target) => {
    // console.log(target);
    // 如果用户点击的是标签 要针对tag进行单独处理
    if (target.tag) {
      reqParams.value = {
        ...reqParams.value,
        hasPicture: target.tag === "有图",
        tag:
          target.tag === "全部评价" || target.tag === "有图" ? "" : target.tag,
      };
    } else {
      // 排序选项
      reqParams.value = { ...reqParams.value, ...target };
    }
    // 当筛选条件发生变化时 将当前页码重置为1
    reqParams.value.page = 1;
  };
  // 总数据条数
  const counts = ref(0);
  // 用于获取商品评论列表数据的方法
  const getData = () => {
    // 向服务器端发送请求 获取商品评论列表数据
    getCommentListApi(reqParams.value).then((data) => {
      // 设置总数据条数
      counts.value = data.result.counts;
      // 存储商品评论列表数据
      commentList.value = data.result;
    });
  };
  // 监听请求参数的变化
  watch(
    () => reqParams.value,
    () => {
      // 重新发送请求获取评价列表数据
      getData();
    },
    // 初始调用
    { immediate: true }
  );
  // 格式化商品属性
  const formatAttrs = (specs) => {
    return specs.map((spec) => `${spec.name}: ${spec.nameValue}`).join(" ");
  };
  // 格式化用户昵称
  const formatNickname = (nickname) => {
    return nickname.substr(0, 1) + "****" + nickname.substr(-1);
  };
  return {
    commentList,
    formatAttrs,
    formatNickname,
    reqParams,
    updateReqParams,
    counts,
  };
}
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
