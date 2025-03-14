<template>
    <div class="app-log-page flex pt-[10px]">
        <f-crud ref="fcrud" :option="option" :operate="operate" :formProps="formProps" v-model="form"
            class="p-[12px] w-full">
        </f-crud>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { avueCrudConfig } from "@/plugins/common";

interface Props<T = any> {
    rowDetail: T;
}
const props = withDefaults(defineProps<Props>(), {
    rowDetail: {},
});
const form = ref({ userId: '' });
const operate = ref({
    getList: "/user/getUserEditLogs",
    postUrl: "/admin/data/area",
    putUrl: "/admin/data/area",
    delUrl: "/admin/data/area/",
});
const fcrud = ref(null);
const drawerVisible = ref(false);
const formProps = ref({ pageSize: 10, });

const option = () => {
    return {
        addBtn: false,
        border: true,
        editBtn: false,
        ...avueCrudConfig,
        delBtn: false,
        align: 'center',
        header: false,
        menu: false,
        searchBtn: false,
        emptyBtn: false,
        columnBtn: false,
        column: [
            {
                label: "操作类型",
                prop: "editType",
            },
            {
                label: "操作前信息",
                prop: "oldVal",
            },
            {
                label: "操作后信息",
                prop: "newVal",
            },
            {
                label: "操作人",
                prop: "createUserName",
            },
            {
                label: "操作时间",
                prop: "createTime",

            },
        ],
    };
};

onMounted(async () => {
    console.log(1234)
    form.value.userId = props.rowDetail.id;
    fcrud.value.getList();
});



</script>

<style lang="scss" scope>
.app-log-page {
    background-color: #ffffff;
    height: 100%;
    width: 100%;
    overflow-y: auto;

    e &-left {
        border-right: 1px solid #ebeef5;

        &-title {
            width: 166px;
            height: 40px;
            background: #ffffff;
            padding-left: 10px;
            line-height: 40px;
            font-size: 13px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: Regular;
            text-align: left;
            color: #323335;
            border-bottom: 1px solid #ebeef5;
        }

        .el-tree-node__content {
            margin: 3px 0;
        }
    }

    &-right {
        .el-tabs__nav-wrap:after {
            height: 1px;
        }

        .el-table__header-wrapper {
            // height: 40px;
            // background: #f4f8ff;
        }

        .el-tabs__nav-wrap {
            padding-left: 30px;
        }

        .avue-crud .el-table th.el-table__cell {
            background: #f4f8ff;
            height: 40px;
            font-size: 13px;
            font-family: 'Microsoft YaHei';
            font-weight: Regular;
            text-align: center;
            color: #76849e;
        }
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        padding-right: 8px;
    }

    .drawer-header {
        display: flex;
        justify-content: space-between;

        &-title {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: Regular;
        }
    }
}
</style>