import { getCategoriesApi } from "@/api/category";
import { topCategories } from "@/api/contants";

export default {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  state() {
    return {
      // 存储分类列表 将topCategories[]用map方法改造成topCategories[{name:""}]
      list: topCategories.map((name) => ({ name })),
    };
  },
  mutations: {
    // 设置分类数据
    setCategories(state, payload) {
      state.list = payload;
    },
    open(state, id) {
      const target = state.list.find((item) => item.id === id);
      target.open = true;
    },
    close(state, id) {
      const target = state.list.find((item) => item.id === id);
      target.open = false;
    },
  },
  actions: {
    getCategories({ commit }) {
      // 获取分类列表数据
      getCategoriesApi().then((data) => {
        // console.log(data, "data");
        data.result.forEach((item) => (item.open = false));
        commit("setCategories", data.result);
      });
    },
  },
};
