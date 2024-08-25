<script setup lang="ts" name="ChooseRestaurant">
import SelfOperatedMall from '@/assets/H5/SelfOperatedMall.png';
import { statusApi, storeListApi } from "@/api/storeApi"
import { Store } from "@/store";

const { user, order } = Store();

const router = useRouter()

const searchValue = ref<string>('');

const orderRestaurant = (shop:any) => {
    order.saveOrderShop(shop);
    if (shop.status === '营业中') {
        showDialog({
            title: '请确认您的自取门店',
            message: shop.address,
            showCancelButton: true,
        }).then(() => {
            router.push({
                name: "H5-selfOrder",
            });  
        }).catch(() => {
            console.log('点击了取消')
        })
    }
}

const showLoading = ref<boolean>(false)

const stroeList = ref<any>([])

const getCodeStutus = async () => {
    showLoading.value = true
    const { code, data } = await statusApi();
    showLoading.value = false
    if (code === 0) {
        if (data.status === 1) {
            // limitPrice.value = data.couponPrice
            // global.setLimitPrice(data);
            // const shop = global.shopGet
            // shop.storeId ? getMenus(shop.storeId) : getLocation()
        } else {
            showLoading.value = false;
            getLocation()
        }
    }
}

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

const success = async (pos: any) => {
    const { latitude, longitude } = pos.coords;
    const { code, data } = await storeListApi({ lat: latitude, lon: longitude })
    if (code === 0) {
        stroeList.value = data;
    }

}

const error = (_err: any) => {
    router.push({ name: 'NewIndex-cityList' })
}

onMounted(() => {
    const searchParams = new URL(location.href).searchParams
    const code = searchParams.get('code') //'tnvvDyjHkRC'
    if (code) {
        user.setCode(code) //E96eR2hxZRC
        getCodeStutus()
    }
})
</script>

<template>
    <div class="choose-restaurant">
        <van-nav-bar title="选择门店"></van-nav-bar>
        <div class="choose-restaurant-box">
            <van-search v-model="searchValue" placeholder="在这里输入地址搜索门店" />
            <div class="restaurant-shop" v-show="!showLoading">
                <div class="restaurant-shop-box" v-for="item in stroeList" :key="item.storeCode"
                    @click="orderRestaurant(item)">
                    <div class="name-distance">
                        <div>
                            <van-icon :name="SelfOperatedMall" size="1.8rem" />
                            <div class="shop-name">{{ item.storeName }}</div>
                            <van-tag color="#0051eb" plain v-if="item.status === '营业中'">{{ item.status }}</van-tag>
                            <van-tag color="#909399" plain v-else>{{ item.status }}</van-tag>
                        </div>
                        <div style="float:inline-end">距您{{ item.distance }}</div>
                    </div>
                    <div class="shop time">
                        <div>营业时间 </div>
                        <div>{{ item.busiTime }}</div>
                    </div>
                    <div class="shop">{{ item.address }}</div>
                </div>
            </div>
        </div>
        <van-loading vertical v-show="showLoading" color="#0094ff">
            <template #icon>
                <van-icon name="star-o" size="30" />
            </template>
            加载中...
        </van-loading>
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
                            font-size: .8rem;
                            font-weight: 600;
                        }

                        .van-tag {
                            margin-left: .5rem;
                        }
                    }

                    &>div:last-child {
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