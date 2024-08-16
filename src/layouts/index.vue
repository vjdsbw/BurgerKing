<script setup lang="ts" name="layout">
import homeActive from '@/assets/icons/home_active.png';
import home from '@/assets/icons/home.png';
import menuPActive from '@/assets/icons/menu_active.png';
import menuP from '@/assets/icons/menu.png';
import myActive from '@/assets/icons/my_active.png';
import my from '@/assets/icons/my.png';
import shopbagActive from '@/assets/icons/shopbag_active.png';
import shopbag from '@/assets/icons/shopbag.png';
import { Store } from '@/store'

const { global } = Store()

const badegNum = computed(() => global.totalGet.totalNum)
</script>

<template>
    <div>
        <router-view></router-view>
        <div style="height: 4rem;background-color: #f7f8fa"></div>
        <van-tabbar fixed route>
            <van-tabbar-item name="home" to="/home">
                <span>首页</span>
                <template #icon="props">
                    <van-image :src="props.active ? homeActive : home" />
                </template>
            </van-tabbar-item>
            <van-tabbar-item name="me" to="/me">
                <span>我的</span>
                <template #icon="props">
                    <van-image :src="props.active ? myActive : my" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style scoped lang="scss"></style>