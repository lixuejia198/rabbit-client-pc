<template>
  <div class="home-category" @mouseleave="current = null">
    <ul class="menu">
      <li
        v-for="item in list"
        :key="item.id"
        @mouseenter="current = item"
        :class="{ active: current?.id && item.id === current.id }"
      >
        <RouterLink to="/">{{ item.name }}</RouterLink>
        <template v-if="item.children?.length">
          <RouterLink to="/" v-for="child in item.children" :key="child.id">
            {{ child.name }}
          </RouterLink>
        </template>
        <template v-else>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
            style="margin-right: 5px"
          ></XtxSkeleton>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
          ></XtxSkeleton>
        </template>
      </li>
    </ul>
    <div class="layer">
      <h4 v-if="current">
        {{ current.goods ? "商品" : "品牌" }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul v-if="current">
        <li v-for="item in current.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul v-if="current">
        <li class="brand" v-for="item in current.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { getBrandApi } from "@/api/home";

export default {
  name: "HomeCategory",
  setup() {
    const store = useStore();
    const brand = ref({
      id: "brand",
      name: "品牌",
      children: [{ name: "推荐品牌", id: "child-brand" }],
      // 品牌数据列表
      brands: [],
    });
    // 获取品牌数据
    getBrandApi(6).then((data) => {
      // 存储品牌数据
      brand.value.brands = data.result;
    });
    const list = computed(() => {
      const result = store.state.category.list.map((item) => ({
        ...item,
        children: item.children ? item.children.slice(0, 2) : null,
      }));
      result.push(brand.value);
      return result;
    });
    // 用于存储当前用户鼠标移入的左侧一级分类
    const current = ref(null);
    return {
      list,
      current,
    };
  },
};
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background-color: @xtxColor;
      }
      & a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
