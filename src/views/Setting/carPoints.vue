<template>
  <div style="height: 100%;width: 100%;text-align: center">
    <div class="top">
      <el-input class="searchInput" v-model="search" placeholder="输入车辆名关键字搜索">
        <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 2px"></i>
      </el-input>
      <el-button type="success"  @click="exportExcel">导出为Excel表格</el-button>
    </div>
    <el-table
      :data="tableData.filter(data => !search || data.label.toLowerCase().includes(search.toLowerCase()))"
      style="width: 95%;display: inline-block;margin-top: 20px"
      id="out-table"
      border>
      <el-table-column label="车辆编号" prop="carId" align="center" width="80"></el-table-column>
      <el-table-column label="车辆名" prop="label" align="center" ></el-table-column>
      <el-table-column label="经度" prop="lng" align="center"></el-table-column>
      <el-table-column label="纬度" prop="lat" align="center"></el-table-column>
      <el-table-column label="时间" prop="time" align="center"></el-table-column>
      <el-table-column label="位置" prop="position" align="center"></el-table-column>
    </el-table>
    <div class="page" style="padding:10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="sizes,total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getUserCarPoints,getAllcars} from "../../api";
  import FileSaver from 'file-saver';
  import XLSX from 'xlsx';

  export default {
    name: "carPoints",
    data() {
      return {
        tableData: [],
        userId: '',
        search: '',
        total:0,
        currentPage:1,
        pageSize:10,
      }
    },
    created() {
      this.userId = JSON.parse(window.localStorage.getItem('userinfo')).id;
      this.getData()
    },
    methods: {
      getData() {
        getUserCarPoints(this.userId,this.currentPage,this.pageSize).then(res => {
          //console.log(res.data);
          let points = res.data.data;
          if (res.data.status != 200){
            this.$message({
              message:'没有车辆数据'
            });
            return false;
          } else{
            getAllcars().then(cars=>{
              let carsData = cars.data.data;
              //console.log(carsData);
              for (let i =0;i<carsData.length;i++){
                for (let j =0;j<points.length;j++){
                  if (points[j].carId==carsData[i].carId) {
                    points[j].label = carsData[i].label;
                  }
                }
              }
              //console.log(points);
              this.tableData = points;
              this.total=res.data.total;
            });
          }

        })
      },
      handleSizeChange(val){
        //console.log(val);
        this.pageSize = val;
        this.currentPage=1;
        this.getData()
      },
      handleCurrentChange(val){
        //console.log(val);
        this.currentPage=val;
        this.getData()
      },
      exportExcel () {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
        /* get binary string as output */
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        return wbout
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
      width: 250px;
      margin-left: 50px;
    }
  }

</style>
