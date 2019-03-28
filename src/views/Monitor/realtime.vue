<template>
  <div style="width: 100%;height: 100%">
    <div id="allmap" ref="allmap"></div>
    <div class="carControl">
      <div class="header">车辆管理
        <a href="javascript:" @click="isSelect = !isSelect">
          <i class="el-icon-arrow-down" :class="isSelect?'icon-select':'icon-noselect'"></i>
        </a>
      </div>
      <el-collapse-transition>
        <div class="container" v-if="!isSelect">
          <el-tabs v-model="activeName" @tab-click="handleClick" :stretch=true>
            <el-tab-pane :label="'全部('+treeData.length+')'" name="all">
              <el-tree
                :data="treeData"
                node-key="carId"
                :check-on-click-node="true"
                @node-click="isChecked"
              >
              </el-tree>
            </el-tab-pane>
            <el-tab-pane :label="'在线('+treeData.filter(item=>item.isOnline==true).length+')'" name="online">
              <el-tree
                :data="treeData.filter(item=>item.isOnline==true)"
                node-key="carId"
                :check-on-click-node="true"
                @node-click="isChecked"
              >
              </el-tree>
            </el-tab-pane>
            <el-tab-pane :label="'离线('+treeData.filter(item=>item.isOnline!=true).length+')'" name="offline">
              <el-tree
                :data="treeData.filter(item=>item.isOnline!=true)"
                node-key="carId"
                :check-on-click-node="true"
                @node-click="isChecked"
              >
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  import {createMap} from "../../js/map";
  import {getAllcars, getCar} from "../../api";
  import {websocketServer} from "../../js/ws";

  export default {
    name: "realtime",
    data() {
      return {
        activeName: 'all',
        isSelect: false,
        treeData: [],
        lat: '123123',
        lng: '123123',
        map: null,
        curCarId:'',
        messageBox:null
      };
    },
    mounted() {
      let map = createMap();
      this.map = map;
    },
    created() {
      this.getCarsData();
    },
    methods: {
      getCarsData() {
        setInterval(() => {
          getAllcars().then((res) => {
            //console.log(res);
            this.treeData = res.data.data;
            //console.log(this.treeData);
          }).catch((error) => {
            console.log(error);
          })
        }, 1000);
      },
      handleClick(tab, event) {
        //console.log(tab._uid);
        //console.log(this.activeName);
      },
      demo(e) {
        let curCar = this.treeData.filter(item=>item.carId==this.curCarId);
        console.log(curCar[0].isOnline);
        if (curCar[0].isOnline == this.curCarId){
          this.map.clearOverlays();
          let data = JSON.parse(e.data);
          let lng = data.latest.lng;
          let lat = data.latest.lat;
          this.newMarker(lat, lng);
        }else{
          this.messageBox.close();
          this.$message({
            type:'error',
            message:'该车辆已下线'
          });
          websocketServer.handClose();
          return false;
        }
      },
      isChecked(node, data, value) {
        //console.log(node.isOnline);
        this.curCarId=node.carId;
        if (node.isOnline == 0) {
          this.$message({message: "该车辆未在线，已显示车辆最后位置",center:true});
          getCar(node.carId).then(res => {
            //console.log(res.data.latest);
            this.newMarker(res.data.latest.lat, res.data.latest.lng);
          })
        } else {
          this.map.clearOverlays();
          websocketServer.url = 'ws://localhost:8867';
          websocketServer.carId = node.carId;
          websocketServer.cb = this.demo;
          websocketServer.createWebSocket();
          this.messageBox = this.$message({
            type: 'success',
            message: "已建立连接,实时监控中...",
            duration: 0,
            showClose: true
          });
        }

      },
      newMarker(lat, lng) {
        let point = new BMap.Point(lng, lat);
        let myIcon = new BMap.Icon('http://119.29.144.11:4000/img/car2.png', new BMap.Size(41, 34));
        let marker = new BMap.Marker(point, {icon: myIcon});
        let myGeo = new BMap.Geocoder();
        let address = '未查找到位置数据';
        let surroundingPois = [{address: '未查找到位置数据', title: '未查找到位置数据'}];
        this.map.addOverlay(marker);
        this.map.centerAndZoom(point, 20);
        myGeo.getLocation(point, function (result) {
          //console.log(result);
          if (result) {
            address = result.address;
          }
          if (result.surroundingPois != '') {
            surroundingPois = result.surroundingPois;
          }
        });
        setTimeout(() => {
          let content = "<p>经度：" + lng + "</p>" +
            "<p>纬度：" + lat + "</p>" +
            "<p>所在大概位置：" + address + "</p>" +
            "<p>所在位置：" + surroundingPois[0].address + "</p>" +
            "<p>附近：" + surroundingPois[0].title + "</p>";
          let infoWindow = new BMap.InfoWindow(content, {title: "当前车辆信息"});
          this.map.openInfoWindow(infoWindow, point);
        }, 1000);
        marker.addEventListener("click", () => {
          let content = "<p>经度：" + lng + "</p>" +
            "<p>纬度：" + lat + "</p>" +
            "<p>所在大概位置：" + address + "</p>" +
            "<p>所在位置：" + surroundingPois[0].address + "</p>" +
            "<p>附近：" + surroundingPois[0].title + "</p>";
          let infoWindow = new BMap.InfoWindow(content, {title: "当前车辆信息"});
          this.map.openInfoWindow(infoWindow, point); //开启信息窗口
        });

      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/map.css";

  .carControl {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 250px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    .header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      background-color: #409EFF;
      position: relative;

      a, a:hover {
        color: #ffffff;
        top: 0;
        right: 20px;
        position: absolute;

      }
    }

    .container {
      width: 100%;

      .el-tabs {
        width: 100%;
        height: 400px;
      }
    }
  }

  .icon-select {
    transform: rotate(180deg);
    transition: all 0.3s ease-out;
  }

  .icon-noselect {
    transform: rotate(0deg);
    transition: all 0.3s ease-out;
  }

</style>
