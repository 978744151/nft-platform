import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { createRouter, createWebHistory, Router, RouterHistory, RouterOptions } from 'vue-router'

import plugins from './plugins' // plugins

import microApp from '@micro-zoe/micro-app'

import { registerComponents } from '@/plugins/components.js'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

import { createPinia } from 'pinia'

import axios from '@/plugins/axios'

import '@smallwei/avue/lib/index.css';
import Avue from '@smallwei/avue';




import SvgIcon from '@/components/SvgIcon/index.vue'

import elementIcons from '@/components/SvgIcon/svgicon'

import router from './router/index.ts'

import App from './App.vue'

import './style.css'


const pinia = createPinia()

let app = null
// let router: Router | null = null
// let history: RouterHistory | null = null
// history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__  || 'g-user')

// router = createRouter({
//   history,
//   routes,
// }) as Router
// 与基座进行数据交互



function fixBugForVueRouter4(router: Router) {
  const realBaseRoute = window.__MICRO_APP_BASE_ROUTE__.replace(/^\/main-[^/]+/g, '')

  router.beforeEach(() => {
    if (typeof window.history.state?.current === 'string') {
      window.history.state.current = window.history.state.current.replace(new RegExp(realBaseRoute, 'g'), '')
    }
  })

  router.afterEach(() => {
    if (typeof window.history.state === 'object') {
      window.history.state.current = realBaseRoute + (window.history.state.current || '')
    }
  })
}



window.mount = () => {
  app = createApp(App)
  registerComponents(app)
  // setupElementPlus(app)
  app.use(pinia)
    .use(router)
    .use(ElementPlus, { locale: zhCn })
    .use(Avue, { axios })
    .use(plugins)
    .use(elementIcons)
    .component('svg-icon', SvgIcon).mount('#app')
  // fixBugForVueRouter4(router)
}

window.unmount = () => {
  app.unmount()
  // history?.destroy()
  app = null
  // router = null
  // history = null
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}
