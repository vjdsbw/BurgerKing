import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Store } from "@/store";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    noLoading?: boolean;
}

enum ResultEnum {
    SUCCESS = 200,
    ERROR = 500,
    OVERDUE = 401,
    TIMEOUT = 30000,
    TYPE = 'success'
}

// 请求响应参数
interface ResultData {
    code: number;
    msg: string;
    data: any;
}

const config = {
    // 默认地址请求地址，可在 .env.** 文件中修改
    baseURL: import.meta.env.VITE_API_URL,
    // 设置超时时间Property 'env' does not exist on type 'ImportMe
    timeout: ResultEnum.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
};

//校验网络请求状态码
const checkCode = (status: number, msg: string) => {
    switch (status) {
        case 400: showToast('请求失败！请您稍后重试'); break;
        case 401: showToast('登录失效！请您重新登录'); break;
        case 403: showToast('当前账号无权限访问'); break;
        case 404: showToast('你所访问的资源不存在'); break;
        case 405: showToast('请求方式错误！请您稍后重试'); break;
        case 408: showToast('请求超时！请您稍后重试'); break;
        case 500: showToast(msg); break;
        case 502: showToast('网关错误！'); break;
        case 503: showToast('服务不可用！'); break;
        case 504: showToast('网关超时！'); break;
        default: break;
    }
};

class RequestHttp {
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // instantiation
        this.service = axios.create(config);
        //请求拦截器 token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
        this.service.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                const { user } = Store();
                if (config.headers && typeof config.headers.set === 'function' && user.token) {
                    config.headers.set('token', user.token);
                }
                if (user.code) {
                    config.headers.set('code', user.code);
                }
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        //响应拦截器 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息/
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response;
                checkCode(data.code, data.msg)
                return data;
            },
            async (error: AxiosError) => {
                return Promise.reject(error);
            }
        );
    }

    //常用请求方法封装
    get(url: string, params?: object, _object = {}): Promise<ResultData> {
        return this.service.get(url, { params, ..._object });
    }
    post(url: string, params?: object | string, _object = {}): Promise<ResultData> {
        return this.service.post(url, params, _object);
    }
    put(url: string, params?: object, _object = {}): Promise<ResultData> {
        return this.service.put(url, params, _object);
    }
    deletea(url: string, params?: any, _object = {}): Promise<ResultData> {
        return this.service.delete(url, { params, ..._object });
    }
    download(url: string, params?: object, _object = {}): Promise<BlobPart> {
        return this.service.post(url, params, { ..._object, responseType: 'blob' });
    }
}

export default new RequestHttp(config);
