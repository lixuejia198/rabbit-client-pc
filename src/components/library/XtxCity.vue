<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle">
      <span class="placeholder" v-if="!location">请选择配送地址</span>
      <span class="value" v-else>{{ location }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <template v-if="cityData">
        <span
          class="ellipsis"
          @click="selectCityData(item)"
          v-for="item in list"
          :key="item.code"
        >
          {{ item.name }}
        </span>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import axios from "axios";

export default {
  name: "XtxCity",
  setup(props, { emit }) {
    // 控制下拉菜单是否显示
    const visible = ref(false);
    // 用于获取下拉框元素
    const target = ref();
    // 用于存储城市数据
    const cityData = ref(null);
    // 用于存储用户选择的省市区数据 code用于发送给服务器端 name用于模板展示
    const selectedCityData = reactive({
      provinceCode: "",
      cityCode: "",
      countyCode: "",
      provinceName: "",
      cityName: "",
      countyName: "",
    });
    // 用于展示用户选择的省市区数据
    const location = ref("");
    // 用于记录用户选择的是什么
    const selectCityData = (data) => {
      // 存储省级数据
      if (data.level === 0) {
        selectedCityData.provinceCode = data.code;
        selectedCityData.provinceName = data.name;
        // 存储市级数据
      } else if (data.level === 1) {
        selectedCityData.cityCode = data.code;
        selectedCityData.cityName = data.name;
        // 存储县区数据
      } else {
        selectedCityData.countyCode = data.code;
        selectedCityData.countyName = data.name;
      }
    };
    // 替换页面中的省市区数据
    const list = computed(() => {
      // list列表的初始值为省级列表
      let list = cityData.value;
      // 如果用户选择了省级数据
      if (selectedCityData.provinceCode) {
        // 将数据更新为市级数据
        list = list.find(
          (province) => province.code === selectedCityData.provinceCode
        ).areaList;
      }
      // 如果用户选择了市级数据
      if (selectedCityData.cityCode) {
        // 将数据更新为县区级数据
        list = list.find(
          (city) => city.code === selectedCityData.cityCode
        ).areaList;
      }
      // 如果用户选择了县区级数据
      if (selectedCityData.countyCode) {
        const { provinceCode, cityCode, countyCode } = selectedCityData;
        // 将用户选择的数据传递到组件外部
        emit("onCityChanged", { provinceCode, cityCode, countyCode });
        // 重置省级列表
        list = cityData.value;
        // 隐藏弹框
        hide();
      }
      return list;
    });
    // 显示下拉菜单
    const show = () => {
      // 获取城市数据
      getCityData().then((data) => {
        // console.log(data);
        cityData.value = data;
      });
      // 显示下拉菜单
      visible.value = true;
    };
    // 隐藏下拉菜单
    const hide = () => {
      visible.value = false;
      if (selectedCityData.countyName) {
        location.value = `${selectedCityData.provinceName} ${selectedCityData.cityName} ${selectedCityData.countyName}`;
      }
      // 重置用户选择的省市区数据
      for (const attr in selectedCityData) {
        selectedCityData[attr] = "";
      }
    };
    //切换下拉菜单的显示与隐藏
    const toggle = () => {
      visible.value ? hide() : show();
    };
    // 当点击城市选择组件外面的时候 执行弹框隐藏逻辑
    onClickOutside(target, () => {
      hide();
    });
    return {
      visible,
      toggle,
      target,
      cityData,
      list,
      selectCityData,
      location,
    };
  },
};
// 在window对象中缓存城市数据
window.cityData = null;
// 获取城市数据
async function getCityData() {
  // 如果window对象中已经缓存了城市数据 从window对象中获取城市数据
  if (window.cityData) {
    return window.cityData;
  } else {
    // window对象中没有城市数据 向服务器发送请求获取城市数据
    let data = await axios
      .get(
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
      )
      .then((response) => response.data);
    // 将城市数据缓存到window对象中 并作为当前方法的返回值
    return (window.cityData = data);
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
