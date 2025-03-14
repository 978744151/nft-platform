<template>
  <div class="authorize">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.name" :name="item.name" v-for="item in tabList" :key="index"></el-tab-pane>
    </el-tabs> -->

    <div class="pl-4">
      <avue-form ref="form" v-model="formValue" label-width="80px" :option="options">
      </avue-form>
    </div>

    <div class="flex" v-if="formValue.appId">
      <div class="w-50">
        <p class="authorize-title">角色权限</p>
        <el-scrollbar style="height: 500px;overflow:auto; width: 300px">
          <el-tree v-loading="loading" :data="roleList" ref="treeRef" show-checkbox highlight-current node-key='roleId'
            :props="{
              children: 'children',
              label: 'roleName',
              value: 'roleId'
            }" @check="changeNode"></el-tree>
        </el-scrollbar>
      </div>
      <div class="w-50" v-loading="treeLoading">
        <p class="authorize-title"></p>
        <el-scrollbar v-if="menusData && menusData.length > 0"
          style="min-width: 300px; height: 500px;  padding-bottom: 50px" class="overflow-auto">
          <el-tree :data="menusData" highlight-current node-key='id' :props="{
            children: 'children',
            label: 'name',
            value: 'id'
          }" :default-expanded-keys="expandedKeys"></el-tree>
        </el-scrollbar>
      </div>
    </div>
  </div>
  <div class="flex justify-center mb-3">
    <el-button @click="emits('done')">
      取消
    </el-button>
    <el-button type="primary" @click="confirm" v-if="formValue.appId">
      确认授权
    </el-button>
  </div>

</template>

<script setup lang="ts">

import common from '@/api/common'
import { getResourceListByRoleIdAndAppId, grantRole } from "@/api/role";
import { getStore } from '@/plugins/store';
import { ElMessage, ElNotification } from "element-plus";
interface RowDetail {
  id: string;
  roleIds?: string;
}

interface DrawerDetail {
  appId: string;
  roleIds?: string;
}

interface Props {
  rowDetail: RowDetail;
  drawerDetail: DrawerDetail;
  list: [];
}

interface FormValue {
  appId: string;
  officeId?: string[];
  [key: string]: any;
}

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface RoleNode {
  roleId: string;
  roleName: string;
  children?: RoleNode[];
}

interface CheckedNodes {
  checkedKeys: string[];
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  rowDetail: () => ({ id: '' }),
  drawerDetail: () => ({ appId: '' }),
  list: () => [],
});

const emits = defineEmits(["done"]);
const userInfo = computed(() => getStore({ name: 'userInfo' }))

const loading = ref(false)
const expandedKeys = ref([]);
const options = ref({
  addBtn: false,
  border: true,
  editBtn: false,
  menuBtn: false,
  delBtn: false,
  labelPosition: "left",
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
      style: {
        height: '36px',
        width: '300px'
      },
      filterable: true,
      dicFormatter: (res) => {
        // 1. 扁平化数组
        const list = props.list.map((e: any) => {
          return {
            ...e,
            id: Number(e.appId),
          }
        })
        function removeDuplicateIds(...arrays) {
          // 1. 扁平化所有输入数组
          const flattenedArray = [].concat(...arrays);

          // 2. 统计每个 id 出现的次数
          const idCount = new Map();
          flattenedArray.forEach(item => {
            idCount.set(item.id, (idCount.get(item.id) || 0) + 1);
          });

          // 3. 过滤出 id 只出现一次的对象
          return flattenedArray.filter(item => idCount.get(item.id) === 1);
        }
        const result = removeDuplicateIds([...res.resultData, ...list]);

        const appList = props.drawerDetail.appId ? res.resultData : result

        return res.resultData.map(e => {
          return {
            ...e,
            id: String(e.id),
          }
        })
      },
    },

    {

      maxCollapseTags: 4,

      label: "组织",
      prop: "officeId",
      type: "cascader",
      emitPath: false,
      display: userInfo?.value.technologyFlag,
      multiple: true,
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
// const tabList = ref([])
const roleList = ref([])
const formValue = ref<FormValue>({ id: '', appId: '' })
const menusData = ref([])
const treeLoading = ref(false)
const treeRef = ref()
watch(() => formValue.value.officeId, async () => {
  if (!formValue.value.appId) return;

  loading.value = true;
  try {
    const { data } = await common.getList(
      {
        appId: formValue.value.appId,
        officeIds: formValue.value.officeId?.join(',')
      },
      { getList: '/role/getAllRoleWithPermission' }
    );
    roleList.value = data.resultData;
    treeRef.value?.setCheckedKeys([]);
    menusData.value = [];
  } catch (error) {
    ElMessage.error('获取角色列表失败');
  } finally {
    loading.value = false;
  }
}, { immediate: false })
watch(() => formValue.value.appId, (appId) => {
  console.log(props.list)

  getRoleList()
  menusData.value = []
})

onMounted(async () => {
  getRoleDetail()
  // const { data } = await getList()
  // tabList.value = data.resultData.list
  getRoleList()

})
const getRoleDetail = async () => {
  formValue.value = props.drawerDetail || {}

  formValue.value.appId = props.drawerDetail.appId
}
const confirm = async () => {
  const checkedKeys = treeRef.value?.getCheckedKeys();
  if (!checkedKeys?.length) {
    ElMessage.warning('请选择要授权的角色');
    return;
  }

  try {
    await grantRole({
      appId: formValue.value.appId,
      userId: props.rowDetail.id,
      roleIds: checkedKeys,
    });
    ElNotification.success("授权成功");
    emits('done');
  } catch (error) {
    ElMessage.error('授权失败');
  }
}


const changeNode = async (node: RoleNode, nodes: CheckedNodes) => {
  if (!formValue.value.appId) {
    ElMessage.error('请选择应用');
    return;
  }

  if (!nodes.checkedKeys.length) {
    menusData.value = [];
    return;
  }

  treeLoading.value = true;
  try {
    const { data } = await getResourceListByRoleIdAndAppId({
      appId: formValue.value.appId,
      roleIds: nodes.checkedKeys.join(','),
    });

    menusData.value = data.resultData;
    expandedKeys.value = [];

    // 优化展开逻辑
    if (data.resultData?.length) {
      expandedKeys.value = data.resultData.reduce((keys: string[], item: TreeNode) => {
        if (item.children?.length) {
          keys.push(...item.children.map(child => child.id));
        }
        return keys;
      }, []);
    }
  } catch (error) {
    ElMessage.error('获取权限列表失败');
  } finally {
    treeLoading.value = false;
  }
}
const getRoleList = async () => {
  loading.value = true
  const { data } = await common.getList({ appId: formValue.value.appId, officeIds: formValue.value.officeId?.join(',') }, { getList: '/role/getAllRoleWithPermission' })
  roleList.value = data.resultData


  const roles: any = props.list.find((e: { appId: '' }) => formValue.value.appId == e.appId)
  setTimeout(() => {
    if (roles?.roleIds) {
      const roleIdsList = roles.roleIds?.split(',') || []

      treeRef.value?.setCheckedKeys(roleIdsList)
      if (roleIdsList && roleIdsList.length > 0) changeNode({}, { checkedKeys: roleIdsList })
    }
    loading.value = false
  }, 600)

}
</script>

<style lang="scss">
.authorize {

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