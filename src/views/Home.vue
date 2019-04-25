<template>
    <div style="text-align: center;width: 100%;height: 100%;">
      <el-card class="box-card" style="margin-top: 50px">
        <div slot="header" class="clearfix">
          <span><h1>基于Node.js的广航车联网监控平台</h1></span>
        </div>
        <div class="text item">
          <h2>车联网监控平台可完成对车辆的实时监控，对车辆行驶信息的分析，实现用户对车辆的信息化管理</h2>
          <h3>主要功能包括：车辆实时监控、车辆历史轨迹回放、车辆行驶信息统计报表、车辆管理、平台用户管理</h3>
        </div>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 95%;
    display: inline-block;

  }
</style>
