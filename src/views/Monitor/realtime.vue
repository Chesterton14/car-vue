<template>
  <div style="width: 100%;height: 100%">
    <div id="allmap" ref="allmap"></div>
    <div class="carControl">
      <el-dialog
        title="新增车辆"
        :visible.sync="newComFormVisible"
        :modal-append-to-body='false'
        width="25%"
      >
        <el-form :rules="rules" ref="ruleForm" :model="form">
          <el-form-item label="车辆名" prop="label" :label-width="formLabelWidth">
            <el-input type="text" autocomplete="off" v-model="form.label" placeholder="输入车辆名"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="label" :label-width="formLabelWidth">
            <el-input type="text" autocomplete="off" v-model="form.username" placeholder="输入车辆绑定的用户"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="newComFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="newSubmit('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <div class="header">
        <a class="add" href="javascript:" @click="newComFormVisible=true">
          <i class="el-icon-plus"></i>
        </a>
        车辆管理
        <a class="drowdown" href="javascript:" @click="isSelect = !isSelect">
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
  import {transform} from "../../js/gcj02tobd02";
  import {newCar, getCar, getUserCar,updateCarPosition,gcj02tobd} from "../../api";
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
        curCarId: '',
        messageBox: null,
        userId: '',
        newComFormVisible: false,
        formLabelWidth: '100px',
        timer: null,
        pointId:'',
        rules: {
          label: [{required: true, message: '请输入车辆名', trigger: 'blur'}],
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        },
        form: {
          userId: '',
          label: '',
          username: ''
        },
        interval:null
      };
    },
    mounted() {
      let map = createMap();
      this.map = map;
    },
    created() {
      this.getCarsData();
      this.userId = JSON.parse(window.localStorage.getItem('userinfo')).id;
    },
    beforeRouteLeave(to,from,next){
      clearInterval(this.interval);
      next()
    },
    methods: {
      newSubmit(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            this.form.userId = this.userId;
            console.log(this.form);
            newCar(this.form).then(res => {
              this.$message({
                type: 'success',
                message: "新增车辆成功"
              });
              this.newComFormVisible = false;
              this.getCarsData();
            }).catch(error => {
              console.log(error);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getCarsData() {
        let carTimer = null;
        carTimer = setInterval(() => {
          getUserCar(this.userId).then((res) => {
            //console.log(res);
            if (res.data.status != '200') {
              this.$message({
                message: '此用户未注册车辆'
              });
              this.isSelect = true;
              clearInterval(carTimer);
              return false;
            } else {
              this.treeData = res.data.data;
            }
            //console.log(this.treeData);
          }).catch((error) => {
            console.log(error);
          })
        }, 1000);
        this.interval=carTimer;
      },
      handleClick(tab, event) {
        //console.log(tab._uid);
        //console.log(this.activeName);
      },
      demo(e) {
        let curCar = this.treeData.filter(item => item.carId == this.curCarId);
        console.log("isOnline",curCar[0].isOnline);
        console.log("isMobile",curCar[0].isMobile);
        if (curCar[0].isOnline == 1) {
          if (curCar[0].isMobile == 1){
            //this.$message({message: "移动终端", center: true});
            this.map.clearOverlays();
            let data = JSON.parse(e.data);
            let pointed = transform(data.latest.lat,data.latest.lng)
            console.log(pointed);
            this.pointId=data.latest.pointId;
            this.newMarker(pointed.bd_lat, pointed.bd_lon);
          }else{
            this.map.clearOverlays();
            let data = JSON.parse(e.data);
            let lng = data.latest.lng;
            let lat = data.latest.lat;
            this.pointId=data.latest.pointId;
            this.newMarker(lat, lng);
          }

        } else {
          this.messageBox.close();
          this.$message({
            type: 'error',
            message: '该车辆已下线',
            duration: 0,
            showClose: true
          });
          websocketServer.handClose();
          return false;
        }
      },
      isChecked(node, data, value) {
        //console.log(node);
        this.curCarId = node.carId;
        if (node.isOnline == 0) {
          getCar(node.carId).then(res => {
            //console.log(res.data);
            if (res.data.status != '200') {
              this.$message({message: '数据库没有该车辆的数据！'})
            } else {
              if (node.isMobile == 1){
                this.$message({message: "移动终端", center: true});
                let pointed = transform(res.data.latest.lat,res.data.latest.lng)
                console.log(pointed);
                this.pointId=res.data.latest.pointId;
                this.newMarker(pointed.bd_lat, pointed.bd_lon);
              }else{
                this.$message({message: "该车辆未在线，已显示车辆最后位置", center: true});
                this.pointId=res.data.latest.pointId;
                this.newMarker(res.data.latest.lat, res.data.latest.lng);
              }
            }
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
          updateCarPosition(this.pointId,address)
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

      .add, .add:hover {
        color: #ffffff;
        position: absolute;
        top: 0;
        left: 20px;
      }

      .drowdown, .drowdown:hover {
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
