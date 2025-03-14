<template>

  <div class="app-menu-page flex ">
    <div class="app-menu-page-left">
      <TreeForm @nodeClick="nodeClick" :treeList="appList" v-if="appList && appList.length > 0"></TreeForm>
    </div>

    <div class="flex-1">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="菜单" name="first">
        </el-tab-pane>
      </el-tabs>
      <div class="pl-5">
        <div class="flex items-center">
          <el-form-item label="">
            <el-input class="app-menu-page-input" v-model="form.resourceName" clearable placeholder="请输入菜单名称" />
          </el-form-item>
          <div class="h-full flex items-center" style="margin-left: 20px;
    margin-bottom: 18px;">
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <el-button type="primary" icon="plus" @click="rowAdd()">新增</el-button>
          </div>
        </div>
      </div>
      <div class="pl-5" style="height:calc(100vh - 240px);width:99%;" v-loading="loading">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 border expand-column-key="name" ref="tableRef" :columns="columns" :data="treeData"
              :width="width" :height="height" fixed />
          </template>
        </el-auto-resizer>
        <!-- <el-table-v2-v2 :columns="columns" :data="treeData" :width="width" :height="600" fixed
        :treeProps="treeProps" /> -->
        <!-- <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form" class="p-[12px]">
        <template #menuLeft="{ row }">
          <el-button type="primary" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
        </template>
<template #menu="{ row }">
          <el-button type="primary" link @click="rowAdd(row)">编辑 </el-button>
          <el-button type="danger" link @click="openDel(row)">删除 </el-button>
        </template>
</f-crud> -->
      </div>
    </div>

  </div>
  <Drawer v-if="drawerVisible">
    <template #header>
      <div class="drawer-header">
        <div class="drawer-header-title">{{ rowDetail?.id ? "编辑" : "新增" }}菜单</div>
        <div>
          <el-button @click="drawerVisible = false">返回</el-button>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" v-if="!rowDetail?.id" @click="save('continue')">保存并继续</el-button>
        </div>
      </div>
    </template>
    <template #content>
      <RoleForm ref="roleFormRef" :rowDetail="rowDetail" @done="done" />
    </template>
  </Drawer>

  <el-dialog v-model="delDialog" title="删除提示" width="40%">
    <div><avue-form :option="delOptions()" @submit="delSubmit" v-if="delDialog"></avue-form></div>

  </el-dialog>
</template>

<script lang="tsx" setup>
import { ref, getCurrentInstance } from "vue";
import TreeForm from "./tree.vue";

import Drawer from "@/components/g-dialog/index.vue";
import RoleForm from "./form.vue";

import {
  ElNotification, ElButton, TableV2FixedDir
} from "element-plus";
import { getDetail, del } from "@/api/menus";
import common from '@/api/common'

// 主组件刷新处理
getCurrentInstance().proxy.$eventBus.on('/g-user/menus', async () => {

  drawerVisible.value = false
  disabledDialog.value = false
  drawerDetailVisible.value = false
  await getAllAppList()
  await getList();
});

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const form = ref({ appId: "", resourceName: "" });
const roleFormRef = ref(null);
const fcrud = ref(null);
const drawerVisible = ref(false);
const activeName = ref("first");
const rowDetail = ref({});
const disabledDialog = ref(false);
const delDialog = ref(false);
const drawerDetailVisible = ref(false);
const currentTree = ref({});

const appList = ref([])
const loading = ref(true)

const disForm = ref({});
const treeData = ref([])

const columns = [
  {
    key: 'name',
    title: '菜单名称',
    dataKey: 'name',
    width: 200,
    // align: 'center',
  },
  {
    key: 'id',
    title: '菜单id',
    dataKey: 'id',
    width: 150,
    align: 'center',
  },
  {
    key: 'resourceUrl',
    title: '菜单路径',
    dataKey: 'resourceUrl',
    width: 150,
    align: 'center',
  },
  {
    key: 'typeName',
    title: '菜单类型',
    dataKey: 'typeName',
    width: 150,
    align: 'center',
  },
  {
    key: 'createUserName',
    title: '创建人',
    dataKey: 'createUserName',
    width: 150,
    align: 'center',
  },
  {
    key: 'createTime',
    title: '创建时间',
    dataKey: 'createTime',
    width: 200,
    align: 'center',
  },
  {
    key: 'updateUserName',
    title: '修改人',
    dataKey: 'updateUserName',
    width: 150,
    align: 'center',
  },
  {
    key: 'updateTime',
    title: '修改时间',
    dataKey: 'updateTime',
    width: 200,
    align: 'center',
  },
  {
    key: '操作',
    title: '操作',
    fixed: TableV2FixedDir.RIGHT,
    cellRenderer: (row) => (
      <>
        <ElButton link type="primary" onClick={() => rowAdd(row, 'next')}>增加下级</ElButton>
        <ElButton link type="primary" onClick={() => rowAdd(row)}>修改</ElButton>
        <ElButton type="danger" link onClick={() => openDel(row)}>
          删除
        </ElButton>
      </>
    ),
    width: 180,
    align: 'center',
  },
]





onMounted(async () => {
  await getAllAppList()
  form.value.appId = appList.value[0]?.id
  await getList()
});

onActivated(async () => {
  // await getAllAppList()
  // await getList();
})
const getAllAppList = async () => {
  const res = await common.getList({}, { getList: '/app/getAllAppList' })
  appList.value = res.data.resultData
}
const nodeClick = (id) => {
  form.value.appId = id
  form.value.resourceName = ''
  getList()
}

const getList = async () => {
  loading.value = true
  const { data } = await common.getList(form.value, { getList: '/resource/getAllResourceList' })
  treeData.value = data.resultData
  loading.value = false

}
const delOptions = (node = {}) => {
  return {
    submitText: "确定删除",
    span: 24,
    emptyBtn: false,
    column: [
      {
        label: "",
        labelWidth: 0,
        prop: "title",
        type: "title",
        value: "您确定删除以下菜单吗？删除后不可自动恢复。",
        styles: {
          fontSize: "14px",
          fonFamily: "Source Han Sans CN, Source Han Sans CN-Regular",
          fontWeight: "Regular",
          color: "#303133",
        },
      },
      {
        label: "",
        labelWidth: 0,
        prop: "titles",
        type: "title",
        value: `菜单名称：${disForm.value.name}`,
        styles: {
          fontSize: "14px",
          fonFamily: "Source Han Sans CN, Source Han Sans CN-Regular",
          fontWeight: "Regular",
          color: "#0065ff",
          background: "#ecf5ff",
          padding: "10px  14px",
        },
      },
      {
        label: "",
        labelWidth: 0,
        prop: "titless",
        type: "title",
        value: `此操作会删除子项,请谨慎使用`,
        styles: {
          fontSize: "14px",
          fonFamily: "Source Han Sans CN, Source Han Sans CN-Regular",
          fontWeight: "Regular",
          color: "red",
          marginTop: '-20px'
        },
      },
    ],
  };
};



const search = () => {
  getList()
}


const openDel = ({ rowData }) => {
  disForm.value = rowData;
  delDialog.value = true;
};

const save = (type) => {
  roleFormRef.value.submit(type);
};





const done = (type) => {
  if (type !== 'continue') {
    drawerVisible.value = false;
  }
  getList();
};


const rowAdd = async (row, type) => {
  if (type === 'next') {
    rowDetail.value = { parentId: row.rowData.id, appId: row.rowData.appId }
  } else {
    if (row?.rowData?.id) {
      // const { data } = await getDetail({ appId: row.rowData.id });


      row.rowData.appId = row.rowData.appId
      row.rowData.resourceName = row.rowData.name
      rowDetail.value = row.rowData;

    } else {

      rowDetail.value = {};
      rowDetail.value.appId = form.value.appId
    }
  }
  drawerVisible.value = true;
};

const delSubmit = async (form, done) => {
  try {
    await del({ id: disForm.value.id, deleteItemFlag: true });
    ElNotification.success("操作成功");
    done();
    delDialog.value = false;
    getList();
  } catch (error) {
    done();
  }
};
</script>

<style lang="scss">
.app-menu-page {
  background-color: #ffffff;
  height: 100%;

  &-input {
    width: 180px;
    height: 34px;
  }

  .el-tree-node__content {
    margin: 6px 0;
  }

  &-left {
    border-right: 1px solid #ebeef5;

    // overflow-y: auto;
    &-title {
      width: 166px;
      height: 40px;
      background: #ffffff;
      padding-left: 10px;
      line-height: 40px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: Regular;
      text-align: left;
      color: #323335;
      border-bottom: 1px solid #ebeef5;
    }


  }



  .avue-crud__grid {
    height: calc(100vh - 339px);
  }

  .el-table-v2__header-cell {

    background: #f4f8ff;

    &-text {
      font-size: 13px;
      font-family: 'Microsoft YaHei';
      font-weight: Regular;
      text-align: center;
      color: #76849e;
    }
  }

  .el-table-v2__header-row {
    background: #f4f8ff;
  }

  .el-table-v2 th.el-table-v2__cell {
    background: #f4f8ff;
    height: 40px;
    font-size: 13px;
    font-family: 'Microsoft YaHei';
    font-weight: Regular;
    text-align: center;
    color: #76849e;
  }

  .el-table-v2__cell-text {
    color: #303133;
    font-weight: 400;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  width: 130px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;

  &-title {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: Regular;
  }
}
</style>
