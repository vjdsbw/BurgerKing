import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface UserState {
    token: string;
    code: string;
}

export const useUserStore = defineStore({
    id: 'user', // id必填，且需要唯一
    state: (): UserState => {
        return {
            token: "",
            code: ""
        };
    },
    actions: {
        setToken(token: UserState['token']) {
            this.token = token;
        },
        setCode(Code: UserState['token']) {
            this.code = Code;
        },
    },
    persist: piniaPersistConfig('user')
});
