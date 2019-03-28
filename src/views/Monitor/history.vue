<template>
  <div style="width: 100%;height: 100%">
    <div id="allmap"></div>
    <div class="control">
      <a href="javascript:" @click="isSelect = !isSelect">
        <i class="el-icon-arrow-down" :class="isSelect?'icon-select':'icon-noselect'"></i>
      </a>
      <el-collapse-transition>
        <div v-if="!isSelect">
          <el-select v-model="form.carId" placeholder="请选择车辆">
            <el-option
              v-for="item in cars"
              :key="item.carId"
              :label="item.label"
              :value="item.carId"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
          <el-button type="primary" @click="onSubmit">开始回放</el-button>
          <span id="realTime">{{realTime}}</span>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import { createMap } from "../../js/map";
import { trackback } from "../../js/trackback";
import { getAllcars, getCar } from "../../api";

export default {
  name: "history",
  created() {
    this.getCasData();
  },
  mounted() {
    let map = createMap();
    this.map = map;
  },
  data() {
    return {
      isSelect: false,
      form: {
        time: "",
        carId: ""
      },
      cars: [],
      map: null,
      realTime:''
    };
  },
  methods: {
    onSubmit() {
      this.realTime='';
      if (this.form.time == "" || this.form.carId == "") {
        this.$message({
          type: "error",
          message: "请选择车辆和时间段！"
        });
        return false;
      } else {
        console.log(this.form);
        getCar(this.form.carId)
          .then(res => {
            if (res.data.status != "200") {
              this.$message({
                type: "error",
                message: res.data.msg
              });
              return false;
            } else {
              let points = res.data.data;
              trackback(points, this.map, this.form.time[0], this.form.time[1]);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getCasData() {
      getAllcars().then(res => {
        this.cars = res.data.data;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../style/map.css";

.el-date-editor--datetimerange.el-input__inner {
  width: 500px;
}

.control {
  position: fixed;
  left: 400px;
  bottom: 20px;

  a {
    position: fixed;
    left: 365px;
    bottom: 25px;
  }
}

.el-icon-arrow-down {
  color: #000000;
  font-size: 25px;
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
