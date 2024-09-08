<script setup lang="ts" name="Coupons-Manger">
import { couponListApi, listByPhoneApi, sendCouponApi } from "@/api/couponsManger";
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { CloseCircleOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui'

const message = useMessage()

interface Row {
    couponCenterId: number,
    couponId: string,
    couponName: string,
    currentPrice: string,
    description: string,
    sellType: number;
}

const tableData = ref<Row[]>([])

const showModal = ref<boolean>(false)
const description = ref<any>()
const viewDetail = (row: Row) => {
    showModal.value = true;
    description.value = row.description
}

const linkModal = ref<boolean>(false);

const linkForm = ref<{ num: number; userUidId: number | null }>({ num: 1, userUidId: null });

const generalOptions = ref<{ label: string; phone: string; value: number }[]>([])

const rules: FormRules = {
    num: [{ required: true, message: '请输入数量', }],
    userUidId: [{ required: true, message: '请输入/选择手机号', }],
}

const vouchersChange = async () => {
    if (!linkForm.value.userUidId) return message.warning('请先选择手机号')
    if (!linkForm.value.num) return message.warning('请确认数量')
    const params = {
        couponCenterId: rowInfo.value.couponCenterId,
        couponId: rowInfo.value.couponId,
        num: linkForm.value.num,
        userUidId: linkForm.value.userUidId
    }
    const { code, data, msg } = await sendCouponApi(params)
    if (code === 0) {
        couponList()
        linkModal.value = false
        message.success('领取成功')
    } else {
        message.error(msg)
    }
}

const couponList = async () => {
    const { code, data, msg } = await couponListApi()
    if (code === 0) {
        tableData.value = data
    } else {
        message.warning(msg)
    }
}

onMounted(() => {
    couponList()
})

const rowInfo = ref<Row>({
    couponCenterId: 0,
    couponId: "",
    couponName: "",
    currentPrice: "",
    description: "",
    sellType: 0
});

const columns: DataTableColumns<Row> = [
    {
        title: "序号",
        key: "couponCenterId",
        align: "center",
        render: (_rowData: object, rowIndex: number) => {
            return rowIndex + 1
        }
    },
    {
        title: "劵名称",
        key: "couponName",
        align: "center"
    },
    {
        title: "劵价格",
        key: "currentPrice",
        align: "center"
    },
    {
        title: "操作",
        key: 'Action',
        align: "center",
        width: 400,
        render(row) {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px', marginRight: '10px' },
                        onClick: () => viewDetail(row)
                    },
                    { default: () => '劵详情' }
                ),
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px' },
                        onClick: async () => {
                            rowInfo.value = row;
                            const { code, data, msg } = await listByPhoneApi({});
                            if (code === 0) {
                                generalOptions.value = data.map((item: any) => ({ label: item.phone, phone: item.phone, value: item.userUidId }))
                                linkModal.value = true;
                            } else {
                                message.warning(msg)
                            }
                        }
                    },
                    { default: () => '领取卡券' }
                ),
            ]
        }
    }
]

</script>

<template>
    <n-card class="coupons-manger" :bordered="false">
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false"
                :pagination="{ pageSizes: [10, 20, 50, 100], showSizePicker: true }" />
        </n-card>

        <n-modal v-model:show="showModal">
            <n-card style="width: 600px" preset="card" title="卡劵详情" :bordered="false" :mask-closable="false">
                <template #header-extra>
                    <n-icon size="20" @click="showModal = false" style="cursor: pointer;">
                        <CloseCircleOutline />
                    </n-icon>
                </template>
                <div v-html="description"></div>
            </n-card>
        </n-modal>
        <n-modal v-model:show="linkModal">
            <n-card style="width: 600px" preset="card" title="领取卡券" :bordered="false" :mask-closable="false">
                <n-form ref="formRef" :model="linkForm" :rules="rules" label-placement="left" label-width="auto"
                    require-mark-placement="right-hanging">
                    <n-form-item label="选择账号" path="userUidId">
                        <n-select v-model:value="linkForm.userUidId" placeholder="请输入手机号" :options="generalOptions"
                            filterable remote clearable />
                    </n-form-item>
                    <n-form-item label="输入数量" path="num">
                        <n-input-number clearable v-model:value="linkForm.num" :min="1" />
                    </n-form-item>
                </n-form>
                <n-space reverse>
                    <n-button type="info" @click="vouchersChange">确认</n-button>
                    <n-button type="tertiary" @click="linkModal = false">取消</n-button>
                </n-space>
            </n-card>
        </n-modal>
    </n-card>
</template>

<route lang="json">{
    "meta": {
        "layout": "Index"
    }
}</route>

<style scoped lang="scss">
.coupons-manger {
    // height: 100%;
    background-color: white;
}
</style>
