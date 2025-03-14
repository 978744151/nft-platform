<template>
  <div class="role-form">
    <avue-form ref="formRef" :option="option()" @submit="submit" v-model="form">
      <template #sort>
        <el-input-number v-model="form.sort" label="label"></el-input-number>
      </template>
    </avue-form>
  </div>
</template>

<script lang="ts" setup>
import Cookies from "js-cookie";
import { ref } from "vue";
import { add, update } from "@/api/menus";
import { ElNotification } from "element-plus";
const emits = defineEmits(["done"]);
interface Props<T = any> {
  rowDetail: T;
}
const props = withDefaults(defineProps<Props>(), {
  rowDetail: {},
});
const formRef = ref();
const form = ref({ appId: '', parentId: '' });
const option = () => {
  return {
    addBtn: false,
    border: true,
    editBtn: false,
    menuBtn: false,
    labelPosition: "top",
    labelSuffix: "",
    span: 24,
    column: [
      {
        label: "应用",
        prop: "appId",
        type: "select",
        placeholder: "请选择应用",
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
        dicUrl: "/app/getAllAppList",
        props: {
          label: "name",
          value: "id",
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
        cascader: ['parentId'],
      },
      {
        label: "父级菜单",
        prop: "parentId",
        type: "cascader",
        emitPath: false,
        collapseTagsTooltip: true,
        checkStrictly: true,
        // rules: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     message: "这个必填哦",
        //   },
        // ],
        dicUrl: "/resource/getAllResourceList?appId={{key}}",
        props: {
          label: "name",
          value: "id",
          children: 'children'
        },
        filterable: true,
        dicFormatter: (res) => {
          return res.resultData;
        },
      },
      {
        label: "菜单名称",
        prop: "resourceName",
        type: "input",
        maxlength: 50,
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },

      // {
      //   label: '图标选择器',
      //   prop: 'iconUrl',
      //   type: 'icon',
      //   iconList: [{
      //     label: '阿里图标-Symbol图标',
      //     list: [
      //       {
      //         label: '机构',
      //         value: '#icon-jigou'
      //       },
      //       {
      //         label: '短信管理',
      //         value: '#icon-duanxinguanli'
      //       },
      //       {
      //         label: '发票管理系统',
      //         value: '#icon-fapiaoguanlixitong'
      //       },
      //       {
      //         label: '角色',
      //         value: '#icon-jiaose'
      //       },
      //       {
      //         label: '黑名单',
      //         value: '#icon-heimingdan2'
      //       },
      //       {
      //         label: 'KHCFDC_附件',
      //         value: '#icon-fujian4'
      //       },
      //       {
      //         label: '文档',
      //         value: '#icon-wendang3'
      //       },
      //       {
      //         label: '刷卡',
      //         value: '#icon-shuaka'
      //       },
      //       {
      //         label: '停车',
      //         value: '#icon-tingche3'
      //       },
      //       {
      //         label: '对象存储OSS',
      //         value: '#icon-duixiangcunchuOSS'
      //       },
      //       {
      //         label: '反馈',
      //         value: '#icon-fankui2'
      //       },
      //       {
      //         label: '短信',
      //         value: '#icon-ziyuan1'
      //       },
      //       {
      //         label: '对象存储服务',
      //         value: '#icon-beikongshuiwupingtaimenhu-tubiao_duixiangcunchufuwu'
      //       },
      //       {
      //         label: '数据库_jurassic',
      //         value: '#icon-jurassic_data'
      //       },
      //       {
      //         label: '日志',
      //         value: '#icon-rizhi1'
      //       },
      //       {
      //         label: '权限',
      //         value: '#icon-quanxian4'
      //       },
      //       {
      //         label: '订单',
      //         value: '#icon-5'
      //       },
      //       {
      //         label: '机构',
      //         value: '#icon-jigou1'
      //       },
      //       {
      //         label: '机构人员',
      //         value: '#icon-jigourenyuan'
      //       },
      //       {
      //         label: '角色管理',
      //         value: '#icon-jiaoseguanli4'
      //       },
      //       {
      //         label: '角色管理',
      //         value: '#icon-jiaoseguanli5'
      //       },
      //       {
      //         label: '数据监控',
      //         value: '#icon-shujujiankong'
      //       },
      //       {
      //         label: '活动展示',
      //         value: '#icon-huodongzhanshi'
      //       },
      //       {
      //         label: 'vip invitation',
      //         value: '#icon-vipinvitation'
      //       }]
      //   }, {
      //     label: '阿里云图标',
      //     list: [
      //       'iconfont icon-zhongyingwen',
      //       'iconfont icon-rizhi1',
      //       'iconfont icon-bug',
      //       'iconfont icon-qq1',
      //       'iconfont icon-weixin1'
      //     ]
      //   }]
      // },
      {
        label: "菜单类型",
        prop: "type",
        // display: props.rowDetail.roleId ? false : true,
        type: "radio",
        dicData: [
          {
            label: "菜单",
            value: 1,
          },
          {
            label: "按钮",
            value: 2,
          },
        ],
        value: 1,
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
      {
        label: "是否是外部链接",
        prop: "externalUrlFlag",
        // display: props.rowDetail.roleId ? false : true,
        type: "radio",
        dicData: [
          {
            label: "否",
            value: 0,
          },
          {
            label: "是",
            value: 1,
          },

        ],
        value: 0,
        rules: [
          {
            required: true,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
      {
        label: "菜单url",
        prop: "resourceUrl",
        type: "input",
        maxlength: 50,
        rules: [
          {
            required: form.value.type === 1,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
      {
        label: "权限url",
        prop: "permissionIdentity",
        type: "input",
        maxlength: 50,
        rules: [
          {
            required: form.value.type === 2,
            message: "这个必填哦",
            trigger: "blur",
          },
        ],
      },
      {
        label: "排序",
        prop: "sort",
        value: 0,
        type: 'number',
        emitPath: false,
        rules: [
          {
            required: true,
            trigger: "blur",
            message: "这个必填哦",
          },
        ],
      },
    ],
  }
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
        console.log(type);
        if (type === 'continue') {
          // formRef.value.resetForm()
          form.value.resourceName = ''
          form.value.resourceUrl = ''
          form.value.iconUrl = ''
          form.value.type = ''
          form.value.sort = ''
          form.value.permissionIdentity = ''
        }
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
