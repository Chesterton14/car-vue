<template>
  <div style="height: 100%;width: 100%;text-align: center">
    <el-table
      :data="tableData.filter(data => !search || data.label.toLowerCase().includes(search.toLowerCase()))"
      style="width: 95%;display: inline-block;margin-top: 30px"
      border>
      <el-table-column label="车辆编号" prop="carId" align="center" width="100"></el-table-column>
      <el-table-column label="车辆名" prop="label" align="center"></el-table-column>
      <el-table-column label="所属用户" prop="username" align="center"></el-table-column>
      <el-table-column align="center" width="320">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入车辆名关键字搜索">
            <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 10px"></i>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain round
                     @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain round
                     @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
          <el-dialog
            :title="'当前编辑车辆：'+title"
            :visible.sync="dialogFormVisible"
            :modal-append-to-body='false'
            width="30%"
          >
            <el-form>
              <el-form-item label="车辆名" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.label" style="width: 204px"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="2">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getUserCar,updateCar,deleteCar} from "../../api";

  export default {
    name: "car",
    data(){
      return{
        tableData:[],
        dialogFormVisible:false,
        formLabelWidth:'100px',
        form:{
          carId:'',
          label:''
        },
        title:'',
        search:'',
        isEdit:'',
        userId:''
      }
    },
    created() {
      this.userId=JSON.parse(window.localStorage.getItem('userinfo')).id
      this.getTableData();
    },
    watch: {
      isEdit() {
        this.getTableData();
      }
    },
    methods:{
      getTableData(){
        getUserCar(this.userId).then(res=>{
          //console.log(res);
          this.tableData=res.data.data;
        }).catch(error=>{
          console.log(error);
        })

      },
      handleEdit(index, row) {
        //console.log(index, row);
        this.form.carId=row.carId;
        this.dialogFormVisible=true
      },
      handleDelete(index, row) {
        //console.log(index, row);
        deleteCar(row.carId).then(res=>{
          if (res.data.status == '200'){
            this.$message({
              type:'success',
              message:'删除成功'
            })
            this.isEdit=Math.random();
          }
        })
      },
      onSubmit(){
        console.log(this.form);
        if (this.form.label==''){
          this.$message({
            type:'error',
            message:'不输入车辆名么???'
          });
          return false;
        }else{
          updateCar(this.form.carId,this.form).then(res=>{
            if (res.data.status == '200'){
              this.$message({
                type:'success',
                message:'修改成功！',
                center:true
              });
              this.isEdit=Math.random();
              this.dialogFormVisible=false;
            }
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
