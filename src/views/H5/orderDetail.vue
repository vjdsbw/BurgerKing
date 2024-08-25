<script setup lang="ts" name="Order-Detail">
import Booking from '@/assets/H5/booking.png'
import Marking from '@/assets/H5/marking.png'
import Pickup from '@/assets/H5/pickup.png'
import mySwipe2 from '@/assets/H5/mySwipe2.png';
import { Store } from "@/store";

import { orderDetailApi } from '@/api/storeApi';

const onClickLeft = () => history.back();

const { order } = Store();

const router = useRouter()

const detailInfo = ref<any>({})
const getInfo = async () => {

    // const { code, data, msg } = await orderDetailApi({ storeCode: order.orderShop.storeCode })
    const { code, data, msg } = await orderDetailApi({ storeCode: '29654-1' })
    if (code === 0) {
        detailInfo.value = data;
        detailInfo.value.diningCabinetNumber = JSON.parse(data.diningCabinetNumber)[0]
    } else {
        showToast(msg)
    }
}

onMounted(() => {
    getInfo()
})

</script>

<template>
    <div class="order-detail-box">
        <van-nav-bar title="订单详情" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div class="order-status" v-if="detailInfo.diningCabinetNumber && detailInfo.diningCabinetPickupCode">
            <h5>取餐柜:{{ detailInfo.diningCabinetNumber }}</h5>
            <div class="code">取餐柜取餐码:{{ detailInfo.diningCabinetPickupCode }}</div>
            <div class="status">
                <div>
                    <van-icon :name="Booking" size="1.5rem" />
                    已下单
                </div>
                <div>
                    <van-icon :name="Marking" size="1.5rem" />
                    制作中
                </div>
                <div>
                    <van-icon :name="Pickup" size="1.5rem" />
                    请取餐
                </div>
            </div>
            <div class="tip"> 请至门店取餐柜凭二维码取餐</div>
            <div class="tip"> 冰激凌等冷饮，请凭取餐柜内餐牌至柜台领取</div>
        </div>
        <div class="order-status" v-else>
            <h5>取餐码</h5>
            <div class="code">{{ detailInfo.pickupNumber }}</div>
            <div class="status">
                <div>
                    <van-icon :name="Booking" size="1.5rem" />
                    已下单
                </div>
                <div>
                    <van-icon :name="Marking" size="1.5rem" />
                    制作中
                </div>
                <div>
                    <van-icon :name="Pickup" size="1.5rem" />
                    请取餐
                </div>
            </div>
            <div class="tip"> 请至门店柜台凭取餐号取餐</div>
            <div class="tip"> 请留意大屏叫号</div>
        </div>
        <div class="order-content">
            <div class="title">{{ detailInfo.storeName }}</div>
            <van-card :title="detailInfo.couponName" :thumb="mySwipe2">
                <template #desc>
                    <div class="desc">
                        <div>{{ detailInfo.specs }}</div>
                    </div>
                </template>
            </van-card>
            <van-cell-group inset>
                <van-cell title="商品小计" :value="detailInfo.orderAmount" />
                <van-cell v-for="(item, index) in detailInfo.discounts" :key="index" :title="item.discountName"
                    :value="item.totalDiscountAmount" />
                <van-cell title="合计" :value="detailInfo.actualPayAmount"></van-cell>
            </van-cell-group>
        </div>
        <van-cell-group inset>
            <van-cell title="取餐号" :value="detailInfo.pickupNumber" />
            <van-cell title="手机尾号" value="0740" />
            <van-cell title="订单号" :value="detailInfo.orderNo" />
            <van-cell title="就餐方式" :value="detailInfo.pickupType" />
            <van-cell title="下单时间" :value="detailInfo.orderTime" />
            <van-cell title="支付时间" :value="detailInfo.payTime" />
            <van-cell title="支付方式" value="线上支付" />
            <van-cell title="餐具" value="不需要" />
            <van-cell title="地址" :value="detailInfo.storeAddress" />
        </van-cell-group>

    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false
    }
}</route>

<style scoped lang="scss">
.order-detail-box {
    background-color: #f2f2f2;
    height: 100vh;
    overflow-y: scroll;

    .order-status {
        margin: 8px 7px;
        padding: 10px 10px;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;

        h5 {
            margin: 0px 0px;
        }

        .code {
            font-size: 1.2rem;
            color: rgb(54, 154, 247);
            font-weight: 600;
        }

        .status {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: .5rem;

            &>div {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;

                &:not(:last-child)::after {
                    content: '......';
                    position: absolute;
                    right: -100%;
                }
            }
        }

        .tip {
            margin-top: .5rem;
            color: grey;
            font-size: .8rem;
        }
    }

    .order-content {
        margin: 8px 7px;
        padding: 10px 10px;
        background-color: #fff;
        border-radius: 10px;

        .title {
            font-size: 1rem;
            font-weight: 600;
        }

        :deep(.van-card) {
            padding: 0px 0px;

            .van-card__content {
                background-color: #ffff;

                .van-card__title {
                    font-size: .8rem;
                }
            }
        }

        .desc {
            color: grey;
        }
    }

    .van-cell-group {
        margin: 8px 7px;
    }
}
</style>