<template>
  <div class="footer">
    <div class="footer-left">
      <span>
        <i class="iconfont"></i>
      </span>
      <!-- <span>页码：1</span> -->
      <!-- <span>页面：</span> -->
      <span>字数：{{ footerInfo.wordCount }}</span>
    </div>
    <div class="footer-right">
      <i
        class="iconfont icon-window-size"
        @click="inputHandle(190)"
        title="自适应窗口"
      />
      <!-- 要实现指定数值的缩放 -->
      <el-popover placement="top-start" title="显示比例" trigger="click">
        <template #reference>
          <span style="cursor: pointer">
            {{ pageSize }}%
            <i class="iconfont icon-xiangxiazhankai" style="margin: 0" />
          </span>
        </template>
        <el-radio v-model="pageSize" @click="inputHandle(200)" :label="200">
          200%
        </el-radio>
        <el-radio v-model="pageSize" @click="inputHandle(100)" :label="100">
          100%
        </el-radio>
        <el-radio v-model="pageSize" @click="inputHandle(75)" :label="75">
          75%
        </el-radio>
        <el-radio v-model="pageSize" @click="inputHandle(190)" :label="190">
          整页
        </el-radio>
      </el-popover>

      <i class="iconfont icon-jianhao" title="缩小" @click="pageScale(0)"></i>
      <el-slider v-model="pageSize" @input="inputHandle" :min="50" :max="300" />
      <i class="iconfont icon-jiahao1" title="放大" @click="pageScale(1)"></i>
      <i
        v-if="fullScreen"
        @click="fullScreenHandle()"
        class="iconfont icon-a-122-tuichuquanping"
        title="退出"
      />

      <i
        v-else
        @click="fullScreenHandle()"
        class="iconfont icon-24gl-fullScreenEnter2"
        title="全屏"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

let { footerInfo } = defineProps({
  footerInfo: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["pageSizeChange"]);
// 页面缩放比例
let pageSize = ref(100);

// 全屏状态
let fullScreen = ref(false);

// 点击缩小放大按钮
function pageScale(index) {
  let instance = Reflect.get(window, "__mpoe_instance__");
  if (index) {
    pageSize.value += 10;
    instance && instance.command.executePageScaleAdd();
  } else {
    pageSize.value -= 10;
    instance && instance.command.executePageScaleMinus();
  }
}

// 滑块事件
function inputHandle(value) {
  let instance = Reflect.get(window, "__mpoe_instance__");
  if (!instance) return;
  instance.command.executePageScale(value / 100); // 入参是比例值，需要做转换
}

// 全屏与取消事件
function fullScreenHandle() {
  let dom = document.querySelector(".word");
  if (!fullScreen.value) dom.requestFullscreen();
  else {
    if (document.exitFullscreen) {
      // W3C标准的退出全屏方法
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox特定的退出全屏方法
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome、Safari及Opera特定的退出全屏方法
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge特定的退出全屏方法
      document.msExitFullscreen();
    }
  }
  fullScreen.value = !fullScreen.value;
}

// 监听父组件传递的所有参数 页面、页码、字数、缩放比例
watch(
  footerInfo,
  () => {
    pageSize.value = Math.floor(100 * footerInfo.pageScaleNumber);
  },
  { deep: true, immediate: true }
);
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  &-left {
    span {
      height: 100%;
      padding: 0 10px;
      border-right: solid #ccc 1px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    i {
      margin: 0 10px;
      cursor: pointer;
    }
  }
}
/deep/.el-slider {
  width: 150px;
}
/deep/.el-slider__runway {
  background-color: #fff;
}
/deep/.el-slider__button-wrapper {
  width: 10px;
  height: 10px;
  top: -8.5px;
}
/deep/.el-slider__button {
  width: 100%;
  height: 100%;
}
</style>
