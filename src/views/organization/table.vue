<template>
  <div class="">
    <f-crud ref="tcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form" class="p-[12px] pt-0">
      <template #menuLeft="{ row }">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="openAdd(row, 'add')"
          >新增</el-button
        > -->
        <el-button type="primary" @click="handleBsUser">同步组织</el-button>

      </template>

      <template #menu="{ row }">
        <el-button type="primary" link @click="openAdd(row, 'add')">添加下级 </el-button>
        <el-button type="primary" link @click="openAdd(row, 'update')" v-if="row.source != 1">编辑 </el-button>
        <el-button type="primary" link @click="openMove(row)" v-if="row.source != 1">移动 </el-button>
        <el-button type="primary" link @click="openDel(row)" v-if="row.source != 1">删除 </el-button>
      </template>
    </f-crud>
    <deptDialog ref="refDialog" @getList="changeList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";

import { ElMessage } from 'element-plus'


import deptDialog from "./deptDialog.vue";
import { avueCrudConfig } from "@/plugins/common";
import { syncAllOffice } from "@/api/user";

interface Props<T = any> {
  formProps: T;
}
const props = withDefaults(defineProps<Props>(), {
  formProps: {},
});
const operate = ref({
  getList: "/office/getOfficePageList",
  postUrl: "/admin/data/area",
  putUrl: "/admin/data/area",
  delUrl: "/admin/data/area/",
});
const emits = defineEmits(["changeTreeList"]);

const formProps = ref({ officeId: "" });
const form = ref({ status: "", userName: "", includedSub: true });
const tcrud = ref(null);

const refDialog = ref();
watch(
  () => props.formProps.officeId,
  (val) => {
    formProps.value.officeId = val;
    tcrud.value.getList();
  },
  { deep: true }
);
onMounted(async () => {
  tcrud.value.getList();
});

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
    menuWidth: 300,
    // emptyBtn: false,
    column: [
      {
        label: "组织代码",
        prop: "officeCode",
        overHidden: true,
        align: "center",
      },
      {
        label: "组织名称",
        prop: "name",
        overHidden: true,
        align: "center",
      },
      {
        label: "上级组织",
        prop: "parentName",
        overHidden: true,
        align: "center",
      },
      {
        label: "来源",
        prop: "source",
        overHidden: true,
        align: "center",
      },
      {
        label: "排序",
        prop: "sort",
        overHidden: true,
        align: "center",
      },

      {
        placeholder: "组织名称",
        prop: "officeName",
        search: true,
        hide: true,
      },
      {
        prop: "source",
        placeholder: "来源",
        search: true,
        hide: true,
        tip: '来源',
        type: "select",
        dicData: [
          {
            label: "认证中心",
            value: 0,
          },
          {
            label: "北森",
            value: "1",
          },
        ],
      },
    ],
  };
};

const handleBsUser = async () => {
  await syncAllOffice()
  ElMessage.success('成功')
}

const openAdd = (node, type) => {
  refDialog.value.openAdd(
    { data: { ...node, officeName: node.name, officeId: node.id } },
    type
  );
};
const openMove = (node) => {
  refDialog.value.openMove({
    data: { ...node, officeName: node.name, officeId: node.id },
  });
};
const openDel = (node) => {
  refDialog.value.openDel({
    data: { ...node, officeName: node.name, officeId: node.id },
  });
};
const changeList = () => {
  emits("changeTreeList", formProps.value);
};
const getTableList = () => {
  tcrud.value.getList();
};
defineExpose({
  getTableList,
});
</script>

<style lang="scss" scope>
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

    .avue-crud__search .el-card__body {
      padding-bottom: 2px !important;
    }

    .el-tabs__nav-wrap:after {
      height: 1px;
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
