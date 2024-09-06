/** @format */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from './user';
import { useOrderStore } from './order';
import { useGlobalStore } from './global'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const Store = () => {
    return {
        user: useUserStore(),
        order: useOrderStore(),
        global: useGlobalStore()
    };
};

export default pinia;
