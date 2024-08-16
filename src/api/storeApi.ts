import http from "@/utils/http";

export namespace StoreApi {
    // 门店列表
    export interface storeAddressList {
        lat: string;
        lon: string;
        code?: string;
        keyword?: string;
        userLat?:string;
        userLon?:string;
    }

    // 用户名，密码
    export interface userInfo {
        accountId: string
        enPwd: string
    }

    // 查询菜单参数
    export interface menuList {
        storeId: number;
        code?: string;
    }
}
//获取rsa公钥
export const getPublicKeyApi = () => http.get("/console/user/getKey");
// 登录 
export const loginApi = (params: StoreApi.userInfo) => http.post("/console/user/login", params);

//查询最近门店
export const nearestApi = (params: StoreApi.storeAddressList) => http.get("/api/store/nearest", params);

//查询门店详情
export const shopDetailApi = (params: StoreApi.menuList) => http.get("/api/store/detail", params);

//查询门店列表
export const shopListApi = (params: StoreApi.storeAddressList) => http.get("/api/store/list", params)

//查询菜单
export const productMenuApi = (params: StoreApi.menuList) => http.get("/api/product/menuList", params)

//查询菜单
export const cityListApi = () => http.get("/api/store/cityList")
