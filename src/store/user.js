export default {
  // 使用具有命名空间的vuex模块
  namespaced: true,
  state() {
    return {
      //  用户信息
      profile: {
        // 用户id
        id: "",
        // 用户头像
        avatar: "",
        // 用户昵称
        nickname: "",
        // 用户账号
        account: "",
        // 用户手机号
        mobile: "",
        // 用户登录凭证
        token: "",
      },
    };
  },
  mutations: {
    /**
     * 设置用户信息
     * @param state 状态对象
     * @param user 用户信息
     */
    setUser(state, user) {
      // 判断user对象是否是空对象
      if (Object.keys(user).length > 0) {
        // 不是空对象的话 进行用户信息的修改
        state.profile = { ...state.profile, ...user };
      } else {
        // 是空对象 进行用户信息的删除
        state.profile = {};
      }
    },
  },
};
