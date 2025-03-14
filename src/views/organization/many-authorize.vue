<template>
  <div class="authorize">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.name" :name="item.name" v-for="item in tabList" :key="index"></el-tab-pane>
    </el-tabs> -->

    <div class="">
      <avue-form ref="form" v-model="formValue" label-width="80px" :option="options">
      </avue-form>
    </div>

    <div class="flex" v-if="formValue.appId">
      <div class="w-50">
        <p class="authorize-title">角色</p>
        <el-scrollbar>
          <el-tree style="height: 100%;overflow:auto; width: 300px" :data="roleList" ref="treeRef" show-checkbox
            highlight-current node-key='roleId' :props="{
              children: 'children',
              label: 'roleName',
              value: 'roleId'
            }" @check="changeNode"></el-tree>
        </el-scrollbar>
      </div>
      <div class="w-50" v-if="menusData && menusData.length > 0">
        <p class="authorize-title">菜单</p>
        <el-scrollbar style="min-width: 300px; max-height: 500px; padding-bottom: 50px" class="overflow-auto">
          <el-tree v-loading="treeLoading" :data="menusData" highlight-current node-key='id' :props="{
            children: 'children',
            label: 'name',
            value: 'id'
          }" :default-expanded-keys="expandedKeys"></el-tree>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getList } from '@/api/application'
import common from '@/api/common'
import { getResourceListByRoleIdAndAppId, batchGrantRole } from "@/api/role";
import { getStore } from '@/plugins/store';
import { ElMessage, ElNotification } from "element-plus";

interface Props<T = any> {
  rowDetail: T;
  drawerDetail: T
  selectList: T
}
const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
  drawerDetail: {},
  selectList: []
});
const emits = defineEmits(["done"]);
const userInfo = computed(() => getStore({ name: 'userInfo' }))

const expandedKeys = ref([]);
const options = ref({
  addBtn: false,
  border: true,
  editBtn: false,
  menuBtn: false,
  labelPosition: "",
  labelSuffix: "  ",
  span: 24,
  column: [

    {
      label: "应用系统",
      prop: "appId",
      type: "select",
      // multiple:true,
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
      clearable: false,
      dicUrl: "/app/getAllAppList",
      props: {
        label: "name",
        value: "id",
      },
      filterable: true,
      dicFormatter: (res) => {
        return res.resultData
      },
      style: {
        height: '36px',
        width: '300px'
      },
    },
    {
      label: "组织",
      prop: "officeId",
      type: "cascader",
      multiple: true,
      emitPath: false,
      display: userInfo?.value.technologyFlag,

      placeholder: '',
      dicUrl: "/office/getOfficeTreeList",
      checkStrictly: true,
      props: {
        label: "officeName",
        value: "officeId",
      },
      filterable: true,
      dicFormatter: (res) => {
        return res.resultData;
      },
    },
    {
      label: "用户",
      prop: "userIds",
      type: "select",
      multiple: true,
      clearable: true,
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },

      ],
      collapseTags: true,
      maxCollapseTags: 9999,
      dicUrl: "/user/getUserPageList?status=1&pageSize=9999",
      props: {
        label: "name",
        value: "id",
      },
      filterable: true,
      dicFormatter: (res) => {
        return res.resultData.list;
      },
    },

    // {
    //   label: "角色",
    //   prop: "roleId",
    //   type: "tree",
    //   multiple: true,
    //   rules: [
    //     {
    //       required: true,
    //       trigger: "blur",
    //       message: "这个必填哦",
    //     },
    //   ],
    //   dicUrl: "/role/getListInfo",
    //   props: {
    //     label: "roleName",
    //     value: "roleId",
    //   },
    //   filterable: true,
    //   dicFormatter: (res) => {
    //     return res.resultData.list;
    //   },
    // }
  ]
})
const tabList = ref([])
const roleList = ref([])
const formValue = ref({})
const menusData = ref([])
const treeLoading = ref(false)
const treeRef = ref()
watch(() => formValue.value.officeId, () => {
  getRoleList()
  menusData.value = []
})
watch(() => formValue.value.appId, () => {
  getRoleList()
  menusData.value = []
})

onMounted(async () => {
  getRoleDetail()
  const { data } = await getList()
  tabList.value = data.resultData.list
  getRoleList()

})
const getRoleDetail = async () => {
  // const { data } = await getUserRoles({ userId: props.rowDetail.id })
  // console.log(data)
  formValue.value = props.drawerDetail
  console.log(props.selectList)
  formValue.value.userIds = props.selectList

}
const confirm = async () => {
  if (!formValue.value.appId) {
    ElMessage.error('请选择应用')
    return
  }
  if (!formValue.value.userIds || formValue.value.userIds?.length <= 0) {
    ElMessage.error('请选择用户')
    return
  }
  if (!treeRef.value.getCheckedKeys() || treeRef.value.getCheckedKeys().length <= 0) {
    ElMessage.error('请选择角色')
    return
  }
  const params = {
    appId: formValue.value.appId,
    userIds: formValue.value.userIds,
    roleIds: treeRef.value.getCheckedKeys()
  }
  try {
    const res = await batchGrantRole(params)
    console.log(res)
    if (res.data.resultCode === '0') {
      ElNotification.success("操作成功");

    }
  } catch (error) {
    return
  } finally {
    emits('done')
  }
}


const changeNode = async (node, nodes) => {
  treeLoading.value = true
  if (!formValue.value.appId) {
    ElMessage.error('请选择应用')
    return
  }
  if (!nodes.checkedKeys.length) {
    treeLoading.value = false
    menusData.value = []
    return
  }
  const params = {
    appId: formValue.value.appId,
    roleIds: nodes.checkedKeys.join(','),
    userId: props.rowDetail.id
  }
  const { data } = await getResourceListByRoleIdAndAppId(params)
  console.log(data)
  menusData.value = data.resultData
  if (data.resultData && data.resultData.length > 0) {
    data.resultData.map((e) => {
      if (e.children && e.children.length > 0) {
        e.children.map(item => {
          expandedKeys.value.push(item.id);
        })
      }
    });
  }
  treeLoading.value = false
}
const getRoleList = async () => {
  const { data } = await common.getList({ appId: formValue.value.appId, officeIds: formValue.value.officeId?.join(',') }, { getList: '/role/getAllRoleWithPermission' })
  roleList.value = data.resultData
}
defineExpose({
  confirm
})
</script>

<style lang="scss" scoped>
.authorize {
  height: 100%;

  ::v-deep .avue-form {
    padding: 0;
  }

  &-title {
    font-size: 14px;
    font-family: 'Microsoft YaHei';
    font-weight: Regular;
    text-align: left;
    color: #303133;
    margin-left: 20px;
    margin-bottom: 5px;
  }
}
</style>