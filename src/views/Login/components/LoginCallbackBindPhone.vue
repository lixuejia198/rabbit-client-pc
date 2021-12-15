<template>
  <form class="xtx-form" @submit="onSubmitHandler">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <input
          class="input"
          type="text"
          v-model="mobileField"
          placeholder="绑定的手机号"
        />
      </div>
      <div class="error" v-if="mobileError">{{ mobileError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <input
          class="input"
          type="text"
          v-model="codeField"
          placeholder="短信验证码"
        />
        <span class="code" @click="getMsgCode">
          {{ isActive ? `剩余${count}秒` : "发送验证码" }}
        </span>
      </div>
      <div class="error" v-if="codeError">{{ codeError }}</div>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<script>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { mobile, code } from "@/utils/vee-validate-schema";
import useCountDown from "@/hooks/useCountDown";
import { bindMobileAndQQ, getBindMobileMsgCode } from "@/api/user";
import Message from "@/components/library/Message";
import useLoginAfter from "@/hooks/useLoginAfter";

export default {
  name: "LoginCallbackBindPhone",
  setup(props) {
    // 获取QQ用户昵称和头像
    const { nickname, avatar } = useQQUserInfo();
    const { start, count, isActive } = useCountDown();
    const { loginSuccess, loginFail } = useLoginAfter();
    // 获取和表单验证相关的内容
    const { handleSubmit, getMobileIsValidate, ...bindPhoneSubmit } =
      useBindPhoneFormValid();
    // 表单提交
    const onSubmitHandler = handleSubmit((value) => {
      // 将手机号和QQ号进行绑定
      // 绑定成功即登录成功
      bindMobileAndQQ({ ...value, unionId: props.unionId })
        .then(loginSuccess)
        .catch(loginFail);
    });
    // 获取手机验证码
    const getMsgCode = async () => {
      // 1.看看用户有没有输入手机号
      let { isValid, mobile } = await getMobileIsValidate();
      // 用户输入了手机号 验证通过
      if (isValid && !isActive.value) {
        try {
          // 2.发送请求获取验证码
          await getBindMobileMsgCode(mobile);
          // 提示信息
          Message({ type: "success", text: "验证码发送成功" });
          // 3.开启倒计时
          start(60);
        } catch (error) {
          // 提示信息
          Message({ type: "error", text: "验证码发送失败" });
        }
      }
    };
    return {
      nickname,
      avatar,
      onSubmitHandler,
      getMsgCode,
      ...bindPhoneSubmit,
      count,
      isActive,
    };
  },
};
// 获取QQ用户昵称和头像
function useQQUserInfo() {
  // 获取QQ互联对象
  const QC = window.QC;
  // 用于存储QQ用户昵称
  const nickname = ref("");
  // 用于存储QQ用户头像
  const avatar = ref("");
  // 检测地址栏中是否存在access_token 因为接下来的操作要基于access_token
  if (QC.Login.check()) {
    QC.api("get_user_info").success((response) => {
      // console.log(response);
      // 存储QQ用户昵称
      nickname.value = response.data.nickname;
      // 存储QQ用户头像
      avatar.value = response.data.figureurl_1;
    });
  }
  // 返回QQ用户昵称和头像
  return { nickname, avatar };
}
// 表单验证
function useBindPhoneFormValid() {
  // 创建表单验证对象
  const { handleSubmit } = useForm({
    validationSchema: { mobile, code },
  });
  // 手机号验证
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate,
  } = useField("mobile");
  // 验证码验证
  const { value: codeField, errorMessage: codeError } = useField("code");
  // 单独验证手机号
  const getMobileIsValidate = async () => {
    // 验证手机号
    const { valid } = await validate();
    // 返回验证结果
    return { isValid: valid, mobile: mobileField.value };
  };
  return {
    handleSubmit,
    mobileField,
    mobileError,
    codeField,
    codeError,
    getMobileIsValidate,
  };
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin: 0 auto 20px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
