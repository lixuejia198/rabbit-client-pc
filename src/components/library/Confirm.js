import { createVNode, render } from "vue";
import XtxConfirm from "@/components/library/XtxConfirm";
// 创建组件渲染的目标容器
const container = document.createElement("div");
// 将目标容器放入body中
document.body.appendChild(container);

// 供外部调用的用来渲染确认框组件的方法
export default function Confirm({ title = "温馨提示", content }) {
  return new Promise(function (resolve, reject) {
    // 当用户点击确认按钮是要执行的方法
    const onSureButtonClickHandler = () => {
      // 执行用户传递的then回调
      resolve();
      render(null, container);
    };
    // 当用户点击取消按钮时要执行的方法
    const onCancelButtonClickHandler = () => {
      // 执行用户传递的catch回调
      reject();
      vNode.el.classList.remove("fade");
      vNode.el.children[0].classList.remove("fade");
      setTimeout(() => {
        render(null, container);
      }, 400);
    };
    // 将单文件组件转移为虚拟节点对象
    const vNode = createVNode(XtxConfirm, {
      title,
      content,
      onSureButtonClick: onSureButtonClickHandler,
      onCancelButtonClick: onCancelButtonClickHandler,
    });
    // 将虚拟节点对象渲染到真实DOM中
    render(vNode, container);
    // 执行入场动画
    setTimeout(() => {
      vNode.el.classList.add("fade");
      vNode.el.children[0].classList.add("fade");
    }, 0);
  });
}
