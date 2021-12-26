<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 加载提示 -->
  <section class="container" v-if="loading">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-if="!loading && !isBind">
    <nav class="tab">
      <a
        :class="{ active: hasAccount }"
        href="javascript:"
        @click="hasAccount = true"
      >
        <i class="iconfont icon-bind"></i>
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        :class="{ active: !hasAccount }"
        href="javascript:"
        @click="hasAccount = false"
      >
        <i class="iconfont icon-edit"></i>
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <LoginCallbackBindPhone :unionId="unionId" />
    </div>
    <div class="tab-content" v-if="!hasAccount">
      <LoginCallbackBindPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import LoginHeader from "@/views/Login/components/LoginHeader";
import LoginFooter from "@/views/Login/components/LoginFooter";
import LoginCallbackBindPhone from "@/views/Login/components/LoginCallbackBindPhone";
import LoginCallbackBindPatch from "@/views/Login/components/LoginCallbackBindPatch";
import { ref } from "vue";
import { findAccountByQQOpenid } from "@/api/user";
import useLoginAfter from "@/hooks/useLoginAfter";
export default {
  name: "LoginCallbackPage",
  components: {
    LoginCallbackBindPatch,
    LoginCallbackBindPhone,
    LoginFooter,
    LoginHeader,
  },
  setup() {
    // 用于实现绑定手机号和完善用户信息两个组件的切换效果 默认是显示实现绑定手机号
    const hasAccount = ref(true);
    // 用于存储QQ用户的唯一标识
    const unionId = ref(null);
    const { loginSuccess } = useLoginAfter();
    // 先假设该用户已经使用QQ绑定了账号
    const isBind = ref(false);
    const loading = ref(false);
    // 获取QQ联合中和登录相关的API
    const Login = window.QC.Login;
    // 检测地址栏中的 access_token值
    if (Login.check()) {
      // 1.获取地址栏中的 access_token值
      // 2.向QQ互联服务器发送请求使用 access_token 换取用户的唯一标识 openid
      Login.getMe((openid) => {
        // 存储用户唯一标识
        unionId.value = openid;
        // 检测QQ绑定账户
        findAccountByQQOpenid({ unionId: openid })
          // 检测到账号 走then回调函数 执行登录成功之后的逻辑
          .then((data) => {
            // 更新加载状态
            loading.value = false;
            // 更新绑定状态
            isBind.value = true;
            loginSuccess(data);
          })
          // 没有检测到账号 走catch回调函数
          .catch(() => {
            // 更新加载状态
            loading.value = false;
            // 更新绑定状态
            isBind.value = false;
          });
      });
    }
    return { hasAccount, isBind, loading, unionId };
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
