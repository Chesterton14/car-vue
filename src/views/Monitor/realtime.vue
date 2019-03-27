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
            <el-tab-pane :label="'在线('+treeData.filter(item=>item.isOnline===true).length+')'" name="online">
              <el-tree
                :data="treeData.filter(item=>item.isOnline===true)"
                node-key="carId"
                :check-on-click-node="true"
                @node-click="isChecked"
              >
              </el-tree>
            </el-tab-pane>
            <el-tab-pane :label="'离线('+treeData.filter(item=>item.isOnline!==true).length+')'" name="offline">
              <el-tree
                :data="treeData.filter(item=>item.isOnline!==true)"
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

  export default {
    name: "realtime",
    data() {
      return {
        activeName: 'all',
        isSelect: false,
        treeData: [],
        lat: '123123',
        lng: '123123',
        map: null
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
        getAllcars().then((res) => {
          //console.log(res);
          this.treeData = res.data.data
        }).catch((error) => {
          console.log(error);
        })
      },
      handleClick(tab, event) {
        //console.log(tab._uid);
        //console.log(this.activeName);
      },
      isChecked(node, data, value) {
        //console.log(node.carId);
        getCar(node.carId).then((res) => {
          this.map.clearOverlays();
          //console.log(res.data);
          let data = res.data;
          let latest = res.data.latest;
          if (data.status != 200) {
            this.$message({
              type: 'error',
              message: data.msg
            });
            return false;
          } else {
            this.$message({
              type: 'success',
              message: data.msg
            });
            this.newMarker(latest.lat, latest.lng)
          }
        }).catch((error) => {
          console.log(error);
        })
      },
      newMarker(lat, lng) {
        var point = new BMap.Point(lng, lat);
        var myIcon = new BMap.Icon('http://119.29.144.11:4000/img/car2.png', new BMap.Size(41, 34));
        var marker = new BMap.Marker(point, {icon: myIcon});
        var myGeo = new BMap.Geocoder();
        var address = '';
        var surroundingPois=[];
        this.map.addOverlay(marker);
        this.map.centerAndZoom(point, 20);
        myGeo.getLocation(point, function (result) {
          //console.log(result.surroundingPois);
          if (result) {
            address = result.address;
            surroundingPois=result.surroundingPois;
          }
        });
        //console.log(address);
        marker.addEventListener("click", () => {
          var content = "<p>经度："+lng+"</p>"+
                        "<p>纬度："+lat+"</p>"+
                        "<p>所在大概位置："+address+"</p>"+
                        "<p>所在位置："+surroundingPois[0].address+"</p>"+
                        "<p>附近："+surroundingPois[1].title+"</p>";
          var infoWindow = new BMap.InfoWindow(content, {title: "当前车辆信息"});
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
