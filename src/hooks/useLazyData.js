import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

/***
 * 监听元素进入可视区 进行数据加载
 * @param apiFunction 用于获取数据的api函数
 * @returns {{result: null, target: null}}
 */
export default function useLazyData(apiFunction) {
  // 创建元素引用对象
  const target = ref(null);
  // 存储数据
  const result = ref(null);
  // 监听元素进入可视区 target为目标监听元素
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      // 元素进入可视区
      if (isIntersecting) {
        // 停止监听
        stop();
        // 获取数据
        apiFunction().then((data) => (result.value = data.result));
      }
    },
    // 设置元素进入可视区的临界值
    { threshold: 0 }
  );
  return { target, result };
}
