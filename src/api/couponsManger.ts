import http from "@/utils/http";

//券列表查询  
export const couponListApi = () => http.get("/console/coupon/list");

// 根据手机号模糊搜索绑定账号列表
export const listByPhoneApi = (params: { phone: string }) => http.get("/console/user_uid/list_by_phone", params);

// 批量生成短码
export const batchGenApi = (params: {
    couponCenterId: number,
    couponId: number,
    currentPrice: string,
    num: number,
    sellType: string,
    userUidId: string
}) => http.post("/console/short_code/batchGen", params);

