<script setup lang="ts" name="My-coupons">
import { myListApi, listByPhoneApi, batchGenApi, goodsDetailApi } from "@/api/couponsManger";
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { CloseCircleOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui'

const message = useMessage()

interface Row {
    couponId: string,
    couponName: string,
    currentPrice: string,
    description: string,
    promotionData: string,
    num: number,
    sellType: number;
    skuCode: string;
}

const phone = ref<number | null>(null)

const tableData = ref<Row[]>([])

const showModal = ref<boolean>(false)
const description = ref<string>()
const viewDetail = (row: Row) => {
    showModal.value = true;
    description.value = row.description
}


const selectLoading = ref<boolean>(false)

const linkModal = ref<boolean>(false);

const linkForm = ref<{ num: number; duration: number, confined: number, limitPrice: number }>({ num: 1, duration: 7, confined: 1, limitPrice: 1 });

const generalOptions = ref<{ label: string; phone: string; value: number }[]>([])

const rules: FormRules = {
    num: [{ required: true, message: '请输入数量', }],
    duration: [{ required: true, message: '请输入有效期', }],
    limitPrice: [{ required: true, message: '请输入价格', }],
    confined: [{ required: true, message: '请选择是否限定', }],
}

const linkList = ref<string[]>([''])

const createLink = async () => {
    let obj: any = {}
    goodsInfo.value.forEach((item: any) => {
        obj[item.optionGroupId] = { showY: [], showN: [] }
        item.itemsList.forEach((itm: any) => {
            if (itm.isDefault === 'Y') {
                obj[item.optionGroupId].showY.push(itm.skuId)
            } else {
                obj[item.optionGroupId].showN.push(itm.skuId)
            }
        })
    })
    const params = {
        couponId: rowInfo.value.couponId,
        currentPrice: rowInfo.value.currentPrice,
        sellType: rowInfo.value.sellType,
        validDay: linkForm.value.duration,
        num: linkForm.value.num,
        isLimit: linkForm.value.confined,
        limitPrice: linkForm.value.limitPrice,
        goodsSource: 1,
        userUidId: phone.value,
        goodsList: JSON.stringify(obj)
    }
    const { code, data, msg } = await batchGenApi(params)
    if (code === 0) {
        message.success("创建成功")
        linkList.value = data;
        couponList()
    } else {
        message.error(msg)
    }
}

const copyLink = () => {
    const copyText = linkList.value.join('\n')
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

const tableLoading = ref<boolean>(false)
const couponList = async () => {
    if (!phone.value) return message.warning('请先选择账号')
    tableLoading.value = true
    const { code, data, msg } = await myListApi({ userUidId: phone.value })
    if (code === 0) {
        tableData.value = data
    } else {
        message.warning(msg)
    }
    tableLoading.value = false
}

const phoneList = ref<{ label: string, phone: string, value: number }[]>([])
const getPhoneList = async () => {
    const { code, data, msg } = await listByPhoneApi({});
    if (code === 0) {
        phoneList.value = data.map((item: any) => ({ label: item.phone, phone: item.phone, value: item.userUidId }))
    } else {
        message.warning(msg)
    }
}

onMounted(() => {
    getPhoneList()
})

const rowInfo = ref<Row>({
    couponId: "",
    couponName: "",
    currentPrice: "",
    description: "",
    promotionData: "",
    skuCode: "",
    sellType: 0,
    num: 0,
});

const goodsInfo = ref<any>([])
const defaultCheck = ref<any>({})

const checKboxChange = (val: any, goods: any) => {
    goods.itemsList.forEach((element: any) => {
        if (val.includes(element.skuId)) {
            element.isDefault = 'Y'
        } else {
            element.isDefault = 'N'
        }
    });
    console.log(goods.itemsList)
}

const columns: DataTableColumns<Row> = [
    {
        title: "序号",
        key: "couponId",
        align: "center",
        render: (_rowData: Row, rowIndex: number) => {
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
        title: "可用数量",
        key: "num",
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
                    { default: () => '劵详情' }
                ),
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px' },
                        disabled: row.num === 0,
                        onClick: async () => {
                            const { code, data, msg } = await goodsDetailApi({ sellType: row.sellType, skuCode: row.skuCode })
                            if (code === 0) {
                                data.forEach((e: any) => {
                                    defaultCheck.value[e.optionGroupId] = [];
                                    e.itemsList.forEach((itm: any) => {
                                        if (itm.isShow === '1') {
                                            defaultCheck.value[e.optionGroupId].push(itm.skuId)
                                        }
                                    })
                                })
                                rowInfo.value = row;
                                goodsInfo.value = data;
                                linkList.value.length = 0;
                                linkForm.value.limitPrice = Number(row.currentPrice)
                                linkModal.value = true;
                            } else {
                                message.error(msg)
                            }

                        }
                    },
                    { default: () => '创建链接' }
                ),
            ]
        }
    }
]
</script>

<template>
    <n-card class="my-coupons-box" :bordered="false">
        <n-card :bordered="false">
            <n-form inline label-placement="left">
                <n-form-item>
                    <n-select v-model:value="phone" placeholder="请选择账号" :options="phoneList" filterable remote clearable
                        :loading="selectLoading" @update:value="couponList" />
                </n-form-item>
            </n-form>
        </n-card>
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false" :loading="tableLoading"
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
            <n-card style="width: 800px" preset="card" :title="linkList.length === 0 ? '创建链接' : '创建完成'"
                :bordered="false" :mask-closable="false">
                <div v-if="linkList.length === 0">
                    <n-form ref="formRef" :model="linkForm" :rules="rules" label-placement="left" label-width="auto"
                        require-mark-placement="right-hanging">
                        <n-form-item label="输入数量" path="num">
                            <n-input-number clearable v-model:value="linkForm.num" :min="1" :max="rowInfo.num" />
                        </n-form-item>
                        <n-form-item label="有效期(天)" path="duration">
                            <n-input-number clearable v-model:value="linkForm.duration" :min="1" />
                        </n-form-item>
                        <n-form-item label="限定价格(元)" path="limitPrice">
                            <n-input-number clearable v-model:value="linkForm.limitPrice" :min="1" />
                        </n-form-item>
                        <n-form-item label="是否限定商品" path="confined">
                            <n-radio-group v-model:value="linkForm.confined">
                                <n-radio :value="0">否</n-radio>
                                <n-radio :value="1">是</n-radio>
                            </n-radio-group>
                        </n-form-item>
                        <div class="my-coupons-box-goods-box">
                            <n-form-item v-show="linkForm.confined === 1" v-for="item in goodsInfo" :key="item.id"
                                :label="item.roundName">
                                <n-checkbox-group :min="item.saleQty" :default-value="defaultCheck[item.optionGroupId]"
                                    @update:value="(val) => checKboxChange(val, item)">
                                    <n-space v-for="itemInfo in item.itemsList" :key="itemInfo.skuId"
                                        style="display: inline-block;margin: 0px 10px">
                                        <n-checkbox :value="itemInfo.skuId"></n-checkbox>
                                        <div class="my-coupons-box-goods-select">
                                            <n-image width="70" height="50" :src="itemInfo.mainImageUrl" />
                                            <n-scrollbar x-scrollable style="white-space: nowrap; width: 100px;">{{
                                                itemInfo.skuName }}</n-scrollbar>
                                            <div> {{ itemInfo.unitPrice }}元</div>
                                        </div>
                                    </n-space>
                                </n-checkbox-group>
                            </n-form-item>
                        </div>
                    </n-form>
                    <n-space reverse>
                        <n-button type="info" @click="createLink">确认</n-button>
                        <n-button type="tertiary" @click="linkModal = false">取消</n-button>
                    </n-space>
                </div>
                <div v-else>
                    <div style="height: 200px;overflow-y: scroll;">
                        <div v-for="item in linkList" :key="item">{{ item }}</div>
                    </div>
                    <n-button type="info" @click="copyLink" style="margin-top: 10px;width: 100%;">点击复制</n-button>
                </div>
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
.my-coupons-box {
    background-color: white;
}

.my-coupons-box-goods-box {
    height: 300px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    /* IE 10+ */
    scrollbar-width: none;

    /* Firefox */
    & ::-webkit-scrollbar {
        display: none;
        /* Chrome Safari */
    }

    .my-coupons-box-goods-select {
        display: flex;
        flex-direction: column;
        align-items: center;

        .name {
            width: 100px;
            overflow-x: scroll;
            white-space: nowrap;
            overflow-x: scroll;
        }
    }
}
</style>