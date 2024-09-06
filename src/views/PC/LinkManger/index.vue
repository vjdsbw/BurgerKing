<script setup lang="ts" name="Link-Manage">
import { shortCodeApi, deleteCodeApi, replaceCodeApi, listByPhoneApi, downloadApi } from "@/api/couponsManger";
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'
const message = useMessage()

interface Row {
    couponName: string
    couponPrice: string
    createTime: string
    expiredTime: string
    orderPrice: string
    phone: string
    shortCode: string
    status: string
    statusDesc: string
    url: string
}

const linkForm = ref<{
    couponName: string;
    couponPrice: string;
    pageNo: number;
    pageSize: number;
    phone: string;
    status: string | null;
    url: string;
}>({
    couponName: '',
    couponPrice: '',
    pageNo: 1,
    pageSize: 10,
    phone: '',
    status: null,
    url: ''
})

const exportModal = ref<boolean>(false)
const exportFormRef = ref<FormInst | null>(null)
const exportForm = ref<{
    status: string | null,
    userUidId: number | null,
    useTime: [number, number] | null,
    createTime: [number, number] | null
}>({
    status: null,
    userUidId: null,
    useTime: null,
    createTime: null
})

const rules: FormRules = {
    status: [{ required: true, message: '请选择链接状态' }],
    userUidId: [{ required: true, message: '请选择手机号' }],
}

const selectLoading = ref<boolean>(false)
const exportOptions = ref<{ label: string; value: number }[]>([])

const openExportModal = async () => {
    exportModal.value = true;
    handleSearch('')
}

const handleSearch = async (query: string) => {
    selectLoading.value = true
    const { code, data, msg } = await listByPhoneApi({ phone: query });
    if (code === 0) {
        exportOptions.value = data.map((item: any) => ({ label: item.phone, value: item.userUidId }))
    } else {
        message.warning(msg)
    }
    selectLoading.value = false;
}

const exportExcel = async () => {
    exportFormRef.value?.validate((errors) => {
        if (!errors) {
            expoetDown()
        } else {
            message.warning("请检查手机号/状态选择")
        }
    })
}
const expoetDown = async () => {
    const params = {
        status: exportForm.value.status!,
        userUidId: exportForm.value.userUidId!,
    }
    if (exportForm.value.useTime) {
        params.usedStartDate = dayjs(exportForm.value.useTime[0]).format('YYYY-MM-DD HH:mm:ss');
        params.usedEndDate = dayjs(exportForm.value.useTime[1]).format('YYYY-MM-DD HH:mm:ss')
    }
    if (exportForm.value.createTime) {
        params.createStartDate = dayjs(exportForm.value.createTime[0]).format('YYYY-MM-DD HH:mm:ss');
        params.createEndDate = dayjs(exportForm.value.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
    }
    // const exportFormData = new FormData();
    // exportFormData.append("status", exportForm.value.status)
    // exportFormData.append("userUidId", exportForm.value.userUidId);
    // if (exportForm.value.useTime) {
    //     exportFormData.append("usedStartDate", dayjs(exportForm.value.useTime[0]).format('YYYY-MM-DD HH:mm:ss'))
    //     exportFormData.append("usedEndDate", dayjs(exportForm.value.useTime[1]).format('YYYY-MM-DD HH:mm:ss'))
    // }
    // if (exportForm.value.createTime) {
    //     exportFormData.append("createStartDate", dayjs(exportForm.value.createTime[0]).format('YYYY-MM-DD HH:mm:ss'))
    //     exportFormData.append("createEndDate", dayjs(exportForm.value.createTime[1]).format('YYYY-MM-DD HH:mm:ss'))
    // }
    const res: any = await downloadApi(params)
    const url = URL.createObjectURL(res);
    const a = document.createElement('a');
    a.href = url;
    a.download = '链接.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

}

const totalNum = ref<number>(0)
const pageCount = ref<number>(0)
const tableData = ref<Row[]>([])
const tableDataLoading = ref<boolean>(false)
const selectRowsKey = ref<string[]>([])
const selectRows = ref<Row[]>([])
const changeRowsSlect = (keys: any, rows: any) => {
    selectRowsKey.value = keys;
    selectRows.value = rows
}
const getShortCode = async () => {
    tableDataLoading.value = true
    const params = JSON.parse(JSON.stringify(linkForm.value))
    const res: any = await shortCodeApi(params)
    tableData.value = res.dataList;
    totalNum.value = res.totalCount;
    pageCount.value = res.pageCount
    tableDataLoading.value = false
}

const pageSizeChange = (pageSize: number) => {
    linkForm.value.pageSize = pageSize
    linkForm.value.pageNo = 1;
    getShortCode()
}

const pageChange = (page: number) => {
    linkForm.value.pageNo = page;
    getShortCode()
}

onMounted(() => {
    getShortCode()
})

const bacthCopy = () => {
    if (selectRowsKey.value.length === 0) return message.warning('选择要复制的链接')
    const urlList = selectRows.value.map((item: Row) => item.url)
    copyLink(urlList)
}

const copyLink = (list: string[]) => {
    const copyText = list.join('\n')
    try {
        if (navigator.clipboard && window.isSecureContext) {
            message.success('复制链接成功')
            return navigator.clipboard.writeText(copyText);
        } else {
            // 创建 textarea
            let textarea: any = document.createElement("textarea");
            textarea.value = copyText;
            textarea.style.opacity = 0;        // 使 textarea 不在 viewport，同时设置不可见
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy') ? message.success('复制链接成功') : message.error('复制链接失败');
            textarea.remove();
        }
    } catch (err) {
        message.error('复制链接失败')
    }
}

const options = [
    { label: '待使用', value: '0' },
    { label: '已使用', value: '1' },
    { label: '已过期', value: '2' },
]

const columns: DataTableColumns<Row> = [
    {
        type: 'selection',
        width: 100,
    },
    {
        title: "序号",
        key: "shortCode",
        align: "center",
        render: (_rowData: object, rowIndex: number) => {
            return (linkForm.value.pageNo - 1) * linkForm.value.pageSize + rowIndex + 1
        }
    },
    {
        title: "劵名称",
        key: "couponName",
        align: "center"
    },
    {
        title: "劵金额",
        key: "couponPrice",
        align: "center"
    },
    {
        title: "手机号",
        key: "phone",
        align: "center"
    },
    {
        title: "链接",
        key: "url",
        align: "center",
        width: 200,
        render: (row) => h(
            NTooltip,
            {
                trigger: 'hover',
                showArrow: true,
                style: { backgroundColor: '#2080f0', color: '#ffff' },
                arrowStyle: { backgroundColor: '#2080f0' }
            },
            {
                trigger: () => {
                    return h(
                        'p',
                        {
                            size: 'small',
                            type: 'info',
                            style: {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            },
                        },
                        { default: () => row.url }
                    )
                },
                default: () => row.url
            }
        ),
    },
    {
        title: "创建时间",
        key: "createTime",
        align: "center",
        width: 150,
    },
    {
        title: "有效期至",
        key: "expiredTime",
        align: "center",
        width: 150,
    },
    {
        title: "订单金额",
        key: "orderPrice",
        align: "center"
    },
    {
        title: "状态",
        key: "statusDesc",
        align: "center"
    },
    {
        title: "操作",
        key: 'Action',
        align: "center",
        width: 400,
        render: (row) => {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '80px', marginRight: '10px' },
                        onClick: () => copyLink([row.url])
                    },
                    { default: () => '复制链接' }
                ),
                h(
                    NPopconfirm,
                    {
                        negativeText: '取消',
                        positiveText: '确定',
                        positiveButtonProps: {
                            size: 'tiny',
                            color: 'red',
                            bordered: true,
                        },
                        negativeButtonProps: {
                            size: 'tiny',
                            bordered: true,
                        },
                        onPositiveClick: async () => {
                            const { code, msg } = await replaceCodeApi({ shortCode: row.shortCode })
                            code === 0 ? message.success("删除成功") : message.error(msg)
                        }
                    },
                    {
                        trigger: () => {
                            return h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'info',
                                    style: { width: '80px', marginRight: '10px' },
                                },
                                { default: () => '重置链接' }
                            )
                        },
                        default: () => '确认重置该链接?'
                    }
                ),
                h(
                    NPopconfirm,
                    {
                        negativeText: '取消',
                        positiveText: '确定',
                        positiveButtonProps: {
                            size: 'tiny',
                            color: 'red',
                            bordered: true,
                        },
                        negativeButtonProps: {
                            size: 'tiny',
                            bordered: true,
                        },
                        onPositiveClick: async () => {
                            const { code, msg } = await deleteCodeApi({ shortCode: row.shortCode })
                            code === 0 ? message.success("删除成功") : message.error(msg)
                        }
                    },
                    {
                        trigger: () => {
                            return h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'error',
                                    style: { width: '80px', marginRight: '10px' },
                                },
                                { default: () => '删除' }
                            )
                        },
                        default: () => '确认删除该链接?'
                    }
                ),
            ]
        }
    }
]
</script>

<template>
    <n-card class="link-manage-box" :bordered="false">
        <n-card :bordered="false">
            <n-form inline>
                <n-grid x-gap="12" :cols="4">
                    <n-gi>
                        <n-form-item>
                            <n-input v-model:value="linkForm.phone" placeholder="请输入手机号" clearable />
                        </n-form-item>
                    </n-gi>
                    <n-gi>
                        <n-form-item>
                            <n-input v-model:value="linkForm.couponName" placeholder="请输入劵名称" clearable />
                        </n-form-item>
                    </n-gi>
                    <n-gi>
                        <n-form-item>
                            <n-input v-model:value="linkForm.couponPrice" placeholder="请输入劵金额" clearable />
                        </n-form-item>
                    </n-gi>
                    <n-gi>
                        <n-form-item>
                            <n-select v-model:value="linkForm.status" placeholder="全部" :options="options" clearable />
                        </n-form-item>
                    </n-gi>
                    <n-gi>
                        <n-form-item>
                            <n-input v-model:value="linkForm.url" placeholder="请输入劵金额" clearable />
                        </n-form-item>
                    </n-gi>
                    <n-gi :offset="2">
                        <n-form-item>
                            <n-button type="info" @click="getShortCode"> 搜索</n-button>
                            <n-button type="info" @click="openExportModal"> 导出 </n-button>
                            <n-button type="info" @click="bacthCopy"> 批量复制 </n-button>
                        </n-form-item>
                    </n-gi>
                </n-grid>
            </n-form>
        </n-card>
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false" :max-height="450"
                :loading="tableDataLoading" :row-key="(rowData) => rowData.shortCode" :checked-row-keys="selectRowsKey"
                @update:checked-row-keys="changeRowsSlect" />
            <n-pagination v-model:page="linkForm.pageNo" v-model:page-size="linkForm.pageSize" :page-count="pageCount"
                size="medium" :page-sizes="[10, 20, 50, 100]" show-size-picker @update:page-size="pageSizeChange"
                @update:page="pageChange" style="justify-content: flex-end;margin-top: 10px;" />
        </n-card>

        <n-modal v-model:show="exportModal">
            <n-card style="width: 600px" preset="card" title="导出链接" :bordered="false" :mask-closable="false">
                <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px">
                    <!-- <n-input v-model:value="bindForm.bindCaptcha" clearable placeholder="请输入验证码" style="width: 55%;" />
                    <n-button type="info" style="width: 40%;" @click="getCode(1)"
                        :disabled="countDown !== 60 && countDown !== 0">
                        <span v-show="countDown > 0">获取验证码({{ countDown }})</span>
                        <span v-show="countDown === 0">重新获取验证码</span>
                    </n-button> -->
                </div>
                <n-form ref="exportFormRef" :model="exportForm" :rules="rules" label-placement="left" label-width="auto"
                    require-mark-placement="right-hanging" size="small" :style="{ maxWidth: '640px', }">
                    <n-form-item label="请选择查询的手机号" path="userUidId">
                        <n-select v-model:value="exportForm.userUidId" placeholder="请输入手机号" :options="exportOptions"
                            filterable remote clearable :loading="selectLoading" @search="handleSearch" />
                    </n-form-item>
                    <n-form-item label="请选择要导出的链接状态" path="status">
                        <n-select v-model:value="exportForm.status" placeholder="全部" :options="options" clearable />
                    </n-form-item>
                    <n-form-item label="请选择链接使用时间范围" path="useTime">
                        <n-date-picker v-model:value="exportForm.useTime" type="datetimerange" clearable
                            start-placeholder="开始日期时间" end-placeholder="结束日期时间" />
                    </n-form-item>
                    <n-form-item label="请选择链接创建时间范围" path="createTime">
                        <n-date-picker v-model:value="exportForm.createTime" type="datetimerange" clearable
                            start-placeholder="开始日期时间" end-placeholder="结束日期时间" />
                    </n-form-item>
                </n-form>
                <n-space style="margin-top: 10px;justify-content: space-around ;">
                    <n-button type="info" style="width: 400px;" @click="exportExcel">导出</n-button>
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
.link-manage-box {
    .n-card__content {
        .n-form {
            .n-form-item {
                .n-button {
                    width: 100px;
                    margin: 0px 10px;
                }
            }
        }
    }
}
</style>