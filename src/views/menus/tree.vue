<template>
  <div>
    <div class="app-menu-page-left-title">应用</div>
    <ElScrollbar style="min-width: 166px; height: 100%; padding-bottom: 50px" class="overflow-auto">
      <el-tree v-loading="loading" :data="treeList" node-key="id" :highlight-current="true" @node-click="nodeClick"
        ref="treeRef">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.name }}</span>
          </span>
        </template>
      </el-tree>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props<T = any> {
  treeList: T;
}
const props = withDefaults(defineProps<Props>(), {
  treeList: () => []
});

let id = 1000;
const emits = defineEmits(["nodeClick"]);
const loading = ref(true);

const treeRef = ref()

onMounted(async () => {
  getList();
});
const getList = async () => {
  loading.value = true;
  await nextTick().then(() => {
    treeRef.value?.setCurrentKey('1')
  })
  loading.value = false;
};

const nodeClick = (node) => {
  emits("nodeClick", node.id);
};

defineExpose({
  getList,
});
</script>

<style lang="scss" scoped></style>
