import { getStore } from "@/plugins/store";
import { createRouter, createWebHistory } from 'vue-router'
import axios from "axios";
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus'
import { login } from '@/api/config'


const router = createRouter({
  history: createWebHistory('/'),
  routes: [
   
    {
      path: '/application',
      component: () => import('@/views/application/index.vue'),
      name: 'appApplication',
      meta: { title: '分类管理' }
    },
    
    {
      path: '/',
      component: () => import('@/views/amis-editor/index.vue'),
      name: 'amis-editor',
      meta: { title: 'amis-editor' }
    }
  ]
})


export default router

export function resetRouter() {
  const menus = getStore({ name: 'menus' })
  const backMenus = menus.find(e => e.appId === 6)?.resourceTreeList.find(e => e.name == 'name')?.children[0]?.children || []
  const menusJoin = (backMenus?.map((e: { path: string, resourceUrl: string }) => e.resourceUrl.slice(7)))?.join(',')
  let routers = router.getRoutes()
  routers?.map((it: any) => {
    if (menusJoin?.includes(it.path)) {
      router?.removeRoute(it.name)
    }
  })
}
router.beforeEach(async (to, from, next) => {
  const token = Cookies.get(import.meta.env.VITE_TOKEN);
  const cookieTgt = import.meta.env.VITE_TGT;
  const tgt = Cookies.get(cookieTgt);

  try {
    if (!token && window.__MICRO_APP_ENVIRONMENT__) {
      const { data } = await axios({
        url: `${import.meta.env.VITE_CAS_URL}cas/checkLogin?service=http://user-api.qa.gpyh.com`,
        headers: { Authorization: tgt }
      });

      if (data.resultCode === '0') {
        const ticket = data.resultData.redirectUrl.split('=')[1];
        const res = await login({ ticket, tgt });

        if (res.data.resultCode === '0') {
          const newToken = res.data.resultData.token;
          Cookies.set(import.meta.env.VITE_TOKEN, newToken);
          return next();
        }

        ElMessage.error('未知错误,请联系管理员');
        return next();
      }

      return window.microApp.dispatch({ name: "redirectToCAS" });
    }

    if (window.__MICRO_APP_ENVIRONMENT__) {
      const menus = getStore({ name: 'menus' });
      const backMenus = menus.find(e => e.appKey === 'g-user')
        ?.resourceTreeList.find(e => e.name == '系统管理')
        ?.children[0]?.children || [];

      const menusJoin = backMenus.map(
        (e: { resourceUrl: string }) => e.resourceUrl.slice(7)
      );

      const path = to.path.includes('/g-user') ? to.path.slice(7) : to.path;

      return menusJoin.includes(path)
        ? next()
        : window.microApp.dispatch({ name: "redirectTo404" });
    }

    return next();
  } catch (error) {
    ElMessage.error('系统错误，请稍后重试');
    console.error('Router error:', error);
    return next('/404');
  }
});