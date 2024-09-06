import { defineStore } from 'pinia';

interface UserState {
    orderInfo: any;
    orderShop:any
}

export const useOrderStore = defineStore({
    id: 'order', // id必填，且需要唯一
    state: (): UserState => {
        return {
            orderInfo: "",
            orderShop:""
        };
    },
    actions: {
        saveOrderShop(shop: any) {
            console.log(shop,"xxxxxxxxxxxxxx")
            this.orderShop = shop;
        },
        saveOrderInfo(info: any) {
            this.orderInfo = info;
        },
    },
});
