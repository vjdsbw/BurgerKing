import http from "@/utils/http";

//券列表查询  
export const couponListApi = () => http.get("/console/coupon/list");

// 根据手机号模糊搜索绑定账号列表
export const listByPhoneApi = (params: { phone?: string }) => http.get("/console/user_uid/list_by_phone", params);

// 批量生成短码
export const batchGenApi = (params: {
    couponCenterId: number,
    couponId: string,
    currentPrice: string,
    num: number,
    sellType: number,
    userUidId: string
    validDay: number,
    isLimit: number,
    goodsSource: 1,
    goodsList: string
}) => http.post("/console/short_code/batchGen", params);

// 分页查询绑定账号
export const userListApi = (params: { pageNo: number, pageSize: number, phone: string }) => http.get("/console/user_uid/page_list", params);

//余额查询
export const balanceApi = (params: { userUidId: number }) => http.get("/console/user_uid/query_balance", params);

//获取验证码
export const verifyCodeApi = (params: { mobile: string, queryType: number }) => http.post("/console/user_uid/get_verify_code", params);

///绑定账号
export const bindApi = (params: { mobile: string, verifyCode: string }) => http.post("console/user_uid/bind", params);

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


//查询商品详情
export const goodsDetailApi = (params: { sellType: string, skuCode: string }) => http.get("/console/goods/detail", params);

