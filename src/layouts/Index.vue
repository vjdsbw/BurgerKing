<script setup lang="ts" name="Layout">
import avatar from "@/assets/PC/avatar.png";
import { logoutApi } from "@/api/login";
import { Home, LogoLinkedin, NewspaperOutline, PeopleCircle, LocationSharp, BagHandleSharp, GitCompareSharp } from '@vicons/ionicons5'
import { Store } from "@/store";
import type { MenuOption } from 'naive-ui'
const { user, global } = Store();

const router = useRouter()

const handleSelect = async () => {
    const { code, data } = await logoutApi()
    if (code === 0) {
        user.setToken("")
        user.setUserName("")
    }
    router.push({ name: "PC-Login" })
}
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const options = [
    {
        label: '退出登录',
        key: 'out',
    },
]

const collapsed = ref<boolean>(false)

const menuOptions: MenuOption[] = [
    {
        label: '首页',
        key: 'PC-Home',
        icon: renderIcon(Home)
    },
    {
        label: '账号管理',
        key: 'PC-AccountManage',
        icon: renderIcon(PeopleCircle)
    },
    {
        label: '卡劵管理',
        key: 'PC',
        icon: renderIcon(NewspaperOutline),
        children: [
            {
                label: '我的优惠劵',
                key: 'PC-MyCoupons',
            },
            {
                label: '领劵中心',
                key: 'PC-CouponsManger',
            },
        ]
    },
    {
        label: '链接管理',
        key: 'PC-LinkManger',
        icon: renderIcon(LogoLinkedin)
    },
    {
        label: '门店管理',
        key: 'PC-StoreManager',
        icon: renderIcon(LocationSharp)
    },
    {
        label: '商品管理',
        key: 'PC-MerchandiseManager',
        icon: renderIcon(BagHandleSharp)
    },
    {
        label: '积分兑换',
        key: 'PC-PointsRedemption',
        icon: renderIcon(GitCompareSharp)
    },
];

const changeMenu = (key: string, _item: MenuOption) => {
    global.setActiveMenu(key)
    router.push({ name: key })
}

</script>

<template>
    <div class="layout-box">
        <n-layout position="absolute">
            <n-layout-header style="height: 64px; padding:20px 30px;background-color: #2080f0" bordered>
                <div class="header-contant">
                    <div> 欢迎使用汉堡King管理系统</div>
                    <div class="right">
                        <div> {{ user.userName }}</div>
                        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                            <n-avatar round size="small" :src="avatar" />
                        </n-dropdown>
                    </div>
                </div>
            </n-layout-header>
            <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px;">
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
                    show-trigger @collapse="collapsed = true" @expand="collapsed = false">
                    <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
                        :options="menuOptions" @update:value="changeMenu" v-model:value="global.activeMenu" />
                </n-layout-sider>
                <n-layout content-style="padding: 24px;" style="background-color: #ededed">
                    <router-view></router-view>
                </n-layout>
            </n-layout>
            <n-layout-footer bordered position="absolute" style="height: 64px; padding: 20px">
            </n-layout-footer>
        </n-layout>
    </div>
</template>

<style scoped lang="scss">
.layout-box {
    .header-contant {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;

        .right {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .n-avatar {
                margin-left: 10px;
            }
        }
    }
}
</style>
