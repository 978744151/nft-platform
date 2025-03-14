import fCrud from '@/components/common/f-crud.vue'

import fSelect from '@/components/common/f-select.vue'
import type { Component, App } from 'vue'
const Components: Component = {
  fCrud,
  fSelect
}
export const registerComponents = (app: App) => {
  Object.keys(Components).forEach((key) => {
    app.component(key, Components[key])
  })
}
