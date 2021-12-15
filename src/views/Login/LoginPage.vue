<template>
  <LoginHeader>欢迎登录</LoginHeader>
  <section class="login-section">
    <div class="wrapper">
      <nav>
        <a
          href="javascript:"
          @click="activeName = 'account'"
          :class="{ active: activeName === 'account' }"
        >
          账户登录
        </a>
        <a
          href="javascript:"
          @click="activeName = 'qrcode'"
          :class="{ active: activeName === 'qrcode' }"
        >
          扫码登录
        </a>
      </nav>
      <!-- 即将放置账号登录表单组件, 此处使用div先占个位 -->
      <LoginForm v-if="activeName === 'account'" />
      <!-- 二维码登录 -->
      <div class="qrcode-box" v-if="activeName === 'qrcode'">
        <img src="@/assets/images/qrcode.jpg" alt="" />
        <p>打开 <a href="javascript:">小兔鲜App</a> 扫码登录</p>
      </div>
    </div>
  </section>
  <LoginFooter />
  <button @click="showMessage">showMessage</button>
  <button @click="$message({ type: 'warn', text: '测试' })">button</button>
  <button @click="show">button</button>
  <button @click="test">button</button>
  <button @click="test2(this)">button</button>
</template>

<script>
import LoginHeader from "@/views/Login/components/LoginHeader";
import LoginFooter from "@/views/Login/components/LoginFooter";
import { getCurrentInstance, ref } from "vue";
import LoginForm from "@/views/Login/components/LoginForm";
import Message from "@/components/library/Message";
export default {
  name: "LoginPage",
  components: { LoginForm, LoginFooter, LoginHeader },
  setup() {
    // activeName用于实现账户登录和扫码登录两个面板的切换 默认是账户登录
    const activeName = ref("account");
    const showMessage = () => {
      Message({ type: "success", text: "登录成功" });
    };
    const { proxy } = getCurrentInstance();
    const test = () => {
      proxy.$message({ type: "success", text: "test" });
    };
    const test2 = (instance) => {
      instance.$message({ type: "warn", text: "test2" });
    };
    return { activeName, showMessage, test, test2 };
  },
  methods: {
    show() {
      this.$message({ type: "error", text: "测试" });
    },
  },
};
</script>

<style scoped lang="less">
.login-section {
  background: url(../../assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    .qrcode-box {
      text-align: center;
      padding-top: 40px;
      p {
        margin-top: 20px;
        a {
          color: @xtxColor;
          font-size: 16px;
        }
      }
    }
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
