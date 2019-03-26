<template>
    <div style="text-align: center;width: 100%;height: 100%">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><h1>基于Node.js的车联网监控平台</h1></span>
        </div>
        <div class="text item">
          <h3>主要功能是车辆实时监控、历史轨迹及系统设置。主要包括由车辆实时位置定位，车辆追踪，历史行驶轨迹回放，添加车辆，用户注册等功能。</h3>
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
