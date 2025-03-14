<template>
  <div class="role-form">
    <avue-form ref="formRef" :option="option" @submit="submit" v-model="form"></avue-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { add, update } from "@/api/application";
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
  labelSuffix: "",
  column: [
    {
      label: "应用名称",
      prop: "name",
      emitPath: false,
      maxlength: 20,
      rules: [
        {
          required: true,
          trigger: "blur",
          message: "这个必填哦",
        },
      ],
    },
    {
      label: "应用Url",
      prop: "appUrl",
    },
    {
      label: "是否显示菜单",
      prop: "supportPcLoginFlag",
      // display: props.rowDetail.roleId ? false : true,
      type: "radio",
      dicData: [
        {
          label: "显示",
          value: true,
        },
        {
          label: "不显示",
          value: false,
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
      label: "应用Key",
      prop: "appKey",
    },


    {
      label: "应用描述",
      prop: "description",
      type: "textarea",
      maxlength: 50,
      rules: [
        {
          required: true,
          message: "这个必填哦",
          trigger: "blur",
        },
      ],
    },

    {
      label: "应用logo",
      prop: "logoUrl",
      display: true,
      type: "upload",
      tip: "最多可上传1张",
      fileText: "点击上传",
      propsHttp: { url: "resultData" },
      data: {
        fileTypeCode: "001",
      },
      accept: 'image/png, image/jpeg',
      // multiple: true,
      listType: "picture-img",
      tip: '仅支持大小1M，类型为jpg/png的图片',
      limit: 1,
      action: "/fileUpload/upload",
    },
    {
      label: "排序",
      prop: "sort",
      type: 'input-number'
    },
    // {
    //   label: "页面缓存",
    //   prop: "keepLive",
    //   type: "radio",
    //   dicData: [
    //     {
    //       label: "是",
    //       value: true,
    //     },
    //     {
    //       label: "否",
    //       value: false,
    //     },
    //   ],
    //   rules: [
    //     {
    //       required: true,
    //       message: "这个必填哦",
    //       trigger: "blur",
    //     },
    //   ],
    // },
  ],
};

onMounted(() => {
  if (props.rowDetail) {
    form.value = props.rowDetail;
  }
});

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
