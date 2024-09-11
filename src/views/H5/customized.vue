<script setup lang="ts" name="Customized">
import mySwipe1 from '@/assets/H5/mySwipe1.png';
import mySwipe2 from '@/assets/H5/mySwipe2.png';
import HamBurger from '@/assets/H5/HamBurger.png';
import Drumsticks from '@/assets/H5/Drumsticks.png';
import CocaCola from '@/assets/H5/CocaCola.png'
import { goodDetailApi } from "@/api/storeApi"

import { Store } from "@/store";

const { order } = Store();

const router = useRouter();

const onClickLeft = () => history.back();

const PackageForm = ref<{ principal: number; snack: number; drink: number }>({
    principal: 0,
    snack: 0,
    drink: 0
})

const selectPackage = (item: any, itm: any) => {
    console.log(item, "xxxxxxxxxxxxxxxxxxxxx");
    if (item.saleQty === 1) {
        item.itemsList.forEach((e: any) => e.isDefault = 'N');
        itm.isDefault = 'Y';
    } else {
        let saleNum:string[] = [];
        item.itemsList.forEach((e: any) => {
            if (e.isDefault === 'Y') {
                saleNum.push(e.rowId)
            }
        });
        if (saleNum.length < item.saleQty && !saleNum.includes(itm.rowId)) {
            itm.isDefault = itm.isDefault === 'Y' ? 'N' : 'Y';
        } else if (saleNum.length <= item.saleQty && saleNum.includes(itm.rowId)) {
            itm.isDefault = itm.isDefault === 'Y' ? 'N' : 'Y';
        } else {
            const text = item.roundName.substring(item.roundName.length - 2);
            showToast(text + '最多选择' + item.saleQty + '件')
        }
    }
}


const actionSheetShow = ref<boolean>(false)

const flavor = ref<{ outNum: number, inNum: number }>({ outNum: 0, inNum: 0 })

const tasteChoice = (index: number, idx: number) => {
    actionSheetShow.value = true;
    flavor.value.outNum = index;
    flavor.value.inNum = idx;
}

const tastChange = (index: number) => {
    if (goodInfo.value[flavor.value.outNum].itemsList[flavor.value.inNum].tasteList[0].isDrink === "1") {
        goodInfo.value[flavor.value.outNum].itemsList[flavor.value.inNum].tasteList.forEach((item: any) => item.choosed = false)
        goodInfo.value[flavor.value.outNum].itemsList[flavor.value.inNum].tasteList[index].choosed = true;
    }
}

const determineTaste = () => {
    actionSheetShow.value = false;
}

const goodInfo = ref<any>([])
const selectGoods = ref<any>([])
const getGoodDetail = async () => {
    const { code, data, msg } = await goodDetailApi({ storeCode: order.orderShop.storeCode });
    if (code === 0) {
        const goodInfoList = data.map((item: any) => {
            const newObj = JSON.parse(JSON.stringify(item));
            newObj.itemsList.forEach((itm: any) => {
                itm.tasteList = itm.tasteList.map((it: any) => ({ ...it, choosed: false }));
            });
            return newObj;
        });
        goodInfo.value = goodInfoList;
    } else {
        showToast(msg);
    }
}

const preOrder = () => {
    order.saveOrderInfo(goodInfo.value)
    let pass = true
    let showMsg = ''
    goodInfo.value.forEach((item: any) => {
        let skuIdList = []
        item.itemsList.forEach((itm: any) => {
            if (itm.isDefault === 'Y') {
                skuIdList.push(itm.skuId)
            }
        })
        if (item.saleQty !== skuIdList.length) {
            pass = false
            showMsg = item.roundName.substring(item.roundName.length - 2) + '最多选择' + item.saleQty + '件';
        }
    });
    if (pass) {
        router.push({
            name: "H5-selfOrder",
        })
    } else {
        showToast(showMsg)
    }
}


onMounted(() => {
    getGoodDetail()
})

</script>

<template>
    <div class="customized-box">
        <van-nav-bar title="自选规格" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#369af7" height="170">
            <van-swipe-item>
                <van-image width="100%" height="100%" :src="mySwipe1" />
            </van-swipe-item>
            <van-swipe-item>
                <van-image width="100%" height="100%" :src="mySwipe2" />
            </van-swipe-item>
        </van-swipe>
        <div class="staple">
            <div class="bill" v-for="(item, index) in goodInfo" :key="item.round">
                <h4>{{ item.roundName }} <span v-show="item.optionGroupName">({{ item.optionGroupName }})</span></h4>
                <div>
                    <div v-for="(itm, idx) in item.itemsList" :key="itm.rowId"
                        :class="{ active: itm.isDefault === 'Y' }" @click="selectPackage(item, itm)">
                        <div class="name">
                            <van-image width="60" height="60" :src="itm.mainImageUrl" />
                            <p>{{ itm.skuName }}</p>
                        </div>
                        <div class="specifications" @click="tasteChoice(index, idx)"
                            v-show="(itm.tasteList.length > 0) && itm.isDefault === 'Y'">
                            口味选择
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-button type="primary" class="sure-btn" round @click="preOrder">确认选择</van-button>

        <van-popup v-model:show="actionSheetShow" round closeable position="bottom" :style="{ height: '30%' }">
            <div class="popup-content">
                <h4>{{ goodInfo[flavor.outNum].itemsList[flavor.inNum].skuName }}</h4>
                <van-row gutter="20">
                    <van-col span="12" v-for="(e, index) in goodInfo[flavor.outNum].itemsList[flavor.inNum].tasteList"
                        :key="e.id">
                        <van-checkbox v-model="e.choosed" @click="tastChange(index)">{{ e.skuName }}</van-checkbox>
                    </van-col>
                </van-row>
                <van-button type="primary" class="popup-content-btn" round @click="determineTaste">确定口味</van-button>
            </div>

        </van-popup>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false
    }
}</route>

<style scoped lang="scss">
.customized-box {
    background-color: #f2f2f2;
    height: 100vh;

    .staple {
        margin: 8px 7px;
        padding: 10px 10px;
        background-color: #fff;
        border-radius: 10px;
        height: calc(100vh - 307px);
        overflow-y: scroll;

        .bill {

            h4 {
                padding: .5rem 0px;
                margin: 0px 0px;

                span {
                    font-size: 1rem;
                    color: grey;
                }
            }

            &>div {
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
                            overflow-x: scroll;
                            text-align: center;
                            width: 100%;
                            white-space: nowrap;

                            &::-webkit-scrollbar {
                                display: none;
                            }
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
    }

    .sure-btn {
        position: fixed;
        bottom: 10px;
        width: 90%;
        margin: 0px 20px;
    }

    .popup-content {
        margin: .5rem .5rem;
        height: 90%;
        position: relative;

        h4 {
            margin: 0px 0px .2rem 0px;
        }

        .popup-content-btn {
            width: 100%;
            position: absolute;
            bottom: 0px;
        }
    }

}
</style>