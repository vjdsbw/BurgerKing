import http from "@/utils/http";

export namespace StoreApi {
    // 门店列表
    export interface storeAddress {
        lat: string;
        lon: string;
        storeName?: string
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

//短链查询
export const statusApi = () => http.get("/api/short_code/status");

// 门店列表查询
export const storeListApi = (params: StoreApi.storeAddress) => http.get("/api/store/list", params);

// 查询商品基本信息
export const goodInfoApi = () => http.get("/api/good/info");

// 查询商品详情
export const goodDetailApi = (params: { storeCode: string }) => http.get("/api/good/detail", params);


//创建订单
export const orderCreateApi = (params: any) => http.post("/api/order/create", params);

//获取salesSceneexport 
export const salesSceneApi = (params: { storeCode: string }) => http.get("/api/store/sales_scene", params);

// 订单详情
export const orderDetailApi = () => http.get("/api/order/orderInfo");

