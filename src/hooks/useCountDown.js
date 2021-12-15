import { useIntervalFn } from "@vueuse/core";
import { onUnmounted, ref } from "vue";

export default function useCountDown() {
  // 此方法和原生JS中的setInterval的作用是一样的
  // pause 清除定时器
  // resume 重新开启定时器
  // isActive 定时器是否正在执行
  // 定时器不能立即执行 在验证码发送成功以后才执行
  // immediate: false, 阻止定时器立即执行
  const count = ref(0);
  const { pause, resume, isActive } = useIntervalFn(
    () => {
      // 判断数值是够小于等于0
      if (count.value <= 0) {
        // 清除定时器
        pause();
      } else {
        // 让count减1
        count.value = count.value - 1;
      }
    },
    1000,
    {
      immediate: false,
    }
  );
  // 执行开始操作 开始倒计时
  const start = (value) => {
    // 如果定时器没有正在执行
    if (!isActive.value) {
      // 重新设置倒计时数值
      count.value = value;
      // 重新开启定时器
      resume();
    }
  };
  // 组件卸载完成后清除定时器
  onUnmounted(pause);
  // 返回定时器数值
  return { start, count, isActive };
}
