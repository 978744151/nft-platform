<template>
  <div class="role-form">
    <avue-form :option="option" @submit="submit"></avue-form>
  </div>
</template>

<script lang="ts" setup>
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
      prop: "name",
      type: "select",
      rules: [
        {
          required: true,
          trigger: "blur",
        },
      ],
    },

    {
      label: "上级领导",
      prop: "sex",
      type: "select",
      rules: [
        {
          required: true,
          trigger: "blur",
        },
      ],
    },
    {
      label: "职务",
      prop: "sex",
      type: "select",
      rules: [
        {
          required: true,
          trigger: "blur",
        },
      ],
    },
    {
      label: "邮箱",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入邮箱",
          trigger: "blur",
        },
      ],
    },
    {
      label: "手机号码",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入手机号码",
          trigger: "blur",
        },
      ],
    },
    {
      label: "工号",
      prop: "sex",
      rules: [
        {
          required: true,
          trigger: "blur",
        },
      ],
    },
    {
      label: "员工姓名",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      label: "密码",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    },

    {
      label: "账户名称",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      label: "头像",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      label: "备注",
      prop: "sex",
      type: "textarea",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      label: "企业设置",
      prop: "sex",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
  ],
};
const submit = (form, done) => {
  done();
};
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
