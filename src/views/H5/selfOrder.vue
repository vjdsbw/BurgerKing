<script setup lang="ts" name="SelfOrder">
import HamBurger from '@/assets/H5/HamBurger.png'
import ShopBag from "@/assets/H5/ShopBag.png"
import StoreDining from "@/assets/H5/StoreDining.png"

const router = useRouter()

const onClickLeft = () => history.back();

const orderingMethod = ref<'Dine' | 'besides'>('Dine')

const chooseMethod = (type: 'Dine' | 'besides') => {
    orderingMethod.value = type
}

const PackageIndex = ref<number>(0)

const selectPackage = (num: number) => {
    PackageIndex.value = num
}

const preOrder = () => {
    router.push({
        name: "H5-orderDetail"
    })
}

const selectSpecification = () => {
    router.push({
        name: 'H5-customized'
    })
}
</script>

<template>
    <div class="self-order-box">
        <van-nav-bar title="自选套餐" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div class="ordering-way">
            <div :class="{ active: orderingMethod === 'Dine' }" @click="chooseMethod('Dine')">
                <van-icon :name="StoreDining" size="1.5rem" />
                <p>堂食用餐</p>
            </div>
            <div :class="{ active: orderingMethod === 'besides' }" @click="chooseMethod('besides')">
                <van-icon :name="ShopBag" size="1.5rem" />
                <p>打包自提</p>
            </div>
        </div>
        <div class="ordering">
            <div class="foods">
                <div v-for="(item, index) in 5" :key="item" @click="selectPackage(index)"
                    :class="{ active: PackageIndex === index }">
                    <div class="name">
                        <van-image width="60" height="60" :src="HamBurger" />
                        <p>炫辣鸡腿堡</p>
                    </div>
                    <div class="specifications" v-show="PackageIndex === index" @click="selectSpecification">
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