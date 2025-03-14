<template>
  <div class="">
    <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form">
      <template #menuLeft="{ row }">
        <el-button type="primary" icon="el-icon-plus" @click="rowAdd()">新增</el-button>
      </template>
      <template #menu="{ row }">
        <el-button type="primary" link @click="rowAdd(row)">编辑 </el-button>
        <el-button type="primary" link @click="rowDelete(row)">移除 </el-button>
      </template>
      <template #appLogoUrl="{ row }">
        <img v-if="row.appLogoUrl" :src="row.appLogoUrl" alt="" width="60px" height="60px">
      </template>
    </f-crud>
    <el-dialog title="授权应用" width="800" v-model="drawer">
      <Authorize v-if="drawer" :drawerDetail="drawerDetail" :list="fcrud.data.list" :rowDetail="rowDetail"
        @done="done" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { add, update } from "@/api/user";
import { revokeRole } from "@/api/role";
import { ElNotification, ElMessageBox } from "element-plus";
import Authorize from './authorize.vue'

// Define proper interfaces for the data structures
interface RowDetail {
  id?: string | number
  userId?: string | number
  appId?: string | number
  [key: string]: any
}
interface FormData {
  id?: string | number
  [key: string]: any
}

interface ColumnOption {
  label: string
  prop: string
  type?: string
  rules?: Array<{
    required: boolean
    trigger: string
    message: string
  }>
  dicUrl?: string
  props?: {
    label: string
    value: string
  }
  filterable?: boolean
  dicFormatter?: (res: any) => any
}

interface TableOption {
  addBtn: boolean
  border: boolean
  editBtn: boolean
  menuBtn: boolean
  labelPosition: string
  delBtn: boolean
  labelSuffix: string
  align: string
  column: ColumnOption[],
  columnBtn: boolean
}
interface Props<T = any> {
  rowDetail: T;
}

const emits = defineEmits(["done"]);

const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
});
const operate = ref({
  getList: "/userRole/getUserRoles",
  postUrl: "/admin/data/area",
  putUrl: "/admin/data/area",
  delUrl: "/admin/data/area/",
});
const formRef = ref();
const form = ref<FormData>({})
const drawer = ref(false)
const formProps = ref({
  userId: props.rowDetail.id
})
const drawerDetail = ref({})
const fcrud = ref()
const option = (): TableOption => {
  return {
    addBtn: false,
    border: true,
    editBtn: false,
    menuBtn: false,
    labelPosition: "top",
    delBtn: false,
    labelSuffix: "  ",
    align: 'center',
    columnBtn: false,
    column: [
      {
        label: "应用图标",
        prop: "appLogoUrl",
      },

      {
        label: "应用名称",
        prop: "appName",
        type: "input",

      },

      {
        label: "应用状态",
        prop: "appStatus",
        type: "select",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ]
      },
      {
        label: "角色",
        prop: "roleNames",
        type: "select",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        dicUrl: "/user/getAllJob",
        props: {
          label: "jobName",
          value: "jobId",
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
      },


    ],
  };
}

onMounted(async () => {
  await fcrud.value.getList();
  if (props.rowDetail) {
    form.value = props.rowDetail;
  }
});
const done = () => {
  drawer.value = false
  fcrud.value.getList();
}
const rowDelete = async (row) => {
  ElMessageBox.confirm(
    '确认要移除吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await revokeRole({
        userId: row.userId,
        appId: row.appId
      })
      ElNotification.success("操作成功");
      await fcrud.value.getList();
    })
    .catch(() => {

    })

}

const rowAdd = (row?: RowDetail) => {
  console.log(row)
  if (row?.appId) {
    drawerDetail.value = row
  } else {
    drawerDetail.value = { appId: '' }
  }
  drawer.value = true
}


const submit = (type) => {
  formRef.value.validate(async (valid, done, msg) => {
    done();
    if (valid) {
      let res = {};
      if (form.value.id) {
        res = await update(form.value);
      } else {
        res = await add(form.value);
      }
      if (res.data.resultCode === "0") {
        console.log(type);
        if (type) {
          emits("done");
        }
        ElNotification.success("操作成功");
      }
      done();
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

defineExpose({
  submit,
  formRef,
});
</script>

<style lang="scss" scoped>
.role-form {
  height: 100%;
  width: 70%;

  // .l
  .el-form--label-top .el-form-item {
    width: 300px;
    margin-bottom: 26px;

    .el-select__wrapper {
      // height: 36px;
      background: #ffffff;
      // border: 1px solid #dcdfe6;
      border-radius: 4px;
    }

    .el-input__inner {
      font-size: 14px;
      font-family: 'Microsoft YaHei';
      // height: 36px;
    }
  }


}

::v-deep .avue-crud__search .el-card__body {
  padding-bottom: 0 !important;
}
</style>
