import http from "@/utils/http";

//用户登录
export const loginApi = (params: { accountId: string, enPwd: string }) => http.post("/console/user/login",params);

//登出
export const logoutApi = () => http.post("/console/user/logout");