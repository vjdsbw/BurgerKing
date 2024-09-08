import http from "@/utils/http";

// 根据手机号模糊搜索绑定账号列表
export const listByPhoneApi = (params: { phone?: string }) => http.get("/console/user_uid/list_by_phone", params);

// 批量生成短码
export const batchGenApi = (params: any) => http.post("/console/short_code/batchGen", params);

// 分页查询绑定账号
export const userListApi = (params: { pageNo: number, pageSize: number, phone: string }) => http.get("/console/user_uid/page_list", params);

//余额查询
export const balanceApi = (params: { userUidId: number }) => http.get("/console/user_uid/query_balance", params);

//获取验证码
export const verifyCodeApi = (params: { mobile: string, queryType: number }) => http.post("/console/user_uid/get_verify_code", params);

///绑定账号
export const bindApi = (params: { mobile: string, verifyCode: string }) => http.post("console/user_uid/bind", params);

//禁用绑定的手机号
export const forbiddenApi = (params: { userUidId: number }) => http.post("/console/user_uid/forbidden", params);

//禁用绑定的手机号
export const availableApi = (params: { userUidId: number }) => http.post("/console/user_uid/available", params);

//重新登录
export const reloginApi = (params: { userUidId: number, verifyCode: string }) => http.post("/console/user_uid/relogin", params);

//删除绑定的手机号
export const deleteApi = (params: { userUidId: number }) => http.post("/console/user_uid/delete", params);

//分页查询链接
export const shortCodeApi = (params: {
    couponName: string;
    couponPrice: string;
    pageNo: number;
    pageSize: number;
    phone: string;
    status: string;
    url: string;
}) => http.post("/console/short_code/page_list", params);

//重置链接
export const replaceCodeApi = (params: { shortCode: string }) => http.post("/console/short_code/replace", params);

//删除链接
export const deleteCodeApi = (params: { shortCode: string }) => http.post("/console/short_code/delete", params);

//导出短链
export const downloadApi = (params: any) => http.post("/console/short_code/download", params, { responseType: 'blob' });

//获取我的优惠券列表-全量
export const myListApi = (params: { userUidId: number }) => http.get("/console/coupon/my_list", params);

//券列表查询  
export const couponListApi = () => http.get("/console/coupon/list");

//  领券中心-领券
export const sendCouponApi = (params: {
    couponCenterId: number;
    couponId: string;
    num: number;
    userUidId: number;
}) => http.post("/console/coupon/send_coupon", params);

//查询商品详情
export const goodsDetailApi = (params: { sellType: number, skuCode: string }) => http.get("/console/goods/detail", params);

//门店列表查询
export const storeListApi = (params: { storeName: string }) => http.get("/console/store/list", params);

//查询门店信息
export const storeBaseInfoApi = (params: { storeCode: string }) => http.get("/console/store/base_info", params);

//绑定门店
export const bindStoreApi = (params: { storeCode: string }) => http.post("/console/store/bind", params);

//查询你绑定的门店信息
export const bindInfoApi = () => http.get("/console/store/default_info");