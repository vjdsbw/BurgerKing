<script setup lang="ts" name="Points-Redemption">
import { listByPhoneApi, pointListApi, pointPayApi } from "@/api/couponsManger"
import { CloseCircleOutline } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import { useMessage } from 'naive-ui'

const message = useMessage()

interface Row {
    goodId: string
    goodName: string
    salesPrice: string
    sectionId: string
    useDesc: string
}

const tableLoading = ref<boolean>(false)
const tableData = ref<Row[]>([])
const couponList = async () => {
    if (!phone.value) return message.warning('请先选择账号')
    tableLoading.value = true
    const { code, data, msg } = await pointListApi({ userUidId: phone.value })
    if (code === 0) {
        tableData.value = data
    } else {
        message.warning(msg)
    }
    tableLoading.value = false
}

const selectLoading = ref<boolean>(false)
const phone = ref<number | null>(null)
const phoneList = ref<{ label: string, phone: string, value: number }[]>([])
const getPhoneList = async () => {
    const { code, data, msg } = await listByPhoneApi({});
    if (code === 0) {
        phoneList.value = data.map((item: any) => ({ label: item.phone, phone: item.phone, value: item.userUidId }))
    } else {
        message.warning(msg)
    }
}

const showModal = ref<boolean>(false)
const description = ref<string>()
const viewDetail = (row: Row) => {
    showModal.value = true;
    description.value = row.useDesc
}

const columns: DataTableColumns<Row> = [
    {
        title: "序号",
        key: "goodId",
        align: "center",
        render: (row: Row) => {
            const index = tableData.value.findIndex(item => item.goodId === row.goodId)
            return index + 1
        }
    },
    {
        title: "商品名称",
        key: "goodName",
        align: "center"
    },
    {
        title: "积分价格",
        key: "salesPrice",
        align: "center"
    },
    {
        title: "操作",
        key: 'Action',
        align: "center",
        width: 400,
        render: (row: Row) => {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px', marginRight: '10px' },
                        onClick: () => viewDetail(row)
                    },
                    { default: () => '使用说明' }
                ),
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px' },
                        onClick: async () => {
                            let params = {
                                goodId: row.goodId,
                                sectionId: row.sectionId,
                                userUidId: phone.value!
                            }
                            const { code, data, msg } = await pointPayApi(params)
                            if (code === 0) {
                                message.success("兑换成功")
                            } else {
                                message.error(msg)
                            }
                        }
                    },
                    { default: () => '兑换' }
                ),
            ]
        }
    }
]

onMounted(() => {
    getPhoneList()
})

</script>

<template>
    <n-card class="points-redemption-box" :bordered="false">
        <n-card :bordered="false">
            <n-select v-model:value="phone" style="width: 200px;" placeholder="请选择账号" :options="phoneList" filterable
                remote clearable :loading="selectLoading" @update:value="couponList" />
        </n-card>
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false" :loading="tableLoading"
                :pagination="{ pageSizes: [10, 20, 50, 100], showSizePicker: true }" />
        </n-card>

        <n-modal v-model:show="showModal">
            <n-card style="width: 800px" preset="card" title="使用说明" :bordered="false" :mask-closable="false">
                <template #header-extra>
                    <n-icon size="20" @click="showModal = false" style="cursor: pointer;">
                        <CloseCircleOutline />
                    </n-icon>
                </template>
                <n-scrollbar style="max-height: 600px">
                    <div v-html="description" class="points-redemption-box-model"></div>
                </n-scrollbar>
            </n-card>
        </n-modal>

    </n-card>
</template>

<route lang="json">{
    "meta": {
        "layout": "Index"
    }
}</route>

<style scoped lang="scss"></style>