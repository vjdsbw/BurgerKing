<script setup lang="ts" name="SelfOrder">
import HamBurger from '@/assets/H5/HamBurger.png'
import ShopBag from "@/assets/H5/ShopBag.png"
import StoreDining from "@/assets/H5/StoreDining.png"
import { goodInfoApi, promotionCalculateApi, orderCalculateApi, orderCreateApi, salesSceneApi } from "@/api/storeApi"
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
        getPromotionCalculate()
    }).catch(() => {
        console.log('点击了取消')
    })
}

const assemble = () => {
    const list: any = []
    order.orderInfo.forEach((item: any) => {
        if (item.roundName !== '选择饮料') {
            item.itemsList.forEach((itm: any) => {
                if (itm.isDefault === 'Y') {
                    const obj: any = {
                        quantity: itm.quantity,
                        rowId: itm.rowId,
                        skuId: itm.skuId,
                        skuName: itm.skuName,
                        unitPrice: itm.unitPrice,
                        sides: []
                    }
                    itm.tasteList.forEach((e: any) => {
                        if (e.choosed) {
                            obj.sides.push({
                                quantity: e.quantity,
                                skuId: e.skuId,
                                skuName: e.skuName,
                                unitPrice: e.unitPrice
                            })
                        }
                    });
                    list.push(obj);
                }
            })
        }
    });
    return list
}

//优惠计算
const getPromotionCalculate = async () => {
    const params = {
        setProducts: assemble(),
        storeName: order.orderShop.storeName,
        storeSn: order.orderShop.storeCode
    }
    const { code, data } = await promotionCalculateApi(params)
    if (code === 0) {
        getOrderCalculate()
    } else {
        showToast(msg)
    }
}

//订单计算 
const getOrderCalculate = async () => {
    const params = {
        setProducts: assemble(),
        storeName: order.orderShop.storeName,
        storeSn: order.orderShop.storeCode
    }
    const { code, data, msg } = await orderCalculateApi(params)
    if (code === 0) {
        getOrderCreate()
    } else {
        showToast(msg)
    }

}

//创建订单 
const getOrderCreate = async () => {
    const res = await salesSceneApi({ storeCode: order.orderShop.storeCode })
    const list: any = []
    order.orderInfo.forEach((item: any) => {
        item.itemsList.forEach((itm: any) => {
            if (itm.isDefault === 'Y') {
                const obj: any = {
                    qty: itm.quantity,
                    skuCode: itm.skuId,
                    skuName: itm.skuName,
                    unitPrice: itm.unitPrice,
                    groupId: item.id,
                    productsItemsAtts: [],
                    productsItemsItems: [],
                    posCode: itm.postCode
                };
                if (item.roundName === '选择饮料' && itm.drinkList.length > 0) {
                    itm.drinkList.forEach((e: any) => {
                        if (e.choosed) {
                            obj.productsItemsAtts.push({
                                code: e.attributeId,
                                id: e.id,
                                name: e.skuName,
                                posCode: e.postCode,
                                pushPos: e.isPush
                            })
                        }
                    });
                    if (obj.productsItemsAtts.length === 0) {
                        obj.productsItemsAtts.push({
                            code: itm.drinkList[0].attributeId,
                            id: itm.drinkList[0].id,
                            name: itm.drinkList[0].skuName,
                            posCode: itm.drinkList[0].postCode,
                            pushPos: itm.drinkList[0].isPush
                        })
                    }
                }
                if (item.roundName !== '选择饮料' && itm.tasteList.length > 0) {
                    itm.tasteList.forEach((e: any) => {
                        if (e.choosed) {
                            obj.productsItemsItems.push({
                                posCode: e.posCode,
                                // qty: e.quantity,
                                skuCode: e.skuId,
                                skuName: e.skuName,
                                // unitPrice: e.unitPrice
                            })
                        }
                    });
                }
                list.push(obj);
            }
        })
    });
    const params = {
        productsItems: list,
        salesScene: res.data,
        storeCode: order.orderShop.storeCode,
        pickupType: pickupType.value,
        skuType: order.orderInfo[0].skuType
    }
    const { code, data,msg } = await orderCreateApi(params)
    if (code === 0) {
        router.push({ name: 'H5-orderDetail' })
    }else{
        showToast(msg)
    }
}

const selectSpecification = () => {
    router.push({ name: 'H5-customized' })
}

const info = ref<{ imgUrl: string, name: string }>({ imgUrl: "", name: "" })

const getGoodsInfo = async () => {
    const { code, data } = await goodInfoApi()
    if (code === 0) {
        info.value = data
    }
}

//
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
                <div class="active">
                    <div class="name">
                        <van-image width="60" height="60" :src="info.imgUrl" />
                        <p>{{ info.name }}</p>
                    </div>
                    <div class="specifications" @click="selectSpecification">
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

                .name {
                    padding: 0rem .5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    p {
                        font-size: .8rem;
                        margin: 0px;
                        padding: 0px;
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