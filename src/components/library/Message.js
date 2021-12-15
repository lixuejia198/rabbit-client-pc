// 1. 导入单文件组件对象
// 2. 将单文件组件转换为虚拟节点对象
// 3. 将虚拟节点渲染到真实DOM中
// 4. 3秒后销毁组件

// 1.导入单文件组件
import XtxMessage from "@/components/library/XtxMessage";
import { createVNode, render } from "vue";
// 创建组件渲染的目标容器
const container = document.createElement("div");
document.body.appendChild(container);
// 用于存定时器
let timer = null;
// 用于渲染组件的方法
export default function Message({ type, text }) {
  // 2. 将单文件组件装换为虚拟节点对象
  const vNode = createVNode(XtxMessage, { type, text });
  // 3. 将虚拟节点对象渲染到真实DOM中
  render(vNode, container);
  // 4. 3秒后销毁组件
  clearTimeout(timer);
  timer = setTimeout(() => {
    // 销毁组件
    vNode.component.proxy.show = false;
    // 重置DOM对象 清除_vnode属性
    container._vnode = null;
  }, 3000);
}
