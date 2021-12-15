<template>
  <div class="account-box">
    <div class="toggle">
      <button @click="isMsgLogin = false" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </button>
      <button @click="isMsgLogin = true" v-if="!isMsgLogin">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </button>
    </div>
    <div class="form">
      <!-- 账户登录 -->
      <template v-if="!isMsgLogin">
        <form @submit="onAccountFormSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                type="text"
                placeholder="请输入用户名"
                v-model="accountField"
              />
            </div>
            <div class="error" v-if="accountError">
              <i class="iconfont icon-warning"></i>
              {{ accountError }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <input
                type="password"
                placeholder="请输入密码"
                v-model="passwordField"
              />
            </div>
            <div class="error" v-if="passwordError">
              <i class="iconfont icon-warning"></i>
              {{ passwordError }}
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="accountIsAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="accountIsAgreeError">
              <i class="iconfont icon-warning"></i>
              {{ accountIsAgreeError }}
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
      <!-- 短信登录 -->
      <template v-if="isMsgLogin">
        <form @submit="onMobileFormSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                type="text"
                placeholder="请输入手机号"
                v-model="mobileField"
              />
            </div>
            <div class="error" v-if="mobileError">
              <i class="iconfont icon-warning"></i>
              {{ mobileError }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <input
                type="password"
                placeholder="请输入验证码"
                v-model="codeField"
              />
              <span class="code" @click="getMsgCode">
                {{ isActive ? `剩余${count}秒` : "发送验证码" }}
              </span>
            </div>
            <div class="error" v-if="codeError">
              <i class="iconfont icon-warning"></i>
              {{ codeError }}
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="mobileIsAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="mobileIsAgreeError">
              <i class="iconfont icon-warning"></i>
              {{ mobileIsAgreeError }}
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
    </div>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <div class="url">
        <a href="javascript:">忘记密码</a>
        <a href="javascript:">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import {
  account,
  password,
  isAgree,
  mobile,
  code,
} from "@/utils/vee-validate-schema";
import {
  getLoginMsgCode,
  loginByAccountAndPassword,
  loginByMobileMsgCode,
} from "@/api/user";
import Message from "@/components/library/Message";
import useCountDown from "@/hooks/useCountDown";
import useLoginAfter from "@/hooks/useLoginAfter";
export default {
  name: "LoginForm",
  setup() {
    // isMsgLogin用于实现使用账号登录和使用短信登录两个面板的切换 默认是使用账号登录
    const isMsgLogin = ref(false);
    const { loginSuccess, loginFail } = useLoginAfter();
    // accountFormHandleSubmit：处理账号登录表单提交
    // accountFormValid 包含其他验证字段
    const { accountFormHandleSubmit, ...accountFormValid } =
      useAccountFormValidate();
    // 处理账号登录表单提交 当表单发生提交行为时 方法内部会做整体表单验证
    // 只有表单验证通过以后 指定的回调函数才会执行 回调函数的参数是用户在表单中输入的内容
    const onAccountFormSubmit = accountFormHandleSubmit(
      ({ account, password }) => {
        // 发送请求进行用户名密码登录
        loginByAccountAndPassword({ account, password })
          // 登录成功
          .then(loginSuccess)
          // 登录失败
          .catch(loginFail);
      }
    );
    // mobileFormHandleSubmit 处理短信登录表单提交 mobileFormValid 包含其他验证字段
    const { getMobileIsValidate, mobileFormHandleSubmit, ...mobileFormValid } =
      useMobileFormValidate();
    const { count, start, isActive } = useCountDown();
    // 获取验证码
    const getMsgCode = async () => {
      // 对手机号进行验证
      let { isValid, mobile } = await getMobileIsValidate();
      // 如果用户输入了手机号 并且定时器没有正在执行
      if (isValid && !isActive.value) {
        try {
          // 发送请求获取手机验证码
          await getLoginMsgCode(mobile);
          // 验证码发动成功提示
          Message({ type: "success", text: "验证码发送成功" });
          // 验证码发送成功后开启定时器 进行倒计时
          start(60);
        } catch (error) {
          // 验证码发送失败提示
          Message({ type: "error", text: error.response.data.message });
        }
      }
    };
    // 处理手机号短信登录表单提交
    const onMobileFormSubmit = mobileFormHandleSubmit(({ mobile, code }) => {
      // 发送请求进行手机号短信登录
      loginByMobileMsgCode({ mobile, code })
        // 登录成功
        .then(loginSuccess)
        // 登录失败
        .catch(loginFail);
    });
    return {
      isMsgLogin,
      onAccountFormSubmit,
      ...accountFormValid,
      onMobileFormSubmit,
      ...mobileFormValid,
      getMsgCode,
      count,
      isActive,
    };
  },
};
// 账号登录表单验证
function useAccountFormValidate() {
  //  创建表单验证对象
  const { handleSubmit: accountFormHandleSubmit } = useForm({
    // 指定表单中包含的验证规则 只有以下规则都验证通过了表单才可以提交
    validationSchema: {
      account,
      password,
      isAgree,
    },
  });
  // 验证用户名
  const { value: accountField, errorMessage: accountError } =
    useField("account");
  // 验证密码
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");
  // 验证是否同意协议
  const { value: accountIsAgreeField, errorMessage: accountIsAgreeError } =
    useField("isAgree");
  return {
    accountFormHandleSubmit,
    accountField,
    accountError,
    passwordField,
    passwordError,
    accountIsAgreeField,
    accountIsAgreeError,
  };
}
// 短信登录表单验证
function useMobileFormValidate() {
  // 创建表单验证对象
  const { handleSubmit: mobileFormHandleSubmit } = useForm({
    // 指定表单中包含的验证规则 只有以下规则都验证通过了表单才可以提交
    validationSchema: {
      mobile,
      code,
      isAgree,
    },
  });
  // 验证手机号
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate: mobileValidate,
  } = useField("mobile");
  // 验证验证码
  const { value: codeField, errorMessage: codeError } = useField("code");
  // 验证是否同意协议
  const { value: mobileIsAgreeField, errorMessage: mobileIsAgreeError } =
    useField("isAgree");
  // 获取手机号是否验证通过
  const getMobileIsValidate = async () => {
    // 验证手机号 获取验证结果
    let { valid } = await mobileValidate();
    // 返回验证结果
    return { isValid: valid, mobile: mobileField.value };
  };
  return {
    mobileFormHandleSubmit,
    mobileField,
    mobileError,
    codeField,
    codeError,
    mobileIsAgreeField,
    mobileIsAgreeError,
    getMobileIsValidate,
  };
}
</script>

<style lang="less" scoped>
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    button {
      color: @xtxColor;
      background: none;
      border: none;
      cursor: pointer;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
        .code.disabled {
          cursor: wait;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      border: none;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
