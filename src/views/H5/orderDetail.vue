<script setup lang="ts" name="Order-Detail">
import Booking from '@/assets/H5/booking.png'
import Marking from '@/assets/H5/marking.png'
import Pickup from '@/assets/H5/pickup.png'
import mySwipe2 from '@/assets/H5/mySwipe2.png';
const router = useRouter()

const onClickLeft = () => history.back();

</script>

<template>
    <div class="order-detail-box">
        <van-nav-bar title="订单详情" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div class="order-status">
            <h4>取餐码</h4>
            <div class="code">9147</div>
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
            <div class="tip">请至门店柜台凭取餐号取餐请留意大屏叫号</div>
        </div>
        <div class="order-content">
            <div class="title">无锡万达</div>
            <van-card v-for="item in 3" :key="item" title="炫辣鸡腿堡" :thumb="mySwipe2">
                <template #desc>
                    <div class="desc">
                        <div>双层原味脆鸡堡 x1</div>
                        <div>波纹薯条(小)配番茄酱 x1</div>
                        <div>可口可乐(/336ml) x1</div>
                    </div>
                </template>
            </van-card>
        </div>
        <van-cell-group inset>
            <van-cell title="取餐号" value="9147" />
            <van-cell title="手机尾号" value="0740" />
            <van-cell title="订单号" value="2258302584437507275" />
            <van-cell title="就餐方式" value="外带" />
            <van-cell title="下单时间" value="2024-08-15 16:00:08" />
            <van-cell title="支付方式" value="线上支付" />
            <van-cell title="餐具" value="不需要" />
            <van-cell title="地址" value="河南省许昌市魏都区河南省许昌市莲城大道与智慧大道交叉口西南" />
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

        h4 {
            margin: 0px 0px;
        }

        .code {
            font-size: 2rem;
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