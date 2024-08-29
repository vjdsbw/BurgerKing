<script setup lang="ts" name="Account-Manage">
import { userListApi, balanceApi, verifyCodeApi, bindApi, reloginApi, deleteApi } from "@/api/couponsManger";
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { CloseCircleOutline } from '@vicons/ionicons5';
import { NPopover, useMessage } from 'naive-ui'

const message = useMessage()

interface Row {
    bindTime: string
    loginResult: string
    orderCount: string
    phone: string
    userUidId: number
}

const rowInfo = ref<Row>({
    bindTime: "",
    loginResult: "",
    orderCount: "",
    phone: "",
    userUidId: 0
});

const tableData = ref<Row[]>([])

const phone = ref<string>('')
const pagesize = ref<number>(10)
const pagenum = ref<number>(1)
const totalNum = ref<number>(0)
const pageCount = ref<number>(0)
const balance = ref<number>(0);

const bindModal = ref<boolean>(false)
const bindForm = ref<{ bindPhone: string; bindCaptcha: string }>({ bindPhone: '', bindCaptcha: '' })

const countDown = ref<number>(60);

const getCode = async (num: number) => {
    if (!bindForm.value.bindPhone) return message.warning('请填写手机号')
    countDown.value = 59
    let params = {
        mobile: bindForm.value.bindPhone,
        queryType: num,
    }
    await verifyCodeApi(params)
    startCountDown()
}

const startCountDown = () => {
    const inter = setInterval(() => {
        countDown.value--;
        if (countDown.value == 0) {
            clearInterval(inter);
        }
    }, 1000);
    return () => clearInterval(inter);
}

const bindSure = async () => {
    if (!bindForm.value.bindPhone) return message.warning('请填写手机号')
    if (!bindForm.value.bindCaptcha) return message.warning('请填写验证码')
    const { code, data, msg } = await bindApi({ mobile: bindForm.value.bindPhone, verifyCode: bindForm.value.bindCaptcha })
    if (code === 0) {
        message.success('绑定成功')
        bindForm.value.bindPhone = '';
        bindForm.value.bindCaptcha = ''
        bindModal.value = false
    } else {
        message.error(msg)
    }
}

const reLoginModal = ref<boolean>(false)

const reLogin = async () => {
    if (!bindForm.value.bindCaptcha) return message.warning('请填写验证码')
    const { code, data, msg } = await reloginApi({ userUidId: rowInfo.value.userUidId, verifyCode: bindForm.value.bindCaptcha })
    if (code === 0) {
        message.success('重新登陆成功')
        bindForm.value.bindPhone = '';
        bindForm.value.bindCaptcha = ''
        reLoginModal.value = false
    } else {
        message.error(msg)
    }
}

const getUserList = async () => {
    const params = {
        pageNo: pagenum.value,
        pageSize: pagesize.value,
        phone: phone.value,
    }
    const res: any = await userListApi(params)
    tableData.value = res.dataList;
    totalNum.value = res.totalCount;
    pageCount.value = res.pageCount
}

const pageSizeChange = (pageSize: number) => {
    pagesize.value = pageSize
    pagenum.value = 1;
    getUserList()
}

const pageChange = (page: number) => {
    pagenum.value = page;
    getUserList()
}

onMounted(() => {
    getUserList()
})

const columns: DataTableColumns<Row> = [
    {
        title: "序号",
        key: "userUidId",
        align: "center",
        render: (_rowData: object, rowIndex: number) => {
            return (pagenum.value - 1) * pagesize.value + rowIndex + 1
        }
    },
    {
        title: "手机号",
        key: "phone",
        align: "center"
    },
    {
        title: "绑定时间",
        key: "bindTime",
        align: "center"
    },
    {
        title: "已下单数量",
        key: "orderCount",
        align: "center"
    },
    {
        title: "登录状态",
        key: "loginResult",
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
                    NPopover,
                    {
                        trigger: 'click'
                    },
                    {
                        trigger: () => {
                            return h(
                                NButton,
                                {
                                    size: 'small',
                                    type: 'info',
                                    style: { width: '80px', marginRight: '10px' },
                                    onClick: async () => {
                                        const { code, data } = await balanceApi({ userUidId: row.userUidId })
                                        if (code === 0) {
                                            balance.value = data
                                        }
                                    }
                                },
                                { default: () => '余额查询' }
                            )
                        },
                        default: () => `当前账户余额${balance.value}`
                    }
                ),
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '80px', marginRight: '10px' },
                        onClick: () => {
                            rowInfo.value = row;
                            reLoginModal.value = true;
                        }
                    },
                    { default: () => '重新登录' }
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
                        onPositiveClick: async (e: any) => {
                            const { code, msg } = await deleteApi({ userUidId: row.userUidId })
                            if (code === 0) {
                                message.success("删除成功")
                            } else {
                                message.error(msg)
                            }
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
                        default: () => '确认删除该账号?'
                    }
                ),
            ]
        }
    }
]

</script>

<template>
    <n-card class="account-manage" :bordered="false">
        <n-card :bordered="false">
            <n-form inline>
                <n-form-item>
                    <n-input v-model:value="phone" placeholder="请输入手机号" clearable />
                </n-form-item>
                <n-form-item>
                    <n-button type="info" style="width: 100px;" @click="getUserList"> 搜索 </n-button>
                </n-form-item>
                <n-form-item>
                    <n-button type="info" style="width: 100px;" @click="bindModal = true"> 绑定新账号 </n-button>
                </n-form-item>
            </n-form>
        </n-card>
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false" />
            <n-pagination v-model:page="pagenum" v-model:page-size="pagesize" :page-count="pageCount" size="medium"
                :page-sizes="[10, 20, 50, 100]" show-size-picker @update:page-size="pageSizeChange"
                @update:page="pageChange" style="justify-content: flex-end;margin-top: 10px;" />
        </n-card>
        <n-modal v-model:show="bindModal">
            <n-card style="width: 400px" preset="card" title="绑定新账号" :bordered="false" :mask-closable="false">
                <n-input v-model:value="bindForm.bindPhone" clearable placeholder="请输入手机号" />
                <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px">
                    <n-input v-model:value="bindForm.bindCaptcha" clearable placeholder="请输入验证码" style="width: 55%;" />
                    <n-button type="info" style="width: 40%;" @click="getCode(0)"
                        :disabled="countDown !== 60 && countDown !== 0">
                        <span v-show="countDown > 0">获取验证码({{ countDown }})</span>
                        <span v-show="countDown === 0">重新获取验证码</span>
                    </n-button>
                </div>
                <n-space style="margin-top: 10px;justify-content: space-around ;">
                    <n-button type="tertiary" style="width: 100px;" @click="bindModal = false">取消</n-button>
                    <n-button type="info" style="width: 100px;" @click="bindSure">绑定</n-button>
                </n-space>
            </n-card>
        </n-modal>

        <n-modal v-model:show="reLoginModal">
            <n-card style="width: 400px" preset="card" title="重新登陆" :bordered="false" :mask-closable="false">
                <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 10px">
                    <n-input v-model:value="bindForm.bindCaptcha" clearable placeholder="请输入验证码" style="width: 55%;" />
                    <n-button type="info" style="width: 40%;" @click="getCode(1)"
                        :disabled="countDown !== 60 && countDown !== 0">
                        <span v-show="countDown > 0">获取验证码({{ countDown }})</span>
                        <span v-show="countDown === 0">重新获取验证码</span>
                    </n-button>
                </div>
                <n-space style="margin-top: 10px;justify-content: space-around ;">
                    <n-button type="tertiary" style="width: 100px;" @click="reLoginModal = false">取消</n-button>
                    <n-button type="info" style="width: 100px;" @click="reLogin">登录</n-button>
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

<style scoped lang="scss"></style>