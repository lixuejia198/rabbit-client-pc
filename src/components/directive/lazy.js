// 图片懒加载指令
import defaultImg from "@/assets/images/default.png";

const lazy = {
  // 指令所在元素挂载完成后
  mounted(el, binding) {
    // 创建元素监听对象
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      /**
       * useIntersectionObserver实例提供两个方法
       * observe(dom) 观察哪个dom
       * unobserve(dom) 停止观察哪个dom
       */
      // 判断元素是否进入可视区
      if (isIntersecting) {
        // 停止监听元素
        observer.unobserve(el);
        // 动态加载图片
        el.src = binding.value;
        // 当图片加载出错时
        el.onerror = () => {
          // 显示默认产品图片
          el.src = defaultImg;
        };
      }
    });
    // 指定要监听的元素
    observer.observe(el);
  },
};

export default lazy;
