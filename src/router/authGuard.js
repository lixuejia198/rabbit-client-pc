import store from "@/store";

export default function authGuard(to, from, next) {
  // 指明需要登录的路由地址
  const requiredLogin = ["checkout", "member"];
  // 将用户访问的路由地址的开始字符串匹配出来
  // 如果用户访问的页面是需要登录的
  if (requiredLogin.includes(to.path.split("/")[1])) {
    // 如果用户没有登录
    if (!store.state.user.profile.token) {
      next({ path: "/login", query: { redirectURL: to.fullPath } });
    } else {
      // 如果用户登录了
      next();
    }
  } else {
    // 用户访问的页面是不需要登录的
    next();
  }
}
