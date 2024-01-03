<template>
  <!-- <div class="recycle" @contextmenu.stop v-if="recyclePosition.show"> -->
  <div class="recycle" @contextmenu.stop v-if="0">
    <!-- 实现不同的文件类型 -->
    <el-badge
      :value="200"
      :style="{
        left: recyclePosition.x + 'px',
        top: recyclePosition.y + 'px',
      }"
    />
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, watch, nextTick } from "vue";

let { recyclePosition } = defineProps({
  recyclePosition: {
    type: Object,
    default: () => {},
  },
});

watch(
  recyclePosition,
  () => {
    console.log(recyclePosition);
  },
  { immediate: false, deep: true }
);

// let iconmap = {
//   md: { icon: '"icon-file-markdown1"', color: "#5A96DB" },
//   txt: { icon: '"icon-wenben1"', color: "rgba(0, 0, 0, 0.6)" },
//   xlsx: { icon: '"icon-excel"', color: "#01a408" },
//   folder: { icon: '"icon-24gf-folderOpen"', color: "#ffd153" },
// };
onMounted(() => {
  let instance = getCurrentInstance();

  // 将该组件放置到 body下 兼容
  const body = document.querySelector("body");
  if (body.append) {
    body.append(instance.vnode.el);
  } else {
    body.appendChild(instance.vnode.el);
  }
});
</script>

<style lang="less" scoped>
.recycle {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
.el-badge {
  position: absolute;
}
</style>
