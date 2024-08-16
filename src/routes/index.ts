import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages';
import { routerWithList } from '@/config/const'
import { Store } from "@/store";

const routes = generatedRoutes.map((v: any) =>
  v?.meta?.layout != false ? setupLayouts([v])[0] : v
)

console.log(routes, 'xxxxxxxxxxxxx')

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

/**
 * @description 路由拦截 beforeEach
 * */
// router.beforeEach(async (to, _from, next) => {
  // const { user } = Store();
  // 1.NProgress 开始
  // NProgress.start();
  // 2.动态设置标题
  // const title = import.meta.env.VITE_GLOB_APP_TITLE;
  // document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;
  //判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  // if (routerWithList.includes(to.path)) return next();
  //判断是否需要权限，没有重定向到 login 页面
  // if (!user.token && to.meta.authority ) return next({ path: "/login", replace: true });
  //正常访问页面
  // next();
// });

export default router;
