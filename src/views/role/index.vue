<template>
  <div class="app-role-page flex">
    <div class="app-role-page-right flex-1 overflow-x-auto">
      <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form" class="p-[12px]">
        <template #menuLeft="{ row }">
          <el-button type="primary" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
        </template>
        <template #menu="{ row }">
          <el-button type="primary" link @click="rowAdd(row)">编辑 </el-button>
          <el-button type="primary" link @click="copy(row)">复制 </el-button>
          <!-- <el-button type="primary" link @click="openStatus(row)"
                >{{ row.status == 1 ? "禁用" : "启用" }}
              </el-button> -->
          <el-button type="danger" link @click="openDel(row)">删除 </el-button>
        </template>
      </f-crud>
    </div>
    <Drawer v-if="drawerVisible">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header-title">
            {{ rowDetail?.roleId ? "编辑" : "新增" }}角色
          </div>
          <div>
            <el-button @click="drawerVisible = false">返回</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button type="primary" v-if="!rowDetail?.roleId" @click="save('continue')">保存并继续</el-button>
          </div>
        </div>
      </template>
      <template #content>
        <RoleForm ref="roleFormRef" :rowDetail="rowDetail" @done="done" />
      </template>
    </Drawer>

    <el-dialog v-model="delDialog" title="删除提示" width="40%">
      <avue-form :option="delOptions()" @submit="delSubmit" v-if="delDialog"></avue-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";

import Drawer from "@/components/g-dialog/index.vue";
import RoleForm from "./form.vue";


import { ElNotification } from "element-plus";
import { avueCrudConfig } from "@/plugins/common";
import { getDetail, del } from "@/api/role";
import { pl } from "element-plus/es/locale";
import { getStore } from "@/plugins/store";


const operate = ref({
  getList: "/role/getListInfo",
  postUrl: "/role/addRole",
  putUrl: "/role/putRole",
  delUrl: "/role/deleteRule",
});
const form = ref({});
const roleFormRef = ref(null);
const fcrud = ref(null);
const drawerVisible = ref(false);
const rowDetail = ref({});

const delDialog = ref(false);
const userInfo = computed(() => getStore({ name: 'userInfo' }))

const formProps = ref({
  pageSize: 20,
});
const disForm = ref({});
// 主组件刷新处理
getCurrentInstance().proxy.$eventBus.on('/g-user/role', async () => {
  drawerVisible.value = false
  fcrud.value?.crud.searchReset();
  fcrud.value?.currentChange(1);
});
onMounted(async () => {
  fcrud.value.getList();
});
onActivated(() => {
  fcrud.value.getList();
})
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
        value: "您确定删除以下角色吗？删除后不可自动恢复。",
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
        value: `角色名称：${disForm.value.roleName}`,
        styles: {
          fontSize: "14px",
          fonFamily: "Source Han Sans CN, Source Han Sans CN-Regular",
          fontWeight: "Regular",
          color: "#0065ff",
          background: "#ecf5ff",
          padding: "10px  14px",
        },
      },
    ],
  };
};

const option = () => {
  return {
    emptyBtnText: '重置',
    addBtn: false,
    border: true,
    editBtn: false,
    ...avueCrudConfig,
    index: true,
    delBtn: false,
    // searchIndex: 2,
    height: "calc(100vh - 304px)",
    // menuWidth: 300,
    // emptyBtn: false,
    align: "center",
    column: [
      {
        label: "角色名称",
        prop: "roleName",
      },
      {
        label: "描述",
        prop: "description",
      },
      {
        label: "授权系统",
        prop: "appName",
      },
      {
        label: "组织",
        prop: "officeName",
      },
      {
        label: "状态",
        prop: "status",
        dicData: [
          {
            label: "生效",
            value: "1",
          },
          {
            label: "删除",
            value: "-1",
          },
          {
            label: "禁用",
            value: 0,
          },
        ],
      },
      {
        label: "创建人",
        prop: "createUserName",
      },
      {
        label: "修改人",
        prop: "updateUserName",
      },
      {
        label: "修改时间",
        prop: "updateTime",
      },
      {
        prop: "appId",
        type: "select",
        placeholder: "全部应用系统",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        dicUrl: "/app/getAllAppListWithPermission",
        props: {
          label: "name",
          value: "id",
        },
        search: true,
        hide: true,
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
      },

      {
        prop: "roleName",
        placeholder: "请输入角色名称",
        search: true,
        hide: true,
      },
      {
        label: "",
        prop: "officeId",
        type: "cascader",
        emitPath: false,
        search: userInfo?.value.technologyFlag,
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        placeholder: '组织',
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
      //   prop: "userName",
      //   placeholder: "请输入菜单名称",
      //   search: true,
      //   hide: true,
      // },
    ],
  };
};



const openDel = (row) => {
  console.log(row);
  disForm.value = row;
  delDialog.value = true;
};

const save = (type) => {
  roleFormRef.value.submit(type);
};

const copy = async (row) => {
  const { data } = await getDetail({ roleId: row.roleId });
  rowDetail.value = data.resultData;
  rowDetail.value.name = data.resultData.roleName;
  rowDetail.value.roleId = ''
  drawerVisible.value = true;
};
const done = (type) => {
  if (type !== 'continue') drawerVisible.value = false;
  fcrud.value.getList();
};


const rowAdd = async (row) => {
  if (row?.roleId) {
    const { data } = await getDetail({ roleId: row.roleId });
    rowDetail.value = data.resultData;
    rowDetail.value.name = data.resultData.roleName;
    // rowDetail.value.appId = String(data.resultData.appId);
  } else {
    rowDetail.value = {};
  }
  drawerVisible.value = true;
};
const delSubmit = async (form, done) => {
  try {
    await del({ roleId: disForm.value.roleId });
    ElNotification.success("操作成功");
    done();
    delDialog.value = false;
    fcrud.value.getList();
  } catch (error) {
    done();
  }
};
</script>

<style lang="scss" scoped>
.app-role-page {
  background-color: #ffffff;
  height: 100%;

  &-left {
    border-right: 1px solid #ebeef5;

    // overflow-y: auto;
    &-title {
      min-width: 166px;
      height: 40px;
      background: #ffffff;
      padding-left: 10px;
      line-height: 40px;
      font-size: 13px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: Regular;
      text-align: left;
      color: #323335;
      border-bottom: 1px solid #ebeef5;
    }

    .el-tree-node__content {
      margin: 3px 0;
    }
  }

  &-right {
    height: 100%;
    overflow-y: hidden;

    .avue-crud__grid {
      height: calc(100vh - 339px);
    }

    .el-card__body .el-form .el-table__inner-wrapper {
      // height: calc(100vh - 240px);
    }

    .el-tabs__nav-wrap:after {
      height: 1px;
    }

    .el-table__header-wrapper {
      // height: 40px;
      // background: #f4f8ff;
    }

    ::v-deep .el-form-item--default {
      margin-bottom: 8px;
    }

    .el-tabs__nav-wrap {
      padding-left: 30px;
    }

    .avue-crud .el-table th.el-table__cell {
      background: #f4f8ff;
      height: 40px;
      font-size: 13px;
      font-family: 'Microsoft YaHei';
      font-weight: Regular;
      text-align: center;
      color: #76849e;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    padding-right: 8px;
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
}
</style>
