/** @format */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from './user';
import { useGlobalStore } from './global';
import { useOrderStore } from './order'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const Store = () => {
    return {
        user: useUserStore(),
    };
};

export default pinia;
