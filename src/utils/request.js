// 1.创建一个新的axios实例 用于配置和小兔仙服务器端相关的请求配置
// 2.配置基准的请求地址
// 3.配置请求拦截器 看看本地是否存在token 如果存在 将它放在请求头中

import axios from "axios";
import store from "@/store";
import router from "@/router";

// 线上环境: https://apipc-xiaotuxian-front.itheima.net/
// 开发环境: http://pcapi-xiaotuxian-front-devtest.itheima.net/

const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
// 发送携带token的请求
const instanceWithToken = axios.create({ baseURL });
// 发送普通请求 不携带token
const instanceWithoutToken = axios.create({ baseURL });

// 请求拦截器
instanceWithToken.interceptors.request.use((config) => {
  // 当发送请求时 会先走当前的回调函数
  // 获取token
  const token = store.state.user.profile.token;
  // 判断token是否存在
  if (token) {
    // 将token放置在请求头对象中
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 不返回 相当于没修改
  return config;
});
// 响应拦截器
instanceWithToken.interceptors.response.use(
  // 服务器做出响应之后 先走当前回调函数 当前回调函数可以对响应结果进行处理 处理完成之后再给到请求的调用者
  (response) => {
    // 如果服务器返回的是表示成功的状态码 走这个回调函数
    return response.data;
  },
  (error) => {
    // 如果服务器返回的是表示失败的状态码 走这个回调函数
    // 未授权(状态码为401)
    if (error.response.status === 401) {
      // 跳转到登录页(用户未登录的情况下)
      router
        .push("/login")
        .then(() => {
          console.log("跳转成功");
        })
        .catch(() => {
          console.log("跳转失败");
        });
      // 清空用户信息(用户已登录 但token失效)
      store.commit("/user/setUser", {});
    }
    return Promise.reject(error);
  }
);
instanceWithoutToken.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// 用于生成请求配置的函数
function generateRequestConfig(url, method, data) {
  return {
    url: url,
    method: method,
    [method === "get" ? "params" : "data"]: data,
  };
}

// 用于发送携带token的请求的函数
export function requestWithToken(url, method, data) {
  return instanceWithToken(generateRequestConfig(url, method, data));
}
// 用于发送普通请求的函数(不携带token)
export function requestWithoutToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}
