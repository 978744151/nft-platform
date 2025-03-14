<template>
  <div class="app-role-page-left-title">组织架构</div>
  <ElScrollbar style="min-width: 166px; height: 100%; padding-bottom: 50px" class="overflow-auto" v-if="!loading">
    <el-tree v-loading="loading" :data="treeList" node-key="officeId" :highlight-current="true"
      :expand-on-click-node="false" @node-click="nodeClick" :default-expanded-keys="expandedKeys">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.officeName }}</span>
          <el-dropdown>
            <span class="el-dropdown-link ml-2" style="color: #0065ff; font-size: 20px; height: 33px">
              ...
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openAdd(node, 'add')">创建组织</el-dropdown-item>
                <el-dropdown-item @click="openAdd(node, 'update')" v-if="node.data.source != 1">编辑组织</el-dropdown-item>
                <!-- <el-dropdown-item @click="openMove(node)">移动组织</el-dropdown-item> -->
                <el-dropdown-item @click="openDel(node)" v-if="node.data.source != 1">删除组织</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown></span>
      </template>
    </el-tree>
  </ElScrollbar>
  <deptDialog ref="refDialog" @getList="changeList" />
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import { getTree, add, update, del, move } from "@/api/organization";
import { ElMessageBox, ElNotification } from "element-plus";
import deptDialog from "./deptDialog.vue";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
let id = 1000;
const internalInstance = getCurrentInstance();
const emits = defineEmits(["nodeClick"]);
const treeList = ref([]);
const loading = ref(true);
const delDialog = ref(false);
const operate = ref("");
const moveDialog = ref(false);

const refDialog = ref();
const expandedKeys = ref([]);
const addDialog = ref(false);
const addRef = ref();
const moveRef = ref();
const form = ref({});

onMounted(async () => {
  getList();
});

const getList = async () => {
  const { data } = await getTree({});
  treeList.value = data.resultData;
  data.resultData[0].children.map((e) => {
    expandedKeys.value.push(e.officeId);
  });
  loading.value = false;
};

const nodeClick = (node) => {
  emits("nodeClick", node.officeId);
};

const openDel = (node) => {
  refDialog.value.openDel(node);
};

const openMove = (node) => {
  refDialog.value.openMove(node);
};

const openAdd = (node, type) => {
  console.log(node);
  refDialog.value.openAdd(node, type);
};

const changeList = () => {
  emits("changeTreeList");
};
defineExpose({
  getList,
});
</script>

<style lang="scss"></style>
