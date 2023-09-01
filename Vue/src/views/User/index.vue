<template>
  <div>{{ user }}</div>
</template>

<script setup>
let user = sessionStorage.getItem("user");
</script>

<style lang="less" scoped></style>
