import { defineStore } from 'pinia';
import piniaPersistConfig from './piniaPersist';

interface GlobalState {
    activeMenu: string;


}

export const useGlobalStore = defineStore({
    id: 'global', // id必填，且需要唯一
    state: (): GlobalState => {
        return {
            activeMenu: "",
        };
    },
    actions: {
        setActiveMenu(name: GlobalState['activeMenu']) {
            this.activeMenu = name;
        },
    },
});