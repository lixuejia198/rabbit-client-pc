// 用于验证用户名的方法
export function account(value) {
  if (!value) return "请输入用户名";
  if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符";
  return true;
}
// 用于验证密码的方法
export function password(value) {
  if (!value) return "请输入密码";
  if (!/^\w{6,24}$/.test(value)) return "密码是6-24个字符";
  return true;
}
// 用于验证手机号的方法
export function mobile(value) {
  if (!value) return "请输入手机号";
  if (!/^1[3-9]\d{9}$/.test(value)) return "手机号格式错误";
  return true;
}
// 用于验证验证码的方法
export function code(value) {
  if (!value) return "请输入验证码";
  if (!/^\d{6}$/.test(value)) return "验证码是6个数字";
  return true;
}
// 用于验证是否同意协议的方法
export function isAgree(value) {
  if (!value) return "请勾选同意用户协议";
  return true;
}
