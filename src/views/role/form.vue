<template>
  <div class="role-form flex">
    <avue-form ref="formRef" :option="option" @submit="submit" v-model="form">
    </avue-form>

    <div v-loading="loading" v-if="form.appId">
      <p style="font-size: 14px; margin-bottom: 10px">角色授权:</p>
      <el-scrollbar>
        <el-tree style="height: 100%;overflow:auto; width: 300px" :data="resourceList" ref="treeRef" show-checkbox
          highlight-current node-key='id' :props="{
            children: 'children',
            label: 'name',
            value: 'id'
          }"></el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { add, update, getAllResourceListWithPermission } from "@/api/role";
import { ElNotification } from "element-plus";
import { getStore } from "@/plugins/store";
const emits = defineEmits(["done"]);
interface Props<T = any> {
  rowDetail: T;
}
const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
});
const formRef = ref();
const form = ref({ resourceIds: [], appId: '' });
const resourceList = ref([]);
const treeRef = ref()
const loading = ref(true)
const userInfo = computed(() => getStore({ name: 'userInfo' }))

const option = {
  addBtn: false,
  border: true,
  editBtn: false,
  menuBtn: false,
  labelPosition: "top",
  labelSuffix: "  ",
  // span: 8,
  // gutter: 100,
  column: [

    {
      label: "角色名称",
      prop: "name",
      emitPath: false,
      maxlength: 20,
      type: 'input',
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
    },
    // {
    //   label: "角色授权",
    //   prop: "resourceIds",
    //   type: "tree",
    //   emitPath: false,
    //   multiple: true,
    //   collapseTags: true,
    //   maxCollapseTags: 2,
    //   collapseTagsTooltip: true,
    //   rules: [
    //     {
    //       required: true,
    //       trigger: "blur",
    //       message: "这个必填哦",
    //     },
    //   ],
    //   dicUrl: "/resource/getAllResourceList",
    //   checkStrictly: true,
    //   props: {
    //     label: "name",
    //     value: "id",
    //     children:'children'
    //   },
    //   filterable: true,
    //   dicFormatter: (res) => {
    //     return res.resultData;
    //   },
    // },
    {
      label: "应用系统",
      prop: "appId",
      type: "select",
      // multiple:true,
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
      filterable: true,
      dicFormatter: (res) => {
        return res.resultData.map(e => {
          return {
            name: e.name,
            id: e.id
          }
        });
      },
    },


    {
      label: "状态",
      prop: "status",
      // display: props.rowDetail.roleId ? false : true,
      type: "select",
      dicData: [
        {
          label: "启用",
          value: 1,
        },
        {
          label: "禁用",
          value: 0,
        },
      ],
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },

    {
      label: "组织",
      prop: "officeId",
      type: "cascader",
      emitPath: false,
      display: userInfo?.value.technologyFlag,
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
      placeholder: '',
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
    {
      label: "角色描述",
      prop: "description",
      type: "textarea",
      maxlength: 100,
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
watch(() => form.value.appId, (value) => {
  if (value) getAllResourceListFun(value)
})
onMounted(async () => {
  if (props.rowDetail) {
    await nextTick()
    form.value = props.rowDetail;
  }

});

const getAllResourceListFun = async (appId) => {
  loading.value = true
  const { data } = await getAllResourceListWithPermission({ appId: appId });
  resourceList.value = data.resultData;
  loading.value = false
  await nextTick()
  const arr = []
  props.rowDetail.resourceIds.forEach(item => {
    if (!treeRef.value.getNode(item)?.childNodes || !treeRef.value.getNode(item)?.childNodes?.length) {
      arr.push(item)
    }
  })
  console.log(arr)
  treeRef.value?.setCheckedKeys(arr, true)
  // setTimeout
}

const submit = (type) => {


  formRef.value.validate(async (valid, done, msg) => {
    done();
    if (valid) {
      form.value.resourceIds = treeRef.value.getCheckedKeys()?.concat(treeRef.value.getHalfCheckedKeys())
      // if (!form.value.resourceIds || form.value.resourceIds?.length === 0) {
      //   ElMessage.error('请授权角色'); return;
      // }
      let res = {};
      if (form.value.roleId) {
        res = await update(form.value);
      } else {
        res = await add(form.value);
      }
      if (res.data.resultCode === "0") {
        if (type === 'continue') formRef.value.resetForm()
        emits("done", type);
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

<style lang="scss" scope>
.role-form {
  height: 100%;
  width: var(--form-width);

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
</style>
