<template>
  <div class="app-role-page flex">
    <avue-crud :data="data" class="p-[12px]" :option="option" @refresh-change="refreshChange" @row-update="rowUpdate"
      @row-del="rowDel">
      <template #menu-left="{}">
        <el-button type="primary" icon="el-icon-plus" @click="rowAdd">新增</el-button>
      </template>
      <template #menu="{ size, row, index }">
        <el-button @click="tip(row, index)" icon="el-icon-check" text type="primary" :size="size">编辑</el-button>
      </template>
    </avue-crud>
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
import type Node from "element-plus/es/components/tree/src/model/node";
import Drawer from "@/components/g-dialog/index.vue";
import RoleForm from "./form.vue";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
let id = 1000;
const drawerVisible = ref(false);
const activeName = ref("first");
const data = ref([
  {
    id: 1,
    name: "张三",
    sex: "男",
  },
  {
    id: 2,
    name: "李四",
    sex: "女",
  },
]);
const option = {
  addBtn: false,
  border: true,
  editBtn: false,
  searchSpan: 5,
  searchLabelWidth: 1,
  searchIcon: true,
  searchGutter: 20,
  searchMenuSpan: 4,
  dialogFullscreen: true,
  index: true,
  indexClassName: "序号",
  column: [
    {
      prop: "name",
      placeholder: "全部应用名称",
      search: true,
      hide: true,
      type: "select",
    },
    {
      prop: "name",
      placeholder: "请输入角色名称",
      search: true,
      hide: true,
    },

    {
      label: "角色管理",
      prop: "sex",
    },
    {
      label: "描述",
      prop: "sex",
    },
    {
      label: "授权系统",
      prop: "sex",
    },
    {
      label: "状态",
      prop: "sex",
    },
    {
      label: "创建人",
      prop: "sex",
    },
    {
      label: "修改人",
      prop: "sex",
    },
    {
      label: "修改时间",
      prop: "sex",
    },
  ],
};

const rowAdd = () => {
  // refs.crud.rowAdd()
  drawerVisible.value = true;
};
const append = (data: Tree) => {
  const newChild = { id: id++, label: "工品一号", children: [] };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  dataSource.value = [...dataSource.value];
};

const remove = (node: Node, data: Tree) => {
  const parent = node.parent;
  const children: Tree[] = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === data.id);
  children.splice(index, 1);
  dataSource.value = [...dataSource.value];
};

const renderContent = (
  h,
  {
    node,
    data,
    store,
  }: {
    node: Node;
    data: Tree;
    store: Node["store"];
  }
) => {
  return h(
    "span",
    {
      class: "custom-tree-node",
    },
    h("span", null, node.label),
    h(
      "span",
      null,
      h(
        "a",
        {
          onClick: () => append(data),
        },
        "Append "
      ),
      h(
        "a",
        {
          style: "margin-left: 8px",
          onClick: () => remove(node, data),
        },
        "Delete"
      )
    )
  );
};

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: "工品一号1",
    children: [
      {
        id: 4,
        label: "工品一号1-1",
        children: [
          {
            id: 9,
            label: "工品一号1-1-1",
          },
          {
            id: 10,
            label: "工品一号1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "工品一号one 2",
    children: [
      {
        id: 5,
        label: "工品一号two 2-1",
      },
      {
        id: 6,
        label: "工品一号two 2-2",
      },
    ],
  },
  {
    id: 3,
    label: "工品一号one 3",
    children: [
      {
        id: 7,
        label: "工品一号two 3-1",
      },
      {
        id: 8,
        label: "工品一号two 3-2",
      },
    ],
  },
]);
</script>

<style lang="scss" scope>
.app-role-page {
  background-color: #ffffff;
  height: 100%;

  &-left {
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
