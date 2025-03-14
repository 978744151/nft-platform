<template>
  <el-dialog v-model="delDialog" title="删除提示" width="40%">
    <avue-form :option="delOptions()" @submit="delSubmit" v-if="delDialog"></avue-form>
  </el-dialog>
  <el-dialog v-model="disabledDialog" title="禁用提示" width="40%">
    <avue-form :option="disabledOptions()" v-if="disabledDialog" v-model="form"></avue-form>
  </el-dialog>
  <el-dialog v-model="moveDialog" title="移动组织" width="40%">
    <avue-form ref="moveRef" :option="moveOptions()" @submit="moveSubmit" v-if="moveDialog" v-model="form"></avue-form>
  </el-dialog>
  <el-dialog v-model="addDialog" :title="operate === 'update' ? '修改' : '新增'" width="40%">
    <avue-form :option="addOptions()" v-model="form" ref="addRef" @submit="addSubmit" v-if="addDialog"></avue-form>
  </el-dialog>
  <el-dialog v-model="updateDialog" title="修改" width="40%">
    <avue-form :option="addOptions('update')" v-if="updateDialog" v-model="form" @submit="addSubmit"></avue-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import { getTree, add, update, del, move } from "@/api/organization";
import { ElMessageBox, ElNotification } from "element-plus";

interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
interface Props<T = any> {
  formProps: T;
}

const internalInstance = getCurrentInstance();
const emits = defineEmits(["getList"]);
const treeList = ref([]);
const loading = ref(true);
const delDialog = ref(false);
const operate = ref("");
const moveDialog = ref(false);
const currentTree = ref({ officeName: "" });
const expandedKeys = ref([]);
const addDialog = ref(false);
const addRef = ref();
const moveRef = ref();
const form = ref({});
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
        value: `账号名称：${currentTree.value.officeName}`,
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
    submitText: "确定禁用",
    span: 24,
    emptyBtn: false,
    column: [
      {
        label: "",
        labelWidth: 0,
        prop: "title",
        type: "title",
        value: "您确定禁用以下账户吗？",
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
        value: `账号名称：${currentTree.value.officeName}`,
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

const addOptions = (type) => {
  return {
    span: 24,
    labelPosition: "top",
    column: [
      {
        label: "上级组织",
        prop: "parentId",
        type: "tree",
        emitPath: false,
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
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
        display: operate.value === "add",
      },
      {
        label: "组织名称",
        prop: "name",
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
      {
        label: "组织编码",
        prop: "officeCode",
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
        display: operate.value === "add",
      },
      {
        label: "排序",
        prop: "sort",
        type: "input-number",
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
    ],
  };
};

const moveOptions = () => {
  return {
    span: 24,
    labelPosition: "top",
    column: [
      {
        label: "移动前组织",
        // labelWidth: 0,
        prop: "title",
        type: "title",
        value: `${currentTree.value.officeName}`,
        styles: {
          fontSize: "14px",
          fonFamily: "Source Han Sans CN, Source Han Sans CN-Regular",
          color: "#0065FF",
          margin: 0,
        },
      },
      {
        label: "移动后组织",
        prop: "targetParentId",
        type: "tree",
        emitPath: false,
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
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
    ],
  };
};

const moveSubmit = async () => {
  moveRef.value.validate(async (valid, done, msg) => {
    if (valid) {
      try {
        const { officeId } = currentTree.value;
        const { data } = await move({
          officeId,
          targetParentId: form.value.targetParentId,
        });
        ElNotification.success("操作成功");
        done();
        emits("getList");
        moveDialog.value = false;
      } catch (error) {
        done();
      }
    }
  });
};

const addSubmit = () => {
  addRef.value.validate(async (valid, done, msg) => {
    if (valid) {
      try {
        let res = {};
        if (operate.value === "update") {
          res = await update(form.value);
        } else {
          res = await add(form.value);
        }
        addDialog.value = false;
        ElNotification.success("操作成功");
        done();
        emits("getList");
      } catch (error) {
        done();
      }
    } else {
      return false;
    }
  });
};

const delSubmit = async (form, done) => {
  try {
    const { officeId } = currentTree.value;
    const { data } = await del({ officeId, forceDeleteFlag: false, status: -1 });
    ElNotification.success("操作成功");
    done();
    emits("getList");
    delDialog.value = false;
  } catch (error) {
    done();
  }
};

const openDel = (node) => {
  currentTree.value = node.data;
  delDialog.value = true;
};

const openMove = (node) => {
  form.value.title = node.data.officeName;
  currentTree.value = node.data;
  moveDialog.value = true;
};

const openAdd = (node, type) => {
  operate.value = type;
  currentTree.value = node.data;
  const { officeId, officeName, sort } = node.data;
  if (type === "update") {
    form.value = { officeId, name: officeName, sort };
  } else {
    form.value = { parentId: node.data.officeId };
  }
  addDialog.value = true;
};
defineExpose({
  openAdd,
  openMove,
  openDel,
});
</script>

<style lang="scss"></style>
