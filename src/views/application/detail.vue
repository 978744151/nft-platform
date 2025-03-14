<template>
  <div class="role-form">
    <avue-form ref="formRef" :option="option" @submit="submit" v-model="form"></avue-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { add, update } from "@/api/user";
import { ElNotification } from "element-plus";
const emits = defineEmits(["done"]);
interface Props<T = any> {
  rowDetail: T;
}
const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
});
const formRef = ref();
const form = ref({});
const option = {
  addBtn: false,
  border: true,
  editBtn: false,
  menuBtn: false,
  labelPosition: "top",
  labelSuffix: "  ",
  column: [
    {
      label: "组织",
      prop: "officeId",
      type: "cascader",
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

    {
      label: "上级领导",
      prop: "parentId",
      type: "select",
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
      dicUrl: "/user/getAllManager",
      props: {
        label: "name",
        value: "id",
      },
      filterable: true,
      dicFormatter: (res) => {
        return res.resultData;
      },
    },
    {
      label: "职务",
      prop: "italentJobId",
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
    {
      label: "邮箱",
      prop: "email",
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },
    {
      label: "手机号码",
      prop: "mobile",
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },
    {
      label: "工号",
      prop: "staffNo",
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
    },
    {
      label: "员工姓名",
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
      label: "密码",
      prop: "password",
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },

    {
      label: "账户名称",
      prop: "username",
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },
    {
      label: "企业设置",
      prop: "wecomUserId",
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },
    {
      label: "头像",
      prop: "avatarUrl",
      display: true,
      type: "upload",
      tip: "最多可上传1张",
      fileText: "点击上传",
      propsHttp: { url: "url", res: "data" },
      data: {
        fileTypeCode: "001",
      },
      // multiple: true,
      listType: "picture-img",
      limit: 1,
      action: "/fileUpload/upload",
    },

    {
      label: "备注",
      prop: "remark",
      type: "textarea",
    },
  ],
};

onMounted(() => {
  if (props.rowDetail) {
    form.value = props.rowDetail;
  }
});

// const uploadBefore = (file, done, loading, column) => {
//   console.log(file, column);
//   //如果你想修改file文件,由于上传的file是只读文件，必须复制新的file才可以修改名字，完后赋值到done函数里,如果不修改的话直接写done()即可
//   var newFile = new File([file], "1234", { type: file.type });
//   done(newFile);
//   this.$message.success("上传前的方法");
// };

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

<style lang="scss" scope>
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
</style>
