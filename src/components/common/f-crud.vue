<template>
  <div>
    <avue-crud v-loading="data.listLoading" @search-reset="resetList" elemenat-loading-text="Loading..."
      element-loading-spinner="svg" ref="crud" v-model:page="data.page" v-model:search="data.tForm" v-model="data.tForm"
      @row-update="rowEdit" @row-save="rowSave" @search-change="handleFilter" @size-change="sizeChange"
      @current-change="currentChange" @row-del="rowDelete" @refreshChange="handleRefreshChange" :data="data.list"
      :option="option()" :beforeOpen="beforeOpen" @selection-change="selectionChange">
      <template #menu="{ row }">
        <slot name="menu" :row="row"></slot>
      </template>
      <template #menu-left="{ row }">
        <slot name="menuLeft" :row="row"></slot>
      </template>
      <template #search="{ row }">
        <slot name="search" :row="row"></slot>
      </template>
      <template #search-menu="{ row }">
        <slot name="search-menu" :row="row"></slot>
      </template>
      <template #appLogoUrl="{ row }">
        <slot name="appLogoUrl" :row="row"></slot>
      </template>
    </avue-crud>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, ref, onMounted } from "vue";
import { useTable } from "@/utils/use-table";
interface Props<T = any> {
  operate: T;
  modelValue: T;
  formProps?: T;
  option: T;
}
const props = withDefaults(defineProps<Props>(), {
  operate: {
    getList: "",
    postUrl: "",
    putUrl: "",
    delUrl: "",
  },
  modelValue: {},
  formProps: {},
  option: () => { },
});
const crud = ref<HTMLElement | null | any>(null);
const data = reactive({
  page: {
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: props.formProps.pageSize || 20, // 每页显示多少条,
    isAsc: false, //是否倒序
  },
  listLoading: true,
  // Api,
  getList: props.operate.getList,
  postUrl: props.operate.postUrl,
  putUrl: props.operate.putUrl,
  delUrl: props.operate.delUrl,
  props: props.formProps,
  query: {},
  list: [],
  tForm: {},
});
const emit = defineEmits(["update:modelValue", 'selectionChange']);
const beforeOpen = (done: Function) => {
  crud.value.dicInit();
  done();
};

watch(
  () => data.tForm,
  (value) => {
    emit("update:modelValue", value);
  }
);
onMounted(() => {
  data.tForm = props.modelValue;
});
const selectionChange = (list) => {
  emit('selectionChange', list)
}
const resetList = () => {
  getList()
}
const {
  getList,
  rowSave,
  rowEdit,
  rowDelete,
  handleFilter,
  handleRefreshChange,
  currentChange,
  sizeChange,

} = useTable(data);
defineExpose({
  getList,
  rowSave,
  rowEdit,
  rowDelete,
  handleFilter,
  handleRefreshChange,
  currentChange,
  sizeChange,
  data,
  crud,
});
</script>
