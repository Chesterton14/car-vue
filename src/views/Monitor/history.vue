<template>
  <div style="width: 100%;height: 100%">
    <div class="control">
      <div class="buttonGroup">
        <el-date-picker
          v-model="time"
          size="large"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin:2px 0 0 20px"
          value-format="yyyy-MM-dd-hh-mm-ss"
          @change="getTime"
        >
        </el-date-picker>
        <el-button type="primary">开始回放</el-button>
      </div>

    </div>
    <div id="allmap"></div>

  </div>
</template>

<script>
  import {createMap} from "../../js/map";

  export default {
    name: "history",
    mounted() {
      createMap()
    },
    data() {
      return {
        time: ''
      }
    },
    methods:{
      getTime(){
        console.log(this.time);
      }
    }
  }
</script>

<style scoped>
  @import "../../style/map.css";
  .el-date-editor--datetimerange.el-input__inner{
  width: 500px;
}
</style>
