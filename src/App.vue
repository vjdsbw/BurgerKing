<script setup lang="ts" name="App"></script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="MainFade" mode="out-in">
        <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
/* 渐变设置 */
// .MainFade-enter-from, .MainFade-leave-to {
//   transform: translateX(20px);
//   opacity: 0;
// }
// .MainFade-enter-to, .MainFade-leave-from {
//   opacity: 1;
// }
// .MainFade-enter-active {
//   transition: all 0.7s ease;
// }
// .MainFade-leave-active {
//    transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
// }
</style>