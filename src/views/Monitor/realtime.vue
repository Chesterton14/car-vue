<template>
  <!--<div style="width: 100%;height: 100%">

    <div class="control"></div>
  </div>-->
  <div style="width: 100%;height: 100%">
    <div class="control" >
      <div class="buttonGroup">
        <el-button type="primary" style="margin:2px 0 0 20px">实时位置定位</el-button>
        <el-button type="primary">删除标注点</el-button>
      </div>

    </div>
    <div id="allmap" ref="allmap"></div>

  </div>


</template>

<script>
  import {createMap,delPoint} from "../../js/map";

  export default {
    name: "realtime",
    mounted() {
      createMap();
    },
    methods:{
      del(){
        delPoint();
      }
    }
  }

</script>

<style scoped>
  @import "../../style/map.css";

</style>
