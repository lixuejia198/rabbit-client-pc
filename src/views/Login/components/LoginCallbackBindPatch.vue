<template>
  <form class="xtx-form" @submit="onSubmitHandler">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <input
          class="input"
          type="text"
          v-model="accountField"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error">{{ accountError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <input
          class="input"
          type="text"
          v-model="mobileField"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error">{{ mobileError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <input
          class="input"
          type="text"
          v-model="codeField"
          placeholder="请输入验证码"
        />
        <span class="code" @click="getMsgCode">
          {{ isActive ? `剩余${count}秒` : "发送验证码" }}
        </span>
      </div>
      <div class="error">{{ codeError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          class="input"
          type="password"
          v-model="passwordField"
          placeholder="请输入密码"
        />
      </div>
      <div class="error">{{ passwordError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          class="input"
          type="password"
          v-model="rePasswordField"
          placeholder="请确认密码"
        />
      </div>
      <div class="error">{{ rePasswordError }}</div>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import {
  checkUserAccount,
  mobile,
  code,
  password,
  rePassword,
} from "@/utils/vee-validate-schema";
import useCountDown from "@/hooks/useCountDown";
import { createNewAccountBindQQ, getRegisterMsgCode } from "@/api/user";
import Message from "@/components/library/Message";
import useLoginAfter from "@/hooks/useLoginAfter";

export default {
  name: "LoginCallbackBindPatch",
  props: ["unionId"],
  setup(props) {
    // 单独处理表单提交的方法 将其他属性放入单独的对象中
    const { getMobileIsValidate, handleSubmit, ...rest } =
      userBindNewAccountFormValid();
    const { loginSuccess, loginFail } = useLoginAfter();
    // 表单提交处理
    const onSubmitHandler = handleSubmit(
      ({ checkUserAccount, code, mobile, password }) => {
        // 向服务器端发送请求 实现注册新账户并绑定QQ号
        createNewAccountBindQQ({
          unionId: props.unionId,
          account: checkUserAccount,
          mobile: mobile,
          code: code,
          password: password,
        })
          // 登录成功
          .then(loginSuccess)
          // 登录失败
          .catch(loginFail);
      }
    );
    const { isActive, count, start } = useCountDown();
    // 获取手机验证码
    const getMsgCode = () => {
      // 如果正在倒计时 阻止程序向下运行
      if (isActive.value) return;
      // 验证手机号
      getMobileIsValidate()
        .then(({ isValid, mobile }) => {
          // 如果手机号验证通过
          if (isValid) {
            // 向服务端发送请求 获取验证码
            return getRegisterMsgCode(mobile);
          }
        })
        .then(() => {
          // 提示用户
          Message({ type: "success", text: "验证码发送成功" });
          // 开启倒计时
          start(60);
        })
        .catch(() => {
          // 提示用户
          Message({ type: "error", text: "验证码发送失败" });
        });
    };
    return { ...rest, onSubmitHandler, getMsgCode, count, isActive };
  },
};
function userBindNewAccountFormValid() {
  // 创建表单验证对象
  const { handleSubmit } = useForm({
    validationSchema: { checkUserAccount, mobile, code, password, rePassword },
  });
  // 创建用于验证用户名的表单验证对象
  const { value: accountField, errorMessage: accountError } =
    useField("checkUserAccount");
  // 创建用于验证手机号的表单验证对象
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate,
  } = useField("mobile");
  // 单独验证手机号
  const getMobileIsValidate = async () => {
    // 验证用户输入的手机号格式是否正确
    let { valid } = await validate();
    // 将验证结果和手机号返回出去
    return { isValid: valid, mobile: mobileField.value };
  };
  // 创建用于验证手机验证码的表单验证对象
  const { value: codeField, errorMessage: codeError } = useField("code");
  // 创建用于验证密码的表单验证对象
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");
  // 创建用于验证两次密码是否输入一致的表单验证对象
  const { value: rePasswordField, errorMessage: rePasswordError } =
    useField("rePassword");

  return {
    handleSubmit,
    accountField,
    accountError,
    mobileField,
    mobileError,
    codeField,
    codeError,
    passwordField,
    passwordError,
    rePasswordField,
    rePasswordError,
    getMobileIsValidate,
  };
}
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
