<template>
  <div class="app-role-page flex">
    <div class="app-role-page-left">
      <TreeForm @nodeClick="nodeClick" ref="treeRef" @changeTreeList="changeTreeList" />
    </div>
    <div class="app-role-page-right flex-1 overflow-x-auto">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账户" name="first">
          <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form"
            @selectionChange="selectionChange" class="p-[12px] pt-0 pb-0">
            <template #menuLeft="{ row }">
              <el-button type="primary" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
              <el-button type="primary" @click="handleAuthorizeVisible">批量授权</el-button>
              <el-button type="primary" @click="handleBsUser" v-if="userSync">同步北森用户</el-button>
              <!-- <el-button type="primary" @click="handleBsUser('all')">全量同步北森用户</el-button> -->
            </template>
            <template #search-menu="{ row }">
              <el-button type="" @click="handleReset" icon="delete">重置</el-button>
            </template>
            <template #menu="{ row }">
              <el-button type="primary" link @click="rowAdd(row)">编辑 </el-button>
              <el-button type="primary" link @click="openStatus(row)">{{ row.status == 1 ? "禁用" : "启用" }}
              </el-button>
              <el-button type="primary" link @click="openRule(row)">
                应用授权
              </el-button>
              <el-button @click="resetPassword(row)" type="primary" link>重置密码</el-button>
              <el-button @click="openLog(row)" type="primary" link>日志</el-button>
              <!-- <el-button type="primary" link @click="rowAdd(row)">重置密码 </el-button>
              <el-button type="danger" link @click="openDel(row)">删除 </el-button> -->
              <el-dropdown v-if="row.source != 1">
                <span class="el-dropdown-link ml-4" style="
                    color: #0065ff;
                    font-size: 20px;
                    height: 13px;
                    display: flex;
                    align-items: center;
                  ">
                  ...
                </span>
                <template #dropdown>
                  <el-dropdown-menu>

                    <!-- <el-dropdown-item @click="openStatus(row)" v-if="row.source != 1">{{
                      row.status == 1 ? "禁用" : "启用"
                    }}</el-dropdown-item> -->
                    <el-dropdown-item @click="openDel(row)" v-if="row.source != 1">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </f-crud>
        </el-tab-pane>
        <el-tab-pane label="组织" name="second">
          <deptTable ref="deptTableRef" :formProps="formProps" @changeTreeList="changeTreeList" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <Drawer v-if="ruleVisible">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header-title">应用信息-{{ rowDetail.name }}</div>
          <div>
            <el-button @click="ruleVisible = false">返回</el-button>

          </div>
        </div>
      </template>
      <template #content>
        <RuleForm ref="ruleFormRef" :rowDetail="rowDetail" @done="done" />
      </template>
    </Drawer>
    <Drawer v-if="drawerVisible">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header-title"> {{ rowDetail?.id ? "编辑" : "新增" }}账户</div>
          <div>
            <el-button @click="drawerVisible = false">返回</el-button>
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button type="primary" v-if="!rowDetail?.id" @click="save('continue')">保存并继续</el-button>
          </div>
        </div>
      </template>
      <template #content>
        <RoleForm ref="roleFormRef" :rowDetail="rowDetail" @done="done" />
      </template>
    </Drawer>
    <Drawer v-if="drawerDetailVisible">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header-title">应用信息</div>
          <div>
            <el-button @click="drawerDetailVisible = false">返回</el-button>
            <!-- <el-button type="primary" @click="save">重置密码</el-button>
            <el-button type="primary" @click="openStatus(rowDetail)">{{
              rowDetail.status == 1 ? "禁用" : "启用"
            }}</el-button>
            <el-button type="danger" @click="openDel(rowDetail)">删除</el-button> -->
          </div>
        </div>
      </template>
      <template #content>
        <roleFormDetail ref="roleDetailRef" :rowDetail="rowDetail" @done="done" />
      </template>
    </Drawer>
    <el-drawer title="授权应用" size="1000" v-model="authorizeVisible" :close-on-click-modal="false">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">批量授权应用</h4>
        <el-button type="primary" class="mr-[12px]" @click="confirmSubmit">
          确认授权
        </el-button>
      </template>
      <many-authorize :selectList="selectList" ref="manyAuthorizeRef" v-if="authorizeVisible"
        @done="authorizeVisible = false" />
    </el-drawer>
    <el-dialog v-model="disabledDialog" :title="currentTree.status == 1 ? '禁用提示' : '启用提示'" width="40%">
      <avue-form :option="disabledOptions()" v-if="disabledDialog" v-model="disForm" @submit="handleStatus"></avue-form>
    </el-dialog>
    <el-dialog v-model="delDialog" title="删除提示" width="40%">
      <avue-form :option="delOptions()" @submit="delSubmit" v-if="delDialog"></avue-form>
    </el-dialog>
    <el-dialog v-model="passDialog" title="修改密码" width="600px">
      <avue-form :option="passwordOptions()" @submit="updatePassSubmit" v-if="passDialog"></avue-form>
    </el-dialog>
    <el-dialog v-model="drawerLogVisible" title="操作日志" width="800px">
      <logList v-if="drawerLogVisible" :rowDetail="rowDetail"></logList>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";

import Drawer from "@/components/g-dialog/index.vue";
import RoleForm from "./form.vue";
import ManyAuthorize from './many-authorize.vue'

import RuleForm from "./rule-form.vue";
import RoleFormDetail from "./detail.vue";
import logList from "./logList.vue";

import deptTable from "./table.vue";
import { ElNotification, ElMessage } from "element-plus";
import TreeForm from "./tree.vue";
import { avueCrudConfig } from "@/plugins/common";
import { getDetail, disableUser, enableUser, deleteUser, updatePassword, syncAllItalentUser, syncItalentUser } from "@/api/user";
import { getUserPermissionIdentitie } from '@/api/user'
import { getStore } from '@/plugins/store';


const operate = ref({
  getList: "/user/getUserPageList",
  postUrl: "/admin/data/area",
  putUrl: "/admin/data/area",
  delUrl: "/admin/data/area/",
});
const form = ref<{ status: string; userName: string; includedSub: boolean; source: string; italentJobId: string }>({
  status: "1",
  userName: "",
  includedSub: true,
  source: '',
  italentJobId: ''
});
const roleFormRef = ref(null);
const fcrud = ref(null);
const drawerLogVisible = ref(false);
const drawerVisible = ref(false);
const passDialog = ref(false)
const activeName = ref("first");
const rowDetail = ref<Record<string, any>>({});
const userId = ref()
const treeRef = ref();
const manyAuthorizeRef = ref(null)
const deptTableRef = ref();
const disabledDialog = ref(false);

const delDialog = ref(false);
const drawerDetailVisible = ref(false);

const authorizeVisible = ref(false)

const selectList = ref([])

const ruleVisible = ref(false);
const ruleFormRef = ref(null);

const currentTree = ref<Record<string, any>>({});
const userInfo = computed(() => getStore({ name: 'userInfo' }))
const userSync = ref(false)
const formProps = ref({
  officeId: "",
  pageSize: 20,
});
const disForm = ref<Record<string, any>>({});
onMounted(async () => {
  fcrud.value.getList();
  try {
    const { data } = await getUserPermissionIdentitie({ username: userInfo.value.username })
    console.log(data)
    userSync.value = data.resultData.includes('user:sync')
    console.log(1234, userSync.value)
  }
  catch (err) { }
});

// 主组件刷新处理
getCurrentInstance().proxy.$eventBus.on('/g-user/organization', async () => {
  activeName.value = 'first';
  drawerVisible.value = false;
  handleReset();
});

onActivated(() => {
  fcrud.value.getList();
})
const resetPassword = (row) => {
  userId.value = row.id
  passDialog.value = true
}
const openLog = async (row) => {
  const { data } = await getDetail({ userId: row.id });
  rowDetail.value = data.resultData;
  drawerLogVisible.value = true;
}
const passwordOptions = (node = {}) => {
  return {
    submitText: "确定修改",
    span: 24,
    emptyBtn: false,

    column: [
      {
        label: "新密码",
        prop: "newPassword",
        type: "input",
        placeholder: '密码必须由6-20位字母和数字组成'
      },
      {
        label: "确认密码",
        prop: "confirmPassword",
        type: "password",
        placeholder: '密码必须由6-20位字母和数字组成'
      },
    ],
  };
};
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
        value: "您确定删除以下账户吗？删除后不可自动恢复。",
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
        value: `账号名称：${disForm.value.officeName}/${disForm.value.name}`,
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
const disabledOptions = () => {
  return {
    submitText: `确定${disForm.value.status == 1 ? "禁用" : "启用"}`,
    span: 24,
    emptyBtn: false,
    column: [
      {
        label: "",
        labelWidth: 0,
        prop: "title",
        type: "title",
        value: `您确定${disForm.value.status == 1 ? "禁用" : "启用"}以下账户吗？`,
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
        value: `账号名称：${disForm.value.officeName}/${disForm.value.name}`,
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
    selection: true,
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
    menuWidth: 350,
    menuAlign: 'center',
    align: "center",
    searchSpan: 3,
    searchIndex: 6,
    emptyBtn: false,
    searchMenuSpan: 6,
    column: [
      {
        label: "员工姓名",
        prop: "name",
        overHidden: true,
        align: "center",
        width: 120,
      },
      {
        label: "登录名称",
        prop: "username",
        width: 120,
        align: "center",

        overHidden: true,
      },
      {
        label: "组织",
        prop: "officeName",
        width: 280,
        overHidden: true,
      },
      {
        label: "职务",
        prop: "jobName",
        width: 150,
        overHidden: true,
        align: "left",
      },

      {
        label: "上级领导",
        prop: "parentName",
        width: 120,
        overHidden: true,
        align: "center",
      },


      {
        label: "手机号码",
        prop: "mobile",
        width: 120,
        overHidden: true,
      },
      {
        label: "邮箱",
        prop: "email",
        width: 200,
        overHidden: true,
      },
      {
        label: "来源",
        prop: "sourceName",
        overHidden: true,
        align: "center",
      },
      {
        label: "账户状态",
        prop: "statusName",
        overHidden: true,
        align: "center",
        width: 120,
      },
      {
        prop: "userName",
        placeholder: "账号名 / 姓名",
        search: true,
        hide: true,
        span: 6,
      },
      {
        prop: "status",
        placeholder: "状态",
        search: true,
        hide: true,
        type: "select",
        tip: '状态',
        dicData: [
          {
            label: "禁用",
            value: "0",
          },
          {
            label: "启用",
            value: "1",
          },
        ],
        span: 6,
        width: 120,

      },
      {
        prop: "source",
        placeholder: "来源",
        search: true,
        hide: true,
        type: "select",
        tip: '来源',

        dicData: [
          {
            label: "北森",
            value: "1",
          },
          {
            label: "认证中心",
            value: "0",
          },
        ],
        span: 6,
        width: 120,
      },
      {
        label: "",
        prop: "italentJobId",
        type: "select",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        placeholder: "职务",
        hide: true,
        search: true,
        dicUrl: "/user/getAllJob",
        props: {
          label: "jobName",
          value: "jobId",
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
        disabled: form.value.source == '1'
      },
      {

        span: 6,
        label: "",
        prop: "includedSub",
        searchLabelWidth: "auto",
        type: "select",
        search: true,
        hide: true,
        value: true,
        searchType: "select",
        // searchWidth: 6,
        tip: '是否包含子节点下的账号',
        placeholder: "包含子节点下的账号",
        border: true,
        clearable: false,
        dicData: [
          {
            label: "否",
            value: false,
          },
          {
            label: "是",
            value: true,
          },
        ],
      },
      {
        label: "",
        prop: "roleId",
        type: "select",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        placeholder: "角色",
        hide: true,
        search: true,
        dicUrl: "/role/getListInfo?pageSize=10000",
        props: {
          label: "roleName",
          value: "roleId",
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData.list;
        },
        disabled: form.value.source == '1'
      },
    ],
  };
};
const openRule = async (row) => {
  if (row?.id) {
    const { data } = await getDetail({ userId: row.id });
    rowDetail.value = data.resultData;
  } else {
    rowDetail.value = {};
  }
  ruleVisible.value = true
}
const handleReset = () => {
  form.value.userName = ''
  form.value.source = ''
  form.value.italentJobId = ''
  form.value.includedSub = true
  form.value.status = "1"
  fcrud.value?.currentChange(1);
}
const updatePassSubmit = async (form, done) => {
  try {
    const { data } = await updatePassword({ ...form, userId: userId.value });
    console.log(data)
    if (data.resultCode === '0') {
      ElNotification.success("操作成功");
      passDialog.value = false

    }
    done()
  } catch (error) {
    done()
  }

}

const handleBsUser = async (type) => {
  if (type === 'all') {
    await syncAllItalentUser({})
  } else {
    await syncItalentUser({})
  }
  ElMessage.success('成功')

}

const openStatus = (row) => {
  currentTree.value = row;
  disForm.value = row;
  disabledDialog.value = true;
};

const openDel = (row) => {
  console.log(row);
  disForm.value = row;
  delDialog.value = true;
};

const save = (type?) => {
  roleFormRef.value.submit(type);
};

const changeTreeList = (value) => {
  treeRef.value.getList();
  deptTableRef.value.getTableList();
};

const handleAuthorizeVisible = () => {
  console.log(fcrud.value.crud)
  authorizeVisible.value = true
}

const confirmSubmit = () => {
  manyAuthorizeRef.value.confirm()
};
const selectionChange = (list) => {
  const statusList = list.filter(e => e.status === 1)
  selectList.value = statusList.map(e => e.id)
}
const nodeClick = (officeId) => {
  formProps.value.officeId = officeId;
  fcrud.value.getList();
};

const done = (type) => {
  if (type !== 'continue') {
    drawerVisible.value = false;
  }
  ruleVisible.value = false
  fcrud.value.getList();
};

const handleStatus = async () => {
  // const status = row.status === 1 ? 0 : 1;
  if (disForm.value.status === 1) await disableUser({ userId: disForm.value.id });
  if (disForm.value.status === 0) await enableUser({ userId: disForm.value.id });
  fcrud.value.getList();
  disabledDialog.value = false;
};

const rowAdd = async (row?) => {
  if (row?.id) {
    const { data } = await getDetail({ userId: row.id });
    rowDetail.value = data.resultData;
  } else {
    rowDetail.value = { officeId: formProps.value.officeId };
  }
  drawerVisible.value = true;
};

const delSubmit = async (form, done) => {
  try {
    await deleteUser({ userId: disForm.value.id });
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

    // overflow-y: hidden;
    ::v-deep .avue-crud__tip {
      display: none;
    }

    .avue-crud__grid {
      height: calc(100vh - 339px);
    }

    ::v-deep .el-form-item--default {
      margin-bottom: 8px;
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

  ::v-deep .el-drawer__header {
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 0;
    padding-bottom: 15px;
    height: 50px;
  }
}
</style>
