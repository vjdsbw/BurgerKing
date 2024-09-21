import { defineStore } from 'pinia';

interface UserState {
    orderInfo: any;
    orderShop: any;
    orderGoods: {
        imgUrl: string,
        name: string,
        goodsType: string,
        num: number
    }
}

export const useOrderStore = defineStore({
    id: 'order', // id必填，且需要唯一
    state: (): UserState => {
        return {
            orderInfo: {},
            orderShop: "",
            orderGoods: {
                imgUrl: "",
                name: "",
                goodsType: '',
                num: 0
            }
        };
    },
    actions: {
        saveOrderShop(shop: any) {
            this.orderShop = shop;
        },
        saveOrderInfo(info: any) {
            this.orderInfo[info.num] = info.val
        },
        saveOrderGoods(info: { imgUrl: string, name: string, goodsType: string,num: number }) {
            this.orderGoods = info;
        },
    },
});
