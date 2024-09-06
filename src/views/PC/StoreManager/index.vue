<script setup lang="ts" name="Store-Management">
import { storeListApi, storeBaseInfoApi } from "@/api/couponsManger"
import { useMessage } from 'naive-ui'

const message = useMessage()

interface Store {
    address: string
    busiTime: string
    distance?: string
    status?: string
    statusCode?: number | null
    storeCode: string
    storeName: string
    city?: string
    province?: string
    area?: string
}
const selectLoading = ref<boolean>(false)

const storeInfo = ref<Store>({
    address: "",
    area: "",
    busiTime: "",
    city: "",
    province: "",
    storeCode: "",
    storeName: "",
})

const storeOptions = ref<Store[]>([])

const handleSearch = async (value: string) => {
    selectLoading.value = true
    const { code, data } = await storeListApi({ storeName: value })
    if (code === 0) {
        storeOptions.value = data
    }
    selectLoading.value = false
}

const selectChange = async (value: string) => {
    const { code, data, msg } = await storeBaseInfoApi({ storeCode: value })
    if (code === 0) {
        storeInfo.value = data
    } else {
        message.error(msg)
    }
}
</script>

<template>
    <n-card class="store-management-box" :bordered="false">
        <n-space style="margin: 20px 0px;">
            <n-select placeholder="请输入门店名称" :options="storeOptions" filterable remote clearable :loading="selectLoading"
                label-field="storeName" value-field="storeCode" @search="handleSearch" @update:value="selectChange" />
        </n-space>
        <n-descriptions label-placement="left" title="门店详情" :column="1">
            <n-descriptions-item label="门店名称">{{ storeInfo.storeName }}</n-descriptions-item>
            <n-descriptions-item label="省">{{ storeInfo.province }}</n-descriptions-item>
            <n-descriptions-item label="区">{{ storeInfo.area }}</n-descriptions-item>
            <n-descriptions-item label="市">{{ storeInfo.city }}</n-descriptions-item>
            <n-descriptions-item label="详细地址">{{ storeInfo.address }}</n-descriptions-item>
            <n-descriptions-item label="营业时间"> {{ storeInfo.busiTime }}</n-descriptions-item>
        </n-descriptions>
    </n-card>
</template>

<route lang="json">{
    "meta": {
        "layout": "Index"
    }
}</route>

<style scoped lang="scss">
.store-management-box {
    background-color: white;
}
</style>