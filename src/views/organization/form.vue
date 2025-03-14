<template>
  <div class="or-forms">
    <avue-form ref="formRef" :option="option()" @submit="submit" v-model="form">
      <template #wecomUserId>
        <!-- <el-button type="primary" @click="dialogVisible = true">
          请选择企微设置人员
        </el-button>
        {{ form.wecomUserName }} -->
        <div class="flex items-center ">
          <el-input v-model="form.wecomUserId" disabled>
            <template #append><el-button @click="dialogVisible = true">请选择</el-button>
            </template>
          </el-input>
          <Close @click="form.wecomUserId = ''" style="width: 1em; height: 1em; margin-left: 8px;display:inline-block;"
            class="cursor-pointer" />
        </div>

      </template>
    </avue-form>
    <el-dialog title="绑定企业微信" v-model="dialogVisible" width="480px">
      <div>
        <avue-select class="mb-[16px]" :dic="officeList" :props="officeProps" @change="changeOffice" :clearable="false"
          placeholder="请选择组织"></avue-select>
        <div>
          <el-table :data="userList" style="width: 100%;height:500px;" highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column prop="name" label="员工姓名" align="center">
            </el-table-column>
            <el-table-column prop="userId" label="企业微信号" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="center flex justify-center mt-5">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmWx">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { add, update, getWeComOfficeList, getWeComUserList } from "@/api/user";
import { ElNotification } from "element-plus";
import { isMobile, isEmail } from '@/plugins/validate'

const emits = defineEmits(["done"]);
interface Props<T = any> {
  rowDetail: T;
}
const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
});
const formRef = ref();
const form = ref({});
const dialogVisible = ref(false)
const officeProps = {
  label: "name",
  value: "id",
}
const officeList = ref([])
const userList = ref([])
const wecomUserId = ref()
const wecomUserName = ref()

const option = () => {
  return {
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
        disabled: form.value.source == 1
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
        disabled: form.value.source == 1
      },
      {
        disabled: form.value.source == 1,
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
        label: "账户名称",
        prop: "username",
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
        disabled: form.value.source == 1
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
        disabled: form.value.source == 1
      },

      {
        label: "邮箱",
        prop: "email",
        rules: [
          {
            validator: (rule, value, callback) => {
              if (!isEmail(value)) {
                callback(new Error('请输入正确的邮箱'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        disabled: form.value.source == 1
      },
      {
        label: "手机号码",
        prop: "mobile",
        rules: [
          {
            validator: (rule, value, callback) => {
              if (!isMobile(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        disabled: form.value.source == 1
      },
      {
        label: "工作手机号",
        prop: "workMobile",
        rules: [
          {
            validator: (rule, value, callback) => {
              if (!isMobile(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
            required: true
          }
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
        disabled: form.value.source == 1
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
        display: !props.rowDetail?.id,

      },


      // {
      //   label: "企业设置部门",
      //   prop: "wecomDept",
      //   type: "select",
      //   rules: [
      //     {
      //       required: true,
      //       message: "这个必填哦",
      //       trigger: "blur",
      //     },
      //   ],
      //   dicUrl: "/office/getWeComOfficeList",
      //   props: {
      //     label: "name",
      //     value: "id",
      //   },
      //   filterable: true,
      //   dicFormatter: (res) => {
      //     return res.resultData;
      //   },
      //   cascader: ['wecomUserId'],
      // },
      {
        label: "企业微信账户绑定",
        prop: "wecomUserId",
        // type: "select",

        // dicUrl: "/user/getWeComUserList?officeId={{key}}",
        props: {
          label: "name",
          value: "userId",
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
        disabled: form.value.source == 1
      },
      {
        label: "头像",
        prop: "avatarUrl",
        display: true,
        type: "upload",
        tip: "最多可上传1张",
        fileText: "点击上传",
        propsHttp: { url: "resultData" },
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
  }
}

onMounted(async () => {
  await getOfficeList()
  if (props.rowDetail) {
    form.value = props.rowDetail;
  }
});

const getOfficeList = async () => {
  const { data } = await getWeComOfficeList()
  officeList.value = data.resultData
}
const changeOffice = async (e) => {
  const { data } = await getWeComUserList({ officeId: e.value })
  userList.value = data.resultData
}

const handleCurrentChange = (e) => {
  console.log(e)
  wecomUserId.value = e.userId
  wecomUserName.value = e.name
}

const confirmWx = () => {
  form.value.wecomUserId = wecomUserId.value
  form.value.wecomUserName = wecomUserName.value
  dialogVisible.value = false
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
.or-forms {
  height: 100%;
  max-width: var(--form-width);

  // .l
  .el-form--label-top .el-form-item {
    width: 300px;
    margin-bottom: 26px;

    .el-select__wrapper {
      // height: 36px;
      // background: #ffffff;
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
