<script setup lang="ts" name="ChooseRestaurant">
import SelfOperatedMall from '@/assets/H5/SelfOperatedMall.png';
const router = useRouter()
const searchValue = ref<string>('');

const orderRestaurant = (shop) => {
    console.log(shop)
    showDialog({
        title: '请确认您的自取门店',
        message: '无锡市滨湖区梁溪路35号万达广场步行街外铺W01 - 01号商铺',
        showCancelButton: true,
    }).then(() => {
        console.log("zfjsdf")
        router.push({
            name: "H5-selfOrder"
        })
    }).catch(() => {
        console.log('点击了取消')
    })

}
</script>

<template>
    <div class="choose-restaurant">
        <van-nav-bar title="选择门店"></van-nav-bar>
        <div class="choose-restaurant-box">
            <van-search v-model="searchValue" placeholder="在这里输入地址搜索门店" />
            <div class="restaurant-shop">
                <div class="restaurant-shop-box" v-for="item in 6" :key="item" @click="orderRestaurant(item)">
                    <div class="name-distance">
                        <div>
                            <van-icon :name="SelfOperatedMall" size="1.8rem" />
                            <div class="shop-name">无锡万达</div>
                            <van-tag color="#0051eb" plain>营业中</van-tag>
                            <van-tag color="#909399" plain>休息中</van-tag>
                        </div>
                        <div style="float:inline-end">距您2.6km</div>
                    </div>
                    <div class="shop time">
                        <div>营业时间 </div>
                        <div>07:30 - 23:00</div>
                    </div>
                    <div class="shop">无锡市滨湖区梁溪路35号万达广场步行街外铺W01 - 01号商铺</div>
                </div>
            </div>
        </div>

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

        .van-search {
            margin-top: 8px;
            border-radius: 10px;

            :deep(.van-search__content) {
                border-radius: 40px;
            }
        }

        .restaurant-shop {
            height: 83.5vh;
            overflow-y: scroll;
            color: #000000;
            margin-top: 8px;

            .restaurant-shop-box {
                margin-bottom: 8px;
                background-color: #fff;
                border-radius: 10px;
                padding: 0.5rem 0.625rem;
                align-items: center;

                .name-distance {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    &>div:first-child {
                        display: flex;
                        align-items: center;
                        .van-icon {
                            margin-right: .5rem;
                        }
                        .shop-name {
                            font-size: 1rem;
                            font-weight: 600;
                        }
                        .van-tag {
                            margin-left: .5rem;
                        }
                    }
                    &>div:last-child{
                        margin-right: .8rem;
                        font-size: 12px;
                    }
                }

                .shop {
                    color: grey;
                    margin: 8px 0px;
                    font-size: 12px;
                }

                .time {
                    display: flex;
                    align-items: center;

                    &>div:nth-child(1) {
                        margin-right: .6rem;
                    }
                }
            }
        }
    }
}
</style>