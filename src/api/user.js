import { requestWithoutToken } from "@/utils/request";

/**
 * 账号密码登录
 * @param account 用户名
 * @param password 密码
 * @returns {Promise}
 */
export function loginByAccountAndPassword({ account, password }) {
  return requestWithoutToken("/login", "post", { account, password });
}

/**
 * 获取验证码(手机号登录)
 * @param mobile 手机号
 * @returns {Promise}
 */
export function getLoginMsgCode(mobile) {
  return requestWithoutToken("/login/code", "get", { mobile });
}

/**
 * 手机号登录
 * @param mobile 手机号
 * @param code 验证码
 * @returns {Promise}
 */
export function loginByMobileMsgCode({ mobile, code }) {
  return requestWithoutToken("/login/code", "post", { mobile, code });
}

/**
 * 在小兔仙应用中检索绑定该QQ号的账号
 * @param unionId QQ用户唯一标识
 * @param source 注册来源
 * @returns {Promise}
 */
export function findAccountByQQOpenid({ unionId, source = 1 }) {
  return requestWithoutToken("/login/social", "post", { unionId, source });
}

/**
 * 获取手机验证码(QQ登录，绑定已有账号手机号)
 * @param mobile 手机号
 * @returns {Promise}
 */
export function getBindMobileMsgCode(mobile) {
  return requestWithoutToken("/login/social/code", "get", { mobile });
}

/**
 * QQ登录，将手机号和QQ号进行绑定
 * @param unionId 用户唯一的标识(openid)
 * @param mobile 手机号
 * @param code 手机验证码
 * @returns {Promise}
 */
export function bindMobileAndQQ({ unionId, mobile, code }) {
  return requestWithoutToken("/login/social/bind", "post", {
    unionId,
    mobile,
    code,
  });
}

/**
 * 检测用户名是否唯一
 * @param account 用户名
 * @returns {Promise}
 */
export function checkUsernameIsUnique(account) {
  return requestWithoutToken("/register/check", "get", { account });
}

/**
 * 获取手机验证码
 * @param mobile 手机号
 * @returns {Promise}
 */
export function getRegisterMsgCode(mobile) {
  return requestWithoutToken("/register/code", "get", { mobile });
}

/**
 * 创建新账户并绑定QQ
 * @param unionId QQ用户的唯一标识
 * @param account 用户名
 * @param mobile 手机号
 * @param code 验证码
 * @param password 密码
 * @returns {Promise}
 */
export function createNewAccountBindQQ({
  unionId,
  account,
  mobile,
  code,
  password,
}) {
  return requestWithoutToken(`/login.social/${unionId}/complement`, "post", {
    account,
    mobile,
    code,
    password,
  });
}
