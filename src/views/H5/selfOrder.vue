<script setup lang="ts" name="SelfOrder">
import HamBurger from '@/assets/H5/HamBurger.png'
import ShopBag from "@/assets/H5/ShopBag.png"
import StoreDining from "@/assets/H5/StoreDining.png"
import { infoListApi, orderCreateApi, salesSceneApi,createAllApi } from "@/api/storeApi"
import { Store } from "@/store";

const { user, order } = Store();

const router = useRouter()

const onClickLeft = () => router.push(`/h5?code=${user.code}`)

const pickupType = ref<number>(1)

const preOrder = () => {
    showDialog({
        title: '确认下单么?',
        showCancelButton: true,
    }).then(() => {
        getOrderCreate()
    }).catch(() => { })
}

//创建订单 
const getOrderCreate = async () => {
    const entriesList = Object.entries(order.orderInfo);
    if (entriesList.length !== info.value.length) return showToast('请全部先全部选择好规格')
    const res = await salesSceneApi({ storeCode: order.orderShop.storeCode })
    const list: any = []
    let paramSkuType = '';
    entriesList.forEach(([key, val]:[any, any]) => {
        let productObj: any = {
            goodsType: info.value[key].goodsType,
            items: []
        }
        paramSkuType = val[0].skuType
        val.forEach((item: any) => {
            item.itemsList.forEach((itm: any) => {
                if (itm.isDefault === 'Y') {
                    const obj: any = {
                        groupId: item.id,
                        posCode: itm.postCode,
                        qty: itm.quantity,
                        rowId: itm.rowId,
                        skuCode: itm.skuId,
                        skuName: itm.skuName,
                        unitPrice: itm.unitPrice,
                        tasteList: [],
                    };
                    if (itm.tasteList.length > 0) {
                        itm.tasteList.forEach((e: any) => {
                            if (e.choosed) {
                                obj.tasteList.push({
                                    attributeId: e.attributeId,
                                    id: e.id,
                                    isDrink: e.isDrink,
                                    isPush: e.isPush,
                                    mainImageUrl: e.mainImageUrl,
                                    posCode: e.posCode,
                                    quantity: e.quantity,
                                    skuId: e.skuId,
                                    skuName: e.skuName,
                                    sort: itm.sort,
                                    unitPrice: e.unitPrice
                                })
                            }
                        });
                    }
                    productObj.items.push(obj);
                }
            })
        });
        list.push(productObj)
    })
    const params = {
        products: list,
        salesScene: res.data,
        storeCode: order.orderShop.storeCode,
        storeName: order.orderShop.storeName,
        pickupType: pickupType.value,
        skuType: paramSkuType
    }
    const { code, data, msg } = await createAllApi(params)
    if (code === 0) {
        router.push({ name: 'H5-orderDetail' })
    } else {
        showToast(msg)
    }
}

const selectSpecification = (info: { imgUrl: string, name: string, goodsType: string }, index: number) => {
    order.saveOrderGoods({ ...info, num: index })
    router.push({ name: 'H5-customized' })
}

const info = ref<{ imgUrl: string, name: string, goodsType: string }[]>([])

const getGoodsInfo = async () => {
    const { code, data } = await infoListApi()
    if (code === 0) {
        info.value = data
    }
}


onMounted(() => {
    getGoodsInfo()
})
</script>

<template>
    <div class="self-order-box">
        <van-nav-bar title="自选套餐" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div class="ordering-way">
            <div :class="{ active: pickupType === 1 }" @click="pickupType = 1">
                <van-icon :name="StoreDining" size="1.5rem" />
                <p>堂食用餐</p>
            </div>
            <div :class="{ active: pickupType === 2 }" @click="pickupType = 2">
                <van-icon :name="ShopBag" size="1.5rem" />
                <p>打包自提</p>
            </div>
        </div>
        <div class="ordering">
            <div class="foods">
                <div class="active" v-for="(item, index) in info" :key="index">
                    <div class="name">
                        <van-image width="60" height="60" :src="item.imgUrl" />
                        <p>{{ item.name }}</p>
                    </div>
                    <div class="specifications" @click="selectSpecification(item, index)">
                        选规格
                    </div>
                </div>
            </div>
        </div>
        <van-button type="primary" class="sure-btn" round @click="preOrder">立即下单</van-button>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false
    }
}</route>

<style scoped lang="scss">
.self-order-box {
    background-color: #f2f2f2;
    height: 100vh;

    .ordering-way {
        margin: 8px 7px;
        padding: 10px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;

        .active {
            border: 2px solid rgb(54, 154, 247);
            border-radius: 5px;
        }

        div {
            padding: 8px 8px;
            width: 150px;
            color: #000000;
            display: flex;
            align-items: center;

            p {
                padding: 0px;
                margin: 0px 0px 0px .5rem;
                font-size: 1rem;
                font-weight: 600;
            }
        }
    }

    .ordering {
        margin: 8px 7px;
        padding: 10px 10px;
        background-color: #fff;
        border-radius: 10px;
        height: 68vh;
        overflow-y: scroll;

        .foods {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;

            &>div {
                width: 24%;
                height: 7rem;
                display: inline-block;
                margin: 0px 10px;

                .name {
                    padding: 0rem .5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    p {
                        font-size: .8rem;
                        width: 100%;
                        margin: 0px;
                        padding: 0px;
                        white-space: nowrap;
                        overflow-x: scroll;
                    }
                }

                .specifications {
                    font-size: 0.8rem;
                    text-align: center;
                    height: 1.6rem;
                    line-height: 1.6rem;
                    background-color: #369af7;
                    border: 1px solid #0051eb;
                    margin: 2px 2px;
                }
            }

            .active {
                border: 2px solid rgb(54, 154, 247);
                border-radius: 5px;
            }
        }
    }

    .sure-btn {
        position: fixed;
        bottom: 10px;
        width: 90%;
        margin: 0px 20px;
    }

}
</style>