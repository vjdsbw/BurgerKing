import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface UserState {
    token: string;
    code: string;
    userName: string;

}

export const useUserStore = defineStore({
    id: 'user', // id必填，且需要唯一
    state: (): UserState => {
        return {
            token: "",
            code: "",
            userName: ""
        };
    },
    actions: {
        setUserName(name: UserState['userName']) {
            this.userName = name;
        },
        setToken(token: UserState['token']) {
            console.log(token,"xxxxxxxxxxxxxxxxxxxxx")
            this.token = token;
        },
        setCode(Code: UserState['token']) {
            this.code = Code;
        },
    },
    persist: piniaPersistConfig('user')
});
