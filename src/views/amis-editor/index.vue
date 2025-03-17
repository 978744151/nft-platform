<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="jqp-amis-editor">
    <el-header class="flex  jqp-amis-editor-header row-between">
      <div class="jqp-amis-editor-header-title"></div>
      <div>
        <el-button v-if="isMobile === false" type="" @click="hanldeMobile(true)">H5</el-button>
        <el-button v-else type="" @click="hanldeMobile(false)">PC</el-button>
        <el-button v-if="isPreview === false" type="" @click="hanldePreview(true)">预览</el-button>
        <el-button v-else type="" @click="hanldePreview(false)">编辑</el-button>
        <el-button type="primary" @click="hanldeSave()">保存</el-button>
      </div>
    </el-header>
    <!-- <div class="jqp-amis-editor-header" ref="renderBox"></div> -->
    <!-- :amisEnv="amisEnv" -->
    <div class="editor-main">
      <AmisEditor ref="editor" type="file" :class-name="className" :value="schema" theme="cxd" :preview="isPreview"
        :isMobile="isMobile" :disable-bultin-plugin="false" :disable-plugin-list="disablePluginList"
        :prop="{ tokenName: 'g_app_test', }" :fetcher='fetcher' :showCustomRenderersPanel="true" :axios="axios"
        @change="onChange" @preview="hanldePreview" @changeTempComp="changeTempComp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'amis/lib/themes/default.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import 'amis-editor-core/lib/style.css'
// import 'amis-ui/lib/themes/antd.css'
// import '@gpyh/custom-amis/esm/style.css'
import Api from '@/api/common'
import axios from '@/plugins/axios'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { applyPureReactInVue } from 'veaury'
// import { Editor, mountInIframe } from 'amis-editor'
import { AmisEditor as Editor } from '@gpyh/custom-amis'
console.log(Editor)
import { useRouter } from 'vue-router'
import fetcher from '@/plugins/fetcher'
//   import { useAppStore } from '@/stores/app'
interface Props<T = any> {
  info: T

  api: T
}
const props: Props = defineProps<{
  info: {
    name: string
  }

  api: {}
}>()
//   const appStore = useAppStore()
const router = useRouter()
const AmisEditor = applyPureReactInVue(Editor)
const isEditor = ref(null)
const className = 'ae-Editor'
const isPreview = ref(false)
const isMobile = ref(false)
const editor: Ref<HTMLDivElement | null> = ref(null)
const disablePluginList = [{ id: 'text' }]
const types = ref('')
const schema = ref()

if (router.currentRoute.value.path.includes('tenant')) types.value = 'tenant/'
onMounted(() => {
  // schema.value = {
  //   "type": "page",
  //   "id": "u:6d1177d841ab",
  //   "body": [
  //     {
  //       "type": "crud",
  //       "syncLocation": false,
  //       "api": {
  //         "method": "get",
  //         "url": "/api/v1/nft-categories?name=&pageSize=20&pageNum=1",
  //         "requestAdaptor": "",
  //         "adaptor": "",
  //         "messages": {}
  //       },
  //       "bulkActions": [],
  //       "itemActions": [],
  //       "filterSettingSource": [
  //         "appKey",
  //         "appPathName",
  //         "appUrl",
  //         "authAccountCount",
  //         "id",
  //         "keepLive",
  //         "name",
  //         "supportPcLoginFlag",
  //         "updateTime",
  //         "updateUserName"
  //       ],
  //       "filterEnabledList": [
  //         {
  //           "label": "name",
  //           "value": "name"
  //         }
  //       ],
  //       "headerToolbar": [
  //         {
  //           "label": "新增",
  //           "type": "button",
  //           "actionType": "dialog",
  //           "level": "primary",
  //           "editorSetting": {
  //             "behavior": "create"
  //           },
  //           "dialog": {
  //             "type": "dialog",
  //             "title": "新增",
  //             "body": [
  //               {
  //                 "type": "form",
  //                 "api": {
  //                   "method": "post",
  //                   "url": "api/v1/nft-categories",
  //                   "requestAdaptor": "",
  //                   "adaptor": "",
  //                   "messages": {}
  //                 },
  //                 "body": [
  //                   {
  //                     "type": "input-text",
  //                     "name": "name",
  //                     "label": "分类名称",
  //                     "id": "u:edcdd06de469",
  //                     "required": true
  //                   },
  //                   // {
  //                   //   "type": "input-text",
  //                   //   "name": "summary",
  //                   //   "label": "分类名称",
  //                   //   "id": "u:edcdd06de469",
  //                   //   "required": true
  //                   // },
  //                   // {
  //                   //   "type": "input-text",
  //                   //   "name": "content",
  //                   //   "label": "分类名称",
  //                   //   "id": "u:edcdd06de469",
  //                   //   "required": true
  //                   // },

  //                 ],
  //                 "id": "u:cf9b4940cc74",
  //                 "actions": [
  //                   {
  //                     "type": "submit",
  //                     "label": "提交",
  //                     "primary": true
  //                   }
  //                 ],
  //                 "feat": "Insert"
  //               }
  //             ],
  //             "id": "u:436c0337ff96",
  //             "actions": [
  //               {
  //                 "type": "button",
  //                 "actionType": "cancel",
  //                 "label": "取消",
  //                 "id": "u:e72ed9e54270"
  //               },
  //               {
  //                 "type": "button",
  //                 "actionType": "confirm",
  //                 "label": "确定",
  //                 "primary": true,
  //                 "id": "u:e24c88a449f7"
  //               }
  //             ]
  //           },
  //           "id": "u:19caaa0e5e17"
  //         },
  //         "bulkActions"
  //       ],
  //       "filter": {
  //         "title": "查询条件",
  //         "columnCount": 3,
  //         "mode": "horizontal",
  //         "body": [
  //           {
  //             "type": "input-text",
  //             "label": "应用名称",
  //             "name": "name",
  //             "id": "u:19b5f7a3d89d"
  //           }
  //         ],
  //         "id": "u:97b4a17749ad",
  //         "actions": [
  //           {
  //             "type": "submit",
  //             "label": "搜索",
  //             "primary": true,
  //             "id": "u:e8f7481aa708"
  //           }
  //         ],
  //         "feat": "Insert",
  //         "wrapWithPanel": true,
  //         "submitOnChange": true,
  //         "rules": []
  //       },
  //       "columns": [
  //         {
  //           "label": "应用名称",
  //           "type": "text",
  //           "name": "name",
  //           "id": "u:3fd9a825ad93"
  //         },
  //         {
  //           "label": "授权账号数",
  //           "type": "text",
  //           "name": "authAccountCount",
  //           "id": "u:b72dcd9ae8c8"
  //         },
  //         {
  //           "label": "应用名称",
  //           "type": "text",
  //           "name": "name",
  //           "id": "u:0efa58100fae"
  //         },
  //         {
  //           "label": "是否显示菜单",
  //           "type": "text",
  //           "name": "supportPcLoginFlag",
  //           "id": "u:ba5b6d3a2336"
  //         },
  //         {
  //           "label": "操作时间",
  //           "type": "text",
  //           "name": "updateTime",
  //           "id": "u:13fb31420ccc"
  //         },
  //         {
  //           "label": "操作人\n",
  //           "type": "text",
  //           "name": "updateUserName",
  //           "id": "u:d86ccdeae5ed"
  //         },
  //         {
  //           "type": "operation",
  //           "label": "操作",
  //           "buttons": [
  //             {
  //               "label": "编辑",
  //               "type": "button",
  //               "actionType": "dialog",
  //               "level": "link",
  //               "editorSetting": {
  //                 "behavior": "update"
  //               },
  //               "dialog": {
  //                 "type": "dialog",
  //                 "title": "编辑",
  //                 "body": [
  //                   {
  //                     "type": "form",
  //                     "body": [
  //                       {
  //                         "label": "应用名称",
  //                         "name": "name",
  //                         "type": "input-text",
  //                         "id": "u:edcdd06de469"
  //                       },
  //                       {
  //                         "label": "应用Url",
  //                         "name": "appUrl",
  //                         "type": "input-text",
  //                         "id": "u:e1be46ebf4f7"
  //                       },
  //                       {
  //                         "label": "是否显示菜单:",
  //                         "name": "supportPcLoginFlag",
  //                         "type": "input-text",
  //                         "id": "u:02b4fdaea748"
  //                       },
  //                       {
  //                         "label": "应用Key",
  //                         "name": "appKey",
  //                         "type": "input-text",
  //                         "id": "u:54df855930e0"
  //                       },
  //                       {
  //                         "label": "应用描述:",
  //                         "name": "description",
  //                         "type": "input-text",
  //                         "id": "u:ce6eed7c27de"
  //                       },
  //                       {
  //                         "label": "图片上传",
  //                         "name": "logoUrl",
  //                         "type": "input-image",
  //                         "autoUpload": true,
  //                         "proxy": true,
  //                         "uploadType": "fileReceptor",
  //                         "imageClassName": "r w-full",
  //                         "id": "u:7e8531955160"
  //                       }
  //                     ],
  //                     "id": "u:3a6f7dc8af31",
  //                     "actions": [
  //                       {
  //                         "type": "submit",
  //                         "label": "提交",
  //                         "primary": true
  //                       }
  //                     ],
  //                     "feat": "Edit",
  //                     "dsType": "api",
  //                     "initApi": "http://user-api.qa.gpyh.com/app/getDetailById?appId=${id}",
  //                     "api": {
  //                       "url": "http://user-api.qa.gpyh.com/app/updateApp",
  //                       "method": "post",
  //                       "requestAdaptor": "",
  //                       "adaptor": "return {\n  status:0,\n  data:true\n}",
  //                       "messages": {},
  //                       "data": {
  //                         "&": "$$"
  //                       }
  //                     }
  //                   }
  //                 ],
  //                 "id": "u:28089a90c3d4",
  //                 "actions": [
  //                   {
  //                     "type": "button",
  //                     "actionType": "cancel",
  //                     "label": "取消",
  //                     "id": "u:eb5a6f5e23b4"
  //                   },
  //                   {
  //                     "type": "button",
  //                     "actionType": "confirm",
  //                     "label": "确定",
  //                     "primary": true,
  //                     "id": "u:03d06d363cc6"
  //                   }
  //                 ]
  //               },
  //               "id": "u:3e4d8fa950da"
  //             },
  //             {
  //               "label": "查看",
  //               "type": "button",
  //               "actionType": "dialog",
  //               "level": "link",
  //               "editorSetting": {
  //                 "behavior": "view"
  //               },
  //               "dialog": {
  //                 "type": "dialog",
  //                 "title": "查看详情",
  //                 "body": [
  //                   {
  //                     "type": "form",
  //                     "body": [
  //                       {
  //                         "label": "应用名称",
  //                         "name": "appKey",
  //                         "type": "input-text",
  //                         "id": "u:edcdd06de469"
  //                       },
  //                       {
  //                         "label": "应用Url",
  //                         "name": "appUrl",
  //                         "type": "input-text",
  //                         "id": "u:e1be46ebf4f7"
  //                       },
  //                       {
  //                         "label": "是否显示菜单:",
  //                         "name": "supportPcLoginFlag",
  //                         "type": "input-text",
  //                         "id": "u:02b4fdaea748"
  //                       },
  //                       {
  //                         "label": "应用Key",
  //                         "name": "appKey",
  //                         "type": "input-text",
  //                         "id": "u:54df855930e0"
  //                       },
  //                       {
  //                         "label": "应用描述:",
  //                         "name": "description",
  //                         "type": "input-text",
  //                         "id": "u:ce6eed7c27de"
  //                       },
  //                       {
  //                         "label": "图片上传",
  //                         "name": "logoUrl",
  //                         "type": "input-image",
  //                         "autoUpload": true,
  //                         "proxy": true,
  //                         "uploadType": "fileReceptor",
  //                         "imageClassName": "r w-full",
  //                         "id": "u:7e8531955160"
  //                       }
  //                     ],
  //                     "id": "u:e31729ccd028",
  //                     "actions": [
  //                       {
  //                         "type": "submit",
  //                         "label": "提交",
  //                         "primary": true
  //                       }
  //                     ],
  //                     "feat": "Insert",
  //                     "dsType": "api",
  //                     "initApi": "http://user-api.qa.gpyh.com/app/getDetailById?appId=${id}"
  //                   }
  //                 ],
  //                 "id": "u:ac867ed20942",
  //                 "actions": [
  //                   {
  //                     "type": "button",
  //                     "actionType": "cancel",
  //                     "label": "取消",
  //                     "id": "u:ac0a898d1edc"
  //                   },
  //                   {
  //                     "type": "button",
  //                     "actionType": "confirm",
  //                     "label": "确定",
  //                     "primary": true,
  //                     "id": "u:b7d689cb3d88"
  //                   }
  //                 ]
  //               },
  //               "id": "u:817369782819"
  //             },
  //             {
  //               "type": "button",
  //               "label": "删除",
  //               "actionType": "ajax",
  //               "level": "link",
  //               "className": "text-danger",
  //               "confirmText": "确定要删除？",
  //               "api": {
  //                 "method": "delete",
  //                 "url": "/api/v1/nft-categories/${_id}",
  //                 "requestAdaptor": "",
  //                 "adaptor": "",
  //                 "messages": {}
  //               },
  //               "editorSetting": {
  //                 "behavior": "delete"
  //               },
  //               "id": "u:c50c8a1c0882"
  //             }
  //           ],
  //           "id": "u:0136e24c1e77"
  //         }
  //       ],
  //       "id": "u:96684160dd7d",
  //       "perPageAvailable": [
  //         10
  //       ],
  //       "messages": {},
  //       "perPageField": "pageSize",
  //       "pageField": "pageNum"
  //     }
  //   ],
  //   "toolbar": []
  // }
  schema.value = localStorage.getItem("scaffoldFormValues") ? JSON.parse(localStorage.getItem("scaffoldFormValues") as string) : {}
})
const onChange = (schema: any) => {
  localStorage.setItem('scaffoldFormValues', JSON.stringify(schema))

  if (schema) {
    if (!schema.type) {
      schema.value = {
        type: 'page',
        ...schema,
      }
    } else {
      schema.value = schema
    }
  } else {
    schema.value = schema
  }
}
const changeTempComp = () => { }
const hanldePreview = (e: boolean) => {
  isPreview.value = e
}
const hanldeMobile = (e: boolean) => {
  isMobile.value = e
}
const hanldeSave = async () => {

  // const form = {
  //   id: router.currentRoute.value.params.id,
  //   designJson: JSON.stringify(schema.value),
  //   configJson: sessionStorage.getItem('scaffoldFormValues') || '',
  // }
  // await props.api.save(form, types.value)
  // ElMessage.success('保存成功')
}
</script>

<style lang="scss">
@import './style.scss';

.ae-Preview .ae-Preview-body .ae-Preview-inner .ae-Dialog-preview-mount-node .amis-dialog-widget {
  padding-bottom: 300px;
}
</style>