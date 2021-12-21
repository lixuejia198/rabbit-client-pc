<template>
  <div class="goods-sku">
    <dl v-for="spec in specs" :key="spec.name">
      <dt>{{ spec.name }}</dt>
      <dd>
        <template v-for="value in spec.values" :key="value.name">
          <img
            @click="updateSpecSelected(spec, value)"
            :class="{ selected: value.selected, disabled: value.disabled }"
            v-if="value.picture"
            :src="value.picture"
            alt=""
          />
          <span
            @click="updateSpecSelected(spec, value)"
            :class="{ selected: value.selected, disabled: value.disabled }"
            v-else
          >
            {{ value.name }}
          </span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import powerSet from "@/vendor/power-set";
export default {
  name: "GoodsSku",
  props: {
    // 用于在页面中渲染的供用户选择的规格数据
    specs: {
      type: Array,
      default: () => [],
    },
    // 当前商品可以组合的所有规格组合
    skus: {
      type: Array,
      default: () => [],
    },
    // 默认选中的规格组合的id
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    // 获取规格查询对象
    const pathMap = createPathMap(props.skus);
    // 初始化时更新规格按钮的禁选效果
    updateSpecDisabled(props.specs, pathMap);
    // 设置默认选中的规格组合
    setDefaultSelected(props.skuId, props.skus, props.specs);
    // 更新规格的选中状态
    const updateSpecSelected = (spec, value) => {
      // 当点击规格按钮的时候如果规格按钮是禁选的 直接返回不让用户更改当前规格的是否选中状态
      if (value.disabled) return;
      // 如果用户点击的规格是选中的
      if (value.selected) {
        // 让其取消选中
        value.selected = false;
      } else {
        // 先将该规格中的所有规格取消选中
        spec.values.forEach((item) => (item.selected = false));
        // 将当前用户点击的规格设置为选中
        value.selected = true;
      }
      // 更新按钮的禁选状态
      updateSpecDisabled(props.specs, pathMap);
      sendDataToParent(props.specs, props.skus, emit, pathMap);
    };

    return { updateSpecSelected, pathMap };
  },
};
// 创建规格查询对象
function createPathMap(skus) {
  // skus: 存储了所有可以组合的规格集合 数组类型
  // 用于存储最终的规格查询对象
  const pathMap = {};
  // 遍历所有可组合的规格组合
  skus.forEach((sku) => {
    // 找到有库存的规格组合
    if (sku.inventory > 0) {
      // 将可组合的规格的名称临时存到一个数组中
      const valuesNames = sku.specs.map((spec) => spec.valueName);
      // console.log(valuesNames, "valuesNames");
      // 获取当前商品的规格数量 后面将用于判断某个规格是否是完整的
      const max = sku.specs.length;
      // 获取规格集合的子级组合(不包含空集合)
      const sets = powerSet(valuesNames).filter((item) => item.length > 0);
      // console.log(sets, "sets");
      // 遍历规格子级组合
      sets.forEach((set) => {
        // 将规格名称以 _ 进行拼接
        const key = set.join("_");
        // 判断当前规格是否是完整的
        const isCompleteSku = set.length === max;
        // 判断规格查询对象中是否已经存储了当前规格
        if (key && !pathMap[key]) {
          // 没有存储会进入这个判断
          // 如果当前规格是完整的
          if (isCompleteSku) {
            // 将当前规格组合的名称作为规格查询对象的属性 将当前商品的skuId作为属性值
            pathMap[key] = sku.id;
          } else {
            // 如果当前规格是子级规格 不是完整的
            // 将当前规格组合的名称作为规格查询对象的属性 将null作为属性值
            pathMap[key] = null;
          }
        }
      });
    }
  });
  // 返回规格查询对象
  return pathMap;
}
// 更新规格按钮的禁用状态
function updateSpecDisabled(specs, pathMap) {
  // 约定每一个规格数据中通过disabled属性标识禁用状态
  // 遍历规格数组
  specs.forEach((spec, index) => {
    // 为什么要在此处获取用户选择的规格?
    // 在每一轮规格匹配的过程中, 下面的循环都会向数组中动态添加值
    // 在下一轮开始匹配前, 获取到用户最初选中的规格名称值
    const selected = getUserSelected(specs);
    // 遍历具体的规格信息
    spec.values.forEach((value) => {
      if (value.selected) return;
      // 将当前规格名称放入用户选择的规格数组名称中 待匹配
      selected[index] = value.name;
      // 将 `selected` 数组中的 undefined 过滤掉, 剩下的数组值使用 _ 进行拼接
      // 如果用户未选择任何规格 (组件初始化时), selected 数组中只会包含当前遍历的规格名称
      const key = selected.filter((item) => item).join("_");
      // 设置按钮的禁用状态
      // 如果当前遍历的规格不在规格查询字典对象中 说明它需要被禁用
      // 如果在规格查询对象中不存在 key 属性, 说明当前规格不能和用户选择的规格进行组合, 禁选当前规格
      value.disabled = !(key in pathMap);
    });
  });
}
// 获取用户选中的规格
function getUserSelected(specs) {
  // 用于存储用户选择的规格
  const result = [];
  // 遍历商品规格集合
  specs.forEach((spec, index) => {
    // 在当前规格中查找用户选择的规格
    const selected = spec.values.find((value) => value.selected);
    // 如果找到了
    if (selected) {
      // 将该规格放在它位置上
      result[index] = selected.name;
    } else {
      // 如果没有找到 当前规格使用undefined占位
      result[index] = undefined;
    }
  });
  // 返回用户选中的规格
  return result;
}
// 设置默认选中的规格组合
function setDefaultSelected(skuId, skus, specs) {
  // 如果skuId不存在 说明不需要设置默认选中效果
  if (!skuId) return;
  // 根据skuId在规格集合中查找默认选中的规格对象
  // 然后遍历其中的specs 返回规格名称数组
  const target = skus
    .find((sku) => sku.id === skuId)
    .specs.map((spec) => spec.valueName);
  // console.log(target, "target");
  // 循坏所有的规格选项
  specs.forEach((spec) => {
    spec.values.forEach((value) => {
      if (target.includes(value.name)) {
        // 如果当前规格选项的名称在target数组中
        // 将它的选中状态设置为true
        value.selected = true;
      }
    });
  });
}
// 将用户选择的规格数据传递到父组件 以备使用
function sendDataToParent(specs, skus, emit, pathMap) {
  // 获取用户选择的规格
  const selected = getUserSelected(specs).filter((item) => item);
  // 判断用户选择的规格是否是完整的 如果是完整的才需要将数据传递到组件
  if (selected.length === specs.length) {
    // 获取规格id
    const skuId = pathMap[selected.join("_")];
    // 根据skuId在所有可组合的规格集合中查找规格对象
    const target = skus.find((sku) => sku.id === skuId);
    // console.log(target);
    // 将规格数据传递到父组件
    emit("onSpecChanged", {
      // 商品的规格id，将商品加入购物车时使用
      skuId,
      // 商品的现价(更新视图)
      price: target.price,
      // 商品的原价(更新视图)
      oldPrice: target.oldPrice,
      // 商品的库存，在用户选择商品数量的时候使用
      inventory: target.inventory,
      // 用户选择的规格名称字符串
      attrsText: target.specs
        .map((spec) => `${spec.name}：${spec.valueName}`)
        .join(" "),
    });
  } else {
    // 当用户选择的不是一个完整的规格时,告诉父组件清除skuId
    emit("onSpecHalfChanged");
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
