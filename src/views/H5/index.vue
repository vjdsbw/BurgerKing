<script setup lang="ts" name="ChooseRestaurant">
import ChooseRestaurant from '@/assets/H5/ChooseRestaurant.svg';
import ChooseMeal from '@/assets/H5/ChooseMeal.svg';
import WaitPickup from '@/assets/H5/WaitPickup.svg';
import PickUpFood from '@/assets/H5/PickUpFood.svg';
const searchValue = ref<string>('');

const show = ref(false);
const orderRestaurant = (shop) => {
    console.log(shop)
    show.value = true
}
</script>

<template>
    <div class="choose-restaurant">
        <van-nav-bar title="选择餐厅"></van-nav-bar>
        <div class="choose-restaurant-box">
            <div class="top-img">
                <div class="step-text">
                    <van-image width="60" height="60" :src="ChooseRestaurant" />
                    <div>选择餐厅</div>
                </div>
                <van-icon name="arrow" />
                <div class="step-text">
                    <van-image width="60" height="60" :src="ChooseMeal" />
                    <div>选择餐点</div>
                </div>
                <van-icon name="arrow" />
                <div class="step-text">
                    <van-image width="60" height="60" :src="WaitPickup" />
                    <div>等待取餐码</div>
                </div>
                <van-icon name="arrow" />
                <div class="step-text">
                    <van-image width="60" height="60" :src="PickUpFood" />
                    <div>到店取餐</div>
                </div>
            </div>
            <van-search v-model="searchValue" placeholder="在这里输入地址搜索门店" />
            <div class="restaurant-shop">
                <div class="restaurant-shop-box" v-for="item in 6" :key="item" @click="orderRestaurant(item)">
                    <div class="left">
                        <div class="name-distance">
                            <div>无锡万达</div>
                            <div>距您2.6km</div>
                        </div>
                        <div class="business-time">
                            <van-icon name="clock-o" size="1rem" />
                            <span>07:30 - 23:00</span>
                            <van-tag color="#d72300" plain>营业中</van-tag>
                            <van-tag color="#909399" plain>休息中</van-tag>
                        </div>
                        <div class="business-time">
                            <van-icon name="location-o" size="1rem" />
                            <span>无锡市滨湖区梁溪路35号万达广场步行街外铺W01 - 01号商铺</span>
                        </div>
                    </div>
                    <div class="right">
                        <span>去下单</span>
                        <span style="color:#c8c8c8">去逛逛</span>
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
        </div>

        <van-overlay :show="show" @click="show = false"  :custom-style="{background:'rgba(255,255,255,0)'}">
            <div class="wrapper">
                <div class="block" ></div>
            </div>
        </van-overlay>
    </div>
</template>

<route lang="json">{
    "meta": {
        "layout": false
    }
}</route>

<style scoped lang="scss">
.choose-restaurant {
    background-color: #f2f2f2;
    height: 100vh;

    .choose-restaurant-box {
        margin: 0px 7px;

        .top-img {
            margin-top: 8px;
            padding: 10px 10px;
            display: flex;
            justify-content: space-around;
            flex-wrap: nowrap;
            align-items: center;
            background-color: #fff;
            border-radius: 10px;

            .step-text {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }

        .van-search {
            margin-top: 8px;
            border-radius: 10px;

            :deep(.van-search__content) {
                border-radius: 40px;
            }
        }

        .restaurant-shop {
            height: 67.5vh;
            overflow-y: scroll;
            color: #000000;
            margin-top: 8px;

            .restaurant-shop-box {
                margin-bottom: 8px;
                background-color: #fff;
                border-radius: 10px;
                padding: 0.625rem 0.625rem 0px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .left {
                    width: 70%;
                    padding-right: 5px;

                    .name-distance {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        &>div:first-child {
                            font-size: 1rem;
                            font-weight: 600;
                        }
                    }

                    .business-time {
                        display: flex;
                        align-items: center;
                        color: grey;
                        margin: 8px 0px;
                        font-size: 12px;

                        .van-icon {
                            margin-right: 0.5rem;
                        }

                        .van-tag {
                            margin-left: 0.5rem;
                        }
                    }
                }

                .right {
                    width: 30%;
                    height: 80px;
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    justify-content: center;
                    border-left: 1px solid rgb(200, 200, 200);
                    margin-left: 5px;
                    color: #d72300;
                    font-size: 15px;
                    font-weight: bolder;
                }
            }
        }
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #fff;
    }

    .block {
        width: 120px;
        height: 120px;
        background-color: rgb(219, 21, 21);
    }
}
</style>