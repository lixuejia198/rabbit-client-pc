import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Message from "@/components/library/Message";

export default function useLoginAfter() {
  // 获取store对象
  const store = useStore();
  // 获取路由对象
  const router = useRouter();
  // 获取路由信息对象
  const route = useRouter();
  // 登录成功的回调处理函数
  const loginSuccess = async (data) => {
    // console.log(data);
    // 1.存储用户信息
    store.commit("user/setUser", {
      // 用户id
      id: data.result.id,
      // 用户头像
      avatar: data.result.avatar,
      // 用户昵称
      nickname: data.result.nickname,
      // 用户账号
      account: data.result.account,
      // 用户手机号
      mobile: data.result.mobile,
      // 用户登录凭证
      token: data.result.token,
    });
    // 2.跳转到首页
    router.push("/").catch();
    // 3.登录成功的提示
    Message({ type: "success", text: "登录成功" });
    // 合并购物车
    await store.dispatch("cart/mergeCart");
    // 将服务器端购物车数据同步到本地
    await store.dispatch("cart/updateCartList");
    // 跳转目标地址
    const redirectURL = route.query.redirectURL;
    // 跳转到目标页或者首页
    router.push(redirectURL || "/").then(() => {});
  };
  // 登录失败的回调处理函数
  const loginFail = () => {
    Message({ type: "error", text: "登录失败" });
  };

  return { loginSuccess, loginFail };
}
