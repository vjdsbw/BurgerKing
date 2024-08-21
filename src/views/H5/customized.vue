<script setup lang="ts" name="Customized">
import mySwipe1 from '@/assets/H5/mySwipe1.png';
import mySwipe2 from '@/assets/H5/mySwipe2.png';
import HamBurger from '@/assets/H5/HamBurger.png';
import Drumsticks from '@/assets/H5/Drumsticks.png';
import CocaCola from '@/assets/H5/CocaCola.png'

const router = useRouter();
const onClickLeft = () => history.back();

const PackageForm = ref<{ principal: number; snack: number; drink: number }>({
    principal: 0,
    snack: 0,
    drink: 0
})

const selectPackage = (num: number, type: 'principal' | 'snack' | 'drink') => {
    PackageForm.value[type] = num
}

const preOrder = () => {
    router.push({
        name: "H5-selfOrder"
    })
}

const actionSheetShow = ref<boolean>(false)

const checked = ref<string>('')

const determineTaste = () => {
    actionSheetShow.value = false
}

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
            <div class="bill">
                <h4>选择主食</h4>
                <div>
                    <div v-for="(item, index) in 3" :key="item" @click="selectPackage(index, 'principal')"
                        :class="{ active: PackageForm.principal === index }">
                        <div class="name">
                            <van-image width="60" height="60" :src="HamBurger" />
                            <p>炫辣鸡腿堡</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bill">
                <h4>选择小食</h4>
                <div>
                    <div v-for="(item, index) in 3" :key="item" @click="selectPackage(index, 'snack')"
                        :class="{ active: PackageForm.snack === index }">
                        <div class="name">
                            <van-image width="60" height="60" :src="Drumsticks" />
                            <p>炫辣鸡腿堡</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bill">
                <h4>选择饮料</h4>
                <div>
                    <div v-for="(item, index) in 3" :key="item" @click="selectPackage(index, 'drink')"
                        :class="{ active: PackageForm.drink === index }">
                        <div class="name">
                            <van-image width="60" height="60" :src="CocaCola" />
                            <p>可口可乐</p>
                        </div>
                        <div class="specifications" v-show="PackageForm.drink === index"
                            @click="actionSheetShow = true">
                            口味选择
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-button type="primary" class="sure-btn" round @click="preOrder">确认选择</van-button>

        <van-popup v-model:show="actionSheetShow" round closeable position="bottom" :style="{ height: '30%' }">
            <div class="popup-content">
                <h4>请选择口味</h4>
                <van-radio-group v-model="checked" direction="horizontal">
                    <van-radio name="1">加冰</van-radio>
                    <van-radio name="2">不加冰 2</van-radio>
                </van-radio-group>
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