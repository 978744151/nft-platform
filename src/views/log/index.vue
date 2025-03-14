<template>
  <div class="app-log-page flex pt-[10px]">
    <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form"
      class="p-[12px] w-full">
    </f-crud>
    <Drawer v-if="drawerVisible">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header-title">新增账户</div>
          <div>
            <el-button @click="drawerVisible = false">返回</el-button>
            <el-button type="primary">保存</el-button>
            <el-button type="primary">保存并继续</el-button>
          </div>
        </div>
      </template>
      <template #content>
        <RoleForm />
      </template>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Drawer from "@/components/g-dialog/index.vue";
import { avueCrudConfig } from "@/plugins/common";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
const form = ref({ status: "", userName: "", includedSub: true });
const operate = ref({
  getList: "/getItalentSyncLogList",
  postUrl: "/admin/data/area",
  putUrl: "/admin/data/area",
  delUrl: "/admin/data/area/",
});
const fcrud = ref(null);
const drawerVisible = ref(false);
const formProps = ref({ pageSize: 16 });
const option = () => {
  return {
    addBtn: false,
    border: true,
    editBtn: false,
    ...avueCrudConfig,
    index: true,
    delBtn: false,
    align: 'center',
    header: false,
    column: [
      {
        label: "北森修改人",
        prop: "operatorName",
      },
      {
        label: "动作",
        prop: "actionTypeName",
      },
      {
        label: "类型",
        prop: "typeName",
      },
      {
        label: "同步前组织名称",
        prop: "name",

      },
      {
        label: "同步前信息",
        prop: "beforeUpdate",
        showOverflowTooltip: true,
        overHidden: true,
        width: 250
      },
      {
        label: "同步后信息",
        prop: "afterUpdate",
        showOverflowTooltip: true,
        overHidden: true,
        width: 250
      },
      {
        label: "创建时间",
        prop: "createTime",
        width: 200,
        align: 'center'
      },
      {
        prop: "beforeUpdate",
        search: true,
        hide: true,
        placeholder: "修改前信息搜索",
        showOverflowTooltip: true,
        width: 250,
        overHidden: true,
      },
      {
        prop: "afterUpdate",
        search: true,
        hide: true,
        placeholder: "修改后信息搜索",

      },
      {
        prop: "actionType",
        placeholder: "操作类型",
        search: true,
        hide: true,
        type: "select",
        dicData: [
          {
            label: "新增",
            value: "1",
          },
          {
            label: "修改",
            value: "2",
          },
          {
            label: "禁用",
            value: "3",
          },
        ],
      },
    ],
  };
};
// 主组件刷新处理
getCurrentInstance().proxy.$eventBus.on('/g-user/log', async () => {

  fcrud.value?.crud.searchReset();
  fcrud.value?.currentChange(1);
});
onMounted(async () => {
  fcrud.value.getList();
});

onActivated(() => {
  fcrud.value.getList();
})

const rowAdd = () => {
  // refs.crud.rowAdd()
  drawerVisible.value = true;
};
</script>

<style lang="scss" scope>
.app-log-page {
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  overflow-y: auto;

  e &-left {
    border-right: 1px solid #ebeef5;

    &-title {
      width: 166px;
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
}
</style>
