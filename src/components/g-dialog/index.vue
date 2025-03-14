<template>
  <div class="mask">
    <div class="mask-header">
      <slot name="header"></slot>
    </div>
    <div class="mask-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scope>
.mask {
  width: calc(100% - 20px);
  height: 100%;
  background: #fff;
  z-index: 10;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;

  &-header {
    height: 52px;
    background: #ffffff;
    line-height: 52px;
    // position: absolute;
    top: 0;
    width: 100%;
    padding: 0 15px;
    border-bottom: 1px solid #ebeef5;
  }

  &-content {
    flex: 1;
    overflow: auto;
    padding: 12px 30px;
    // background: red;
  }

  .avue-crud__search .el-card__body {
    // padding-bottom: 0;
  }
}
</style>
