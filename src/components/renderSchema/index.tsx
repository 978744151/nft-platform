import { defineComponent, toRefs, reactive, watch, ref, onMounted } from 'vue'
import 'amis/sdk/sdk.js'
import 'amis/sdk/sdk.css'
import 'amis/sdk/iconfont.css'
import 'amis/sdk/helper.css'
import 'amis/sdk/rest.js'
import 'amis/sdk/tinymce.js'
import 'amis/sdk/charts.js'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'amis/lib/themes/default.css'
import 'amis/lib/helper.css'
import 'amis-editor-core/lib/style.css'
import 'amis-ui/lib/themes/antd.css'
import 'amis-ui/lib/themes/cxd.css'
// import 'custom-amis-editor/lib/style.css'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import qs from 'qs'
import { ModelCrud, ModelForm, Upload, fetcherFactory, MyPicker } from '@gpyh/custom-amis'
const props = {
  schema: {
    type: Object,
    value: () => {},
  },
  env: {
    type: Object,
    default: () => ({}),
  },
}

const fetcher = fetcherFactory(axios)
export default defineComponent({
  props,
  emits: ['ready'],
  setup(props, ctx) {
    const router = useRouter()
    const common = reactive({})

    const renderBox = ref('renderBox')
    const location = () => {
      const current = router.currentRoute.value
      return {
        pathname: current.path,
        hash: current.hash,
        query: current.query,
        search: `?${qs.stringify(current.query)}`,
      }
    }
    const hanldeNext = () => {
      // window.open('#/editor', '_blank')
    }
    watch(
      () => props.schema,
      () => {
        getList()
      }
    )
    const getList = () => {
      // @ts-ignore
      const scoped = amisRequire('amis/embed')
      // @ts-ignore
      const { normalizeLink } = amisRequire('amis')
      // @ts-ignore
      const amisLib = amisRequire('amis')
      amisLib.Renderer({
        test: /model\-crud/,
      })(ModelCrud)
      amisLib.Renderer({
        test: /model\-form/,
      })(ModelForm)
      amisLib.Renderer({
        test: /upload/,
      })(Upload)

      amisLib.unRegisterRenderer('picker')
      amisLib.OptionsControl({
        type: 'picker',
        autoLoadOptionsFromSource: false,
        sizeMutable: false,
      })(MyPicker)

      const instance = scoped.embed(
        renderBox.value,
        props.schema,
        {
          // 这里是初始 props，一般不用传。
          // locale: 'en-US' // props 中可以设置语言，默认是中文
          // theme: 'ant'
          isMobile: true,
          useMobileUI: true,
          session: 'mobile-iframe-preview',
        },
        {
          fetcher,
          theme: 'cxd',
          // useMobileUI: true,
          // 覆盖 amis env
          // 参考 https://aisuda.bce.baidu.com/amis/zh-CN/docs/start/getting-started#sdk
          // 参考 https://github.com/baidu/amis/blob/master/examples/app/index.jsx
          jumpTo: (to: any, action: any) => {
            if (to === 'goBack') {
              return router.go(-1)
            }
            to = normalizeLink(to, location())
            if (action?.actionType === 'url') {
              action.blank === false ? router.push(to) : window.open(to)
              return
            }
            // 主要是支持 nav 中的跳转
            if (action && to && action.target) {
              window.open(to, action.target)
              return
            }
            if (/^https?:\/\//.test(to)) {
              window.location.replace(to)
            } else {
              router.push(to)
            }
          },
          updateLocation: (location: any, replace: any) => {
            if (location === 'goBack') {
              return router.go(-1)
            }
            // location = normalizeLink(location, location())
            // console.log(router, location)
            replace ? router.replace(location) : router.replace(location)
          },
          ...props.env,
        },
        () => {
          ctx.emit('ready', {
            instance,
          })
        }
      )
    }
    onMounted(async () => {
      getList()
    })
    return {
      ...toRefs(common),
      hanldeNext,
      props,
      renderBox,
    }
  },
  render() {
    return <div ref="renderBox" id="renderBox" style="min-height:400px;"></div>
  },
})
