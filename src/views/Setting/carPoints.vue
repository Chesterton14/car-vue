<template>
  <div style="height: 100%;width: 100%;text-align: center">
    <div class="top">
      <el-select class="searchInput" v-model="form.carId" placeholder="选择车辆">
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
      <!--<el-button type="success" plain @click="doSearch">确定</el-button>-->
      <el-button icon="el-icon-search" plain @click="doSearch">搜索</el-button>
      <el-button type="info" icon="el-icon-refresh" plain @click="resetData" style="margin-left: 0">重置</el-button>

      <div style="display: inline-block">
        <download-excel
          :data="tableData"
          :fields="fields"
        >
          <el-button type="primary" icon="el-icon-printer" plain>导出为Excel表格</el-button>
        </download-excel>
      </div>

    </div>
    <el-table
      :data="tableData"
      style="width: 95%;display: inline-block;margin-top: 20px"
      id="out-table"
      border>
      <el-table-column label="车辆编号" prop="carId" align="center" width="80"></el-table-column>
      <el-table-column label="车辆名" prop="label" align="center"></el-table-column>
      <el-table-column label="经度" prop="lng" align="center"></el-table-column>
      <el-table-column label="纬度" prop="lat" align="center"></el-table-column>
      <el-table-column label="时间" prop="time" align="center"></el-table-column>
      <el-table-column label="位置" prop="position" align="center"></el-table-column>
    </el-table>
    <div class="page" style="padding:10px 0" v-if="!isSearch">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20,30,50,100]"
        :page-size="pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div >
    <div class="el-footer" v-else="isSearch">
      已到底
    </div>
  </div>
</template>

<script>
  import {getUserCarPoints, getUserCar, searchCar} from "../../api";

  export default {
    name: "carPoints",
    data() {
      return {
        tableData: [],
        fields: {
          "车辆编号": 'carId',
          "车辆名": 'label',
          "经度": 'lng',
          "纬度": 'lat',
          "时间": 'time',
          "位置": 'position'
        },
        json_meta: [
          [
            {
              'key': 'charset',
              'value': 'utf-8'
            }
          ]
        ],
        userId: '',
        search: '',
        form: {
          time: "",
          carId: ""
        },
        cars: [],
        isSearch: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        fdata:[]
      }
    },
    created() {
      this.userId = JSON.parse(window.localStorage.getItem('userinfo')).id;
      this.getData()
      this.getCasData()
      this.$notify.info({
        title: '关于报表导出',
        message: '导出的数据默认为表格当前页的数据，需要完整数据可通过搜索获得',
        duration: 0
      });
    },
    beforeRouteLeave(to,from,next){
      this.$notify.closeAll()
      next()
    },
    methods: {
      getData() {
        getUserCarPoints(this.userId, this.currentPage, this.pageSize).then(res => {
          //console.log(res.data);
          let points = res.data.data;
          if (res.data.status != 200) {
            this.$message({
              message: '没有车辆数据'
            });
            return false;
          } else {
            this.fdata=points
            this.tableData = points;
            this.total = res.data.total;
          }
        })
      },
      handleSizeChange(val) {
        //console.log(val);
        this.pageSize = val;
        this.currentPage = 1;
        this.getData()
      },
      handleCurrentChange(val) {
        //console.log(val);
        this.currentPage = val;
        this.getData()
      },
      doSearch() {
        if (this.form.carId == '' || this.form.time =='') {
          this.$message({
            message: '请选择车辆和时间'
          });
          return
        }
        searchCar(this.form.carId, this.form.time[0], this.form.time[1]).then(res => {
          console.log(res.data);
          let data = res.data.data
          let status = res.data.status
          let msg = res.data.msg
          if (status !== 200){
            this.$message({
              message: msg
            });
            return
          }
          this.tableData = data;
          this.isSearch = true
        })
      },
      getCasData() {
        getUserCar(this.userId).then(res => {
          this.cars = res.data.data;
        });
      },
      resetData() {
        this.getData()
        this.isSearch = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .top {
    width: 90%;
    height: 40px;
    padding-top: 20px;
    text-align: left;

    .searchInput {
      display: inline-block;
      width: 150px;
      margin-left: 50px;
    }
  }

</style>
