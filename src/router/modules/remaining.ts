const commonPath = import.meta.env.VITE_APP_PATH
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/g-user/user',
    component: () => import('@/views/user/index.vue'),
    name: 'app-user',
    meta: { title: '用户管理' }
  },
  {
    path: '/g-user/role',
    component: () => import('@/views/role/index.vue'),
    name: 'app-role',
    meta: { title: '权限管理' }
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: { title: '404', icon: 'dashboard' }
  },
]
export default remainingRouter
