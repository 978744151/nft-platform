<script setup lang="ts">
const text = ref("");
onMounted(() => {
  console.log("加载了");
});
const appList = [
  {
    name: "认证管理系统",
    img: "",
    desc: "管理平台所有账号",
  },
  {
    name: "back后台管理系统",
    img: "",
    desc: "工品后台管理系统、对接客户、供应商、处理 各种单据服务",
  },
];
const handleBack = () => {
  const microData = {
    name: "g-back",
    type: "open",
  };
  // router.push('/g-back/index')
  window.microApp.dispatch({ name: "navigate", microData });
};
defineOptions({ name: "appIndex" });
</script>

<template>
  <div class="category">
    <!-- appIndex
    <el-input v-model="text" placeholder=""></el-input> -->
  </div>
</template>

<style scoped lang="scss">
.category {
  &-list {
    display: flex;

    &-item {
      margin-right: 25px;
      width: 325px;
      height: 220px;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      &-top {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 127px;
        border-bottom: 1px dashed #dcdfe6;

        img {
          width: 60px;
          height: 60px;
          background: linear-gradient(315deg, #00a0ff, #006dff);
          border-radius: 4px;
        }
      }

      &-bottom {
        padding: 5px 10px;
        height: 60px;

        &-desc {
          font-size: 14px;
          font-family: 'Microsoft YaHei';
          font-weight: Regular;
          text-align: left;
          color: #323335;
        }
      }

      &-btn {
        display: flex;
        justify-content: end;
        padding: 0px 10px;
      }
    }
  }
}
</style>
