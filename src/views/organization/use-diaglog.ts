import { ElMessageBox, ElNotification } from 'element-plus'
// import { downBlobFile } from '@/util/util'
import Api from '@/api/common'
import type { useTableData } from './types'
export function useDialog(data: useTableData,crud) {
  

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
        value: currentTree.value.officeName,
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

  return {
    
  }
}
