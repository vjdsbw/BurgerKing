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
    item.itemsList.forEach((e: any) => e.isDefault = 'N');
    itm.isDefault = 'Y';
}


const actionSheetShow = ref<boolean>(false)

const flavor = ref<{ outNum: number, inNum: number }>({ outNum: 0, inNum: 0 })

const tasteChoice = (index: number, idx: number) => {
    actionSheetShow.value = true;
    flavor.value.outNum = index;
    flavor.value.inNum = idx;
}

const tastChange = (index: number) => {
    if (goodInfo.value[flavor.value.outNum].roundName === '选择饮料') {
        goodInfo.value[flavor.value.outNum].itemsList[flavor.value.inNum].drinkList.forEach(item => item.choosed = false)
        goodInfo.value[flavor.value.outNum].itemsList[flavor.value.inNum].drinkList[index].choosed = true;
    }
}

const determineTaste = () => {
    actionSheetShow.value = false;
}

const goodInfo = ref<any>([])
const getGoodDetail = async () => {
    try {
        const response = await goodDetailApi({ storeCode: order.orderShop.storeCode });
        if (response.code === 0) {
            const goodInfoList = response.data.map(item => {
                const newObj = { ...item };
                newObj.itemsList.forEach(itm => {
                    if (item.roundName === '选择饮料' && itm.drinkList.length > 0) {
                        itm.drinkList = itm.drinkList.map(it => ({ ...it, choosed: false }));
                    }
                    if (item.roundName === '选择主食' && itm.tasteList.length > 0) {
                        itm.tasteList = itm.tasteList.map(it => ({ ...it, choosed: false }));
                    }
                });
                return newObj;
            });
            goodInfo.value = goodInfoList;
        }
    } catch (error) {
        showToast('获取商品详情时出现错误');
    }
}

const preOrder = () => {
    order.saveOrderInfo(goodInfo.value)
    router.push({
        name: "H5-selfOrder",
    })
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
                            v-show="(itm.tasteList.length > 0 || itm.drinkList.length > 0) && itm.isDefault === 'Y'">
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
                <div v-show="goodInfo[flavor.outNum].roundName === '选择饮料'">
                    <van-checkbox v-for="(e, index) in goodInfo[flavor.outNum].itemsList[flavor.inNum].drinkList"
                        :key="e.id" v-model="e.choosed" @click="tastChange(index)">{{ e.skuName }}</van-checkbox>
                </div>
                <div v-show="goodInfo[flavor.outNum].roundName === '选择主食'">
                    <van-checkbox v-for="(e, index) in goodInfo[flavor.outNum].itemsList[flavor.inNum].tasteList"
                        :key="e.id" v-model="e.choosed" @click="tastChange(index)">{{ e.skuName }}</van-checkbox>
                </div>
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