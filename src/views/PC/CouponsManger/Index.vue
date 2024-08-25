<script setup lang="ts" name="Coupons-Manger">
import { couponListApi, listByPhoneApi } from "@/api/couponsManger";
import type { DataTableColumns } from 'naive-ui'
import { RowData } from "naive-ui/es/data-table/src/interface";
import { CloseCircleOutline } from '@vicons/ionicons5'
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
const viewDetail = (row: RowData) => {
    showModal.value = true;
    description.value = row.description
}


const selectLoading = ref<false>(false)

const linkModal = ref<boolean>(false);

const linkForm = ref<{ num: number; userUidId: string }>({ num: 1, userUidId: "" });

const generalOptions = ref<{ label: string; phone: string; value: number }[]>([])

const rules: FormRules = {
    num: [{ required: true, message: '请输入数量', trigger: ['input', 'blur'] }],
    userUidId: [{ required: true, message: '请输入/选择手机号', trigger: ['input', 'blur'] }],
}

const handleSearch = async (query: string) => {
    console.log(query, "sssssssssssssssssssss")
    // if (!query.length) {
    //     optionsRef.value = []
    //     return
    // }
    // selectLoading.value = true
    // window.setTimeout(() => {
    //     optionsRef.value = options.filter(
    //         item => ~item.label.indexOf(query)
    //     )
    //     selectLoading.value = false
    // }, 1000)
    selectLoading.value = true
    const { code, data } = await listByPhoneApi({ phone: query });
    if (code === 0) {
        generalOptions.value = data.map((item) => ({ label: item.phone, phone: item.phone, value: item.userUidId }))
    }
    selectLoading.value = false;
}

const couponList = async () => {
    const { code, data } = await couponListApi()
    if (code === 0) {
        tableData.value = data
    }
}

onMounted(() => {
    couponList()
})
const html = `<span>content</span>`;
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
                        onClick: () => linkModal.value = true
                    },
                    { default: () => '创建链接' }
                ),
            ]
        }
    }
]

</script>

<template>
    <div class="coupons-manger">
        <n-card title="卡片">
            <n-data-table :columns="columns" :data="tableData" :single-line="false"
                :pagination="{ pageSizes: [10, 20, 50, 100], showSizePicker: true }" />
        </n-card>

        <n-modal v-model:show="showModal">
            <n-card style="width: 600px" preset="card" title="卡卷详情" :bordered="false" :mask-closable="false">
                <template #header-extra>
                    <n-icon size="20" @click="showModal = false" style="cursor: pointer;">
                        <CloseCircleOutline />
                    </n-icon>
                </template>
                <div v-html="description"></div>
            </n-card>
        </n-modal>
        <n-modal v-model:show="linkModal">
            <n-card style="width: 600px" preset="card" title="创建链接" :bordered="false" :mask-closable="false">
                <n-form ref="formRef" :model="linkForm" :rules="rules" label-placement="left" label-width="auto"
                    require-mark-placement="right-hanging">
                    <n-form-item label="选择账号" path="userUidId">
                        <n-select v-model:value="linkForm.userUidId" placeholder="Select" :options="generalOptions"
                            filterable remote clearable :loading="selectLoading" @search="handleSearch" />
                    </n-form-item>
                    <n-form-item label="输入数量" path="num">
                        <n-input-number clearable v-model:value="linkForm.num" :min="1" />
                    </n-form-item>
                </n-form>
                <n-space reverse>
                    <n-button type="info" @click="submit">确认</n-button>
                    <n-button type="info">取消</n-button>
                </n-space>

            </n-card>
        </n-modal>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": "Index"
    }
}</route>

<style scoped lang="scss">
.coupons-manger {
    height: 100vh;

}
</style>