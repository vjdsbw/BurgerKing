<script setup lang="ts" name="Merchandise-Manager">
import { storeListApi, storeMenuApi, goodsDetailApi, listByPhoneApi, packageListApi, batchGenForProductApi } from "@/api/couponsManger"
import { useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'

const message = useMessage()

interface Store {
    address: string
    busiTime: string
    distance: string
    status: string
    statusCode: number | null
    storeCode: string
    storeName: string
}
interface Product {
    description: string
    groupCode: string
    imageUrl: string
    menuId: string
    name: string
    productCode: string
    productType: string
    sellType: number
    skuCodes: string
    storeMenuClassId: number,
    unitPrice: number
}
interface MenuCoupon {
    className: string
    imageUrl: string
    menuId: string
    products: Product[]
    sellType: number
    timeInterval: string
}

interface CouponOpt {
    couponId: string,
    couponName: string,
    currentPrice: string,
    description: string,
    promotionData: string,
    num: number,
    sellType: number;
    skuCode: string;
    urlNum?: number;
}

const selectLoading = ref<boolean>(false)

const storeOptions = ref<Store[]>([])

const handleSearch = async (value: string) => {
    selectLoading.value = true
    const { code, data } = await storeListApi({ storeName: value })
    if (code === 0) {
        storeOptions.value = data
    }
    selectLoading.value = false
}

const selectStore = ref<string | null>(null)
const menuOptions = ref<MenuCoupon[]>([])
const selectChange = async (value: string) => {
    selectStore.value = value
    getStorMenu({ storeCode: value })
}

const getStorMenu = async (params: { storeCode?: string }) => {
    const { code, data, msg } = await storeMenuApi(params)
    if (code === 0) {
        menuOptions.value = data
    } else {
        message.error(msg)
    }
}
const tableData = ref<Product[]>([])

const menuChange = (_value: string, option: MenuCoupon) => {
    tableData.value = option.products;
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
    getStorMenu({})
    getPhoneList()
})

const couponOption = ref<CouponOpt[]>([])

const couponList = async (value: number) => {
    let params: any = {
        userUidId: value
    }
    if (selectStore.value) {
        params.storeCode = selectStore.value
    }
    const { code, data, msg } = await packageListApi(params)
    if (code === 0) {
        couponOption.value = data
    } else {
        message.warning(msg)
    }
}

const couponChange = async (_value: string, option: CouponOpt) => {
    linkForm.value.currentPrice = option.currentPrice
    const { code, data, msg } = await goodsDetailApi({ sellType: option.sellType, skuCode: option.skuCode })
    if (code === 0) {
        data.forEach((e: any) => {
            const key = e.optionGroupId + '-' + e.id
            defaultCouponCheck.value[key] = [];
            e.itemsList.forEach((itm: any) => {
                if (itm.isShow === '1') {
                    defaultCouponCheck.value[key].push(itm.skuId)
                }
            })
        })
        goodsCoupon.value = data;
    } else {
        message.error(msg)
    }
}

const linkModal = ref<boolean>(false);

const linkList = ref<string[]>([])

const linkForm = ref<{
    phone: number | null
    duration: number
    confined: number
    limitPrice: number
    isAddCoupon: number
    selectCoupon: string | null,
    isMenuLimit: number
    couponConfined: number,
    currentPrice: string,
    num: number
}>({
    phone: null,
    duration: 7,
    confined: 1,
    limitPrice: 1,
    isAddCoupon: 1,
    selectCoupon: null,
    couponConfined: 1,
    isMenuLimit: 1,
    currentPrice: '',
    num: 1,
});

const generalOptions = ref<{ label: string; phone: string; value: number }[]>([])

const goodsInfo = ref<any>([])
const goodsCoupon = ref<any>([])
const defaultCheck = ref<any>({})
const defaultCouponCheck = ref<any>({})

const rules: FormRules = {
    phone: [{ required: true, message: '请选择手机号', }],
    duration: [{ required: true, message: '请输入有效期', }],
    limitPrice: [{ required: true, message: '请输入价格', }],
    confined: [{ required: true, message: '请选择是否限定', }],
}


const checKboxChange = (val: any, goods: any) => {
    goods.itemsList.forEach((element: any) => {
        if (val.includes(element.skuId)) {
            element.isDefault = 'Y'
        } else {
            element.isDefault = 'N'
        }
    });
}

const proInfo = ref<Product>({
    description: '',
    groupCode: '',
    imageUrl: '',
    menuId: '',
    name: '',
    productCode: '',
    productType: '',
    sellType: 0,
    skuCodes: '',
    storeMenuClassId: 0,
    unitPrice: 0
})

const columns: DataTableColumns<Product> = [
    {
        title: "序号",
        key: "couponId",
        align: "center",
        render: (row: Product) => {
            const index = tableData.value.findIndex(item => item.name === row.name)
            return index + 1
        }
    },
    {
        title: "商品名称",
        key: "name",
        align: "center"
    },
    {
        title: "商品价格",
        key: "unitPrice",
        align: "center"
    },
    {
        title: "操作",
        key: 'Action',
        align: "center",
        width: 400,
        render: (row: Product) => {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "info",
                        style: { width: '150px' },
                        onClick: async () => {
                            let params: any = {
                                sellType: row.sellType,
                                skuCode: row.skuCodes,
                                storeCode: selectStore.value
                            }
                            if (!selectStore.value) delete params.storeCode
                            const { code, data, msg } = await goodsDetailApi(params)
                            if (code === 0) {
                                data.forEach((e: any) => {
                                    const key = e.optionGroupId + '-' + e.id
                                    defaultCheck.value[key] = [];
                                    e.itemsList.forEach((itm: any) => {
                                        if (itm.isShow === '1') {
                                            defaultCheck.value[key].push(itm.skuId)
                                        }
                                    })
                                })
                                proInfo.value = row
                                goodsInfo.value = data;
                                linkList.value.length = 0;
                                linkForm.value.limitPrice = Number(row.unitPrice)
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

const creatLoading = ref<boolean>(false)
const createLink = async () => {
    creatLoading.value = true;
    let obj: any = {}
    goodsInfo.value.forEach((item: any) => {
        const key = item.optionGroupId + '-' + item.id
        obj[key] = { showY: [], showN: [] }
        item.itemsList.forEach((itm: any) => {
            if (itm.isDefault === 'Y') {
                obj[key].showY.push(itm.skuId)
            } else {
                obj[key].showN.push(itm.skuId)
            }
        })
    })
    goodsCoupon.value.forEach((item: any) => {
        const key = item.optionGroupId + '-' + item.id
        obj[key] = { showY: [], showN: [] }
        item.itemsList.forEach((itm: any) => {
            if (itm.isDefault === 'Y') {
                obj[key].showY.push(itm.skuId)
            } else {
                obj[key].showN.push(itm.skuId)
            }
        })
    })
    const params = {
        couponId: linkForm.value.selectCoupon,
        currentPrice: linkForm.value.currentPrice,
        goodsList: JSON.stringify(obj),
        goodsSource: 2,
        groupCode: proInfo.value.groupCode,
        isAddCoupon: linkForm.value.isAddCoupon,
        isLimit: linkForm.value.confined,
        limitPrice: linkForm.value.limitPrice,
        isMenuLimit: linkForm.value.isMenuLimit,
        menuGoodsImg: proInfo.value.imageUrl,
        menuGoodsName: proInfo.value.name,
        menuGoodsPrice: proInfo.value.unitPrice,
        menuId: proInfo.value.menuId,
        num: linkForm.value.num,
        productCode: proInfo.value.productCode,
        storeMenuClassId: proInfo.value.storeMenuClassId,
        userUidId: linkForm.value.phone,
        validDay: linkForm.value.duration,
    }
    const { code, data, msg } = await batchGenForProductApi(params)
    if (code === 0) {
        message.success("创建成功")
        linkList.value = data;
    } else {
        message.error(msg)
    }
    creatLoading.value = false;
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

</script>

<template>
    <n-card class="merchandise-manager-box" :bordered="false">
        <n-card :bordered="false">
            <n-space style="margin: 20px 0px;">
                <n-select placeholder="请输入门店名称" :options="storeOptions" filterable remote clearable
                    :loading="selectLoading" label-field="storeName" value-field="storeCode" @search="handleSearch"
                    @update:value="selectChange" />
                <n-select placeholder="请选择菜单类别" :options="menuOptions" remote clearable label-field="className"
                    value-field="className" style="width: 200px;" @update:value="menuChange" />
            </n-space>
        </n-card>
        <n-card :bordered="false">
            <n-data-table :columns="columns" :data="tableData" :single-line="false" :max-height="550"
                :pagination="{ pageSizes: [10, 20, 50, 100], showSizePicker: true }">
                <template #empty>
                    暂无数据
                </template>
            </n-data-table>
        </n-card>
        <n-modal v-model:show="linkModal">
            <n-card style="width: 1000px" preset="card" :title="linkList.length === 0 ? '创建链接' : '创建完成'"
                :bordered="false" :mask-closable="false">
                <div v-if="linkList.length === 0">
                    <n-form ref="formRef" :model="linkForm" :rules="rules" label-placement="left" label-width="auto"
                        require-mark-placement="right-hanging">
                        <n-grid :cols="24" :x-gap="24">
                            <n-form-item-gi :span="8" label="选择手机号" path="phone">
                                <n-select v-model:value="linkForm.phone" placeholder="请选择账号" :options="phoneList"
                                    filterable remote clearable @update:value="couponList" />
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="有效期(天)" path="duration">
                                <n-input-number clearable v-model:value="linkForm.duration" :min="1" />
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="限定价格(元)" path="limitPrice">
                                <n-input-number clearable v-model:value="linkForm.limitPrice" :min="1" />
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="生成链接数量" path="num">
                                <n-input-number clearable v-model:value="linkForm.num" :min="1" />
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="是否限定商品" path="confined">
                                <n-radio-group v-model:value="linkForm.confined">
                                    <n-radio :value="0">否</n-radio>
                                    <n-radio :value="1">是</n-radio>
                                </n-radio-group>
                            </n-form-item-gi>
                        </n-grid>
                        <div class="my-coupons-box-goods-box">
                            <n-form-item v-show="linkForm.confined === 1" v-for="item in goodsInfo" :key="item.id"
                                :label="item.roundName">
                                <n-scrollbar x-scrollable style="white-space: nowrap; width: 100%;">
                                    <n-checkbox-group :min="item.saleQty"
                                        :default-value="defaultCheck[item.optionGroupId + '-' + item.id]"
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
                                </n-scrollbar>
                            </n-form-item>
                        </div>
                        <n-grid :cols="24" :x-gap="24">
                            <n-form-item-gi :span="8" label="是否添加卡劵" path="isAddCoupon">
                                <n-radio-group v-model:value="linkForm.isAddCoupon">
                                    <n-radio :value="0">否</n-radio>
                                    <n-radio :value="1">是</n-radio>
                                </n-radio-group>
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="选择卡劵" path="selectCoupon"
                                v-show="linkForm.isAddCoupon === 1">
                                <n-select v-model:value="linkForm.selectCoupon" placeholder="请选择账号"
                                    label-field="couponName" value-field="couponId" :options="couponOption" filterable
                                    remote clearable @update:value="couponChange" />
                            </n-form-item-gi>
                            <n-form-item-gi :span="8" label="是否限定商品" path="isMenuLimit"
                                v-show="linkForm.isAddCoupon === 1">
                                <n-radio-group v-model:value="linkForm.isMenuLimit">
                                    <n-radio :value="0">否</n-radio>
                                    <n-radio :value="1">是</n-radio>
                                </n-radio-group>
                            </n-form-item-gi>
                        </n-grid>
                        <div class="my-coupons-box-goods-box">
                            <n-form-item v-show="linkForm.isAddCoupon === 1 && linkForm.isMenuLimit === 1"
                                v-for="item in goodsCoupon" :key="item.id" :label="item.roundName">
                                <n-scrollbar x-scrollable style="white-space: nowrap; width: 100%;">
                                    <n-checkbox-group :min="item.saleQty"
                                        :default-value="defaultCouponCheck[item.optionGroupId + '-' + item.id]"
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
                                </n-scrollbar>
                            </n-form-item>
                        </div>
                    </n-form>
                    <n-space reverse>
                        <n-button type="info" :loading="creatLoading" @click="createLink">确认</n-button>
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
.merchandise-manager-box {
    background-color: white;
}

.my-coupons-box-goods-box {
    margin: 10px 0px;
    height: 200px;
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

        // overflow-x: scroll;
        .name {
            width: 100px;
            overflow-x: scroll;
            white-space: nowrap;
            overflow-x: scroll;
        }
    }
}
</style>