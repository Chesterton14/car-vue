<template>
  <div style="width: 100%;height: 100%;text-align: center">
    <el-table
      :data="tableData.filter(data => !search || data.comName.toLowerCase().includes(search.toLowerCase()))"
      style="width: 95%;display: inline-block;margin-top: 30px"
      border>
      <el-table-column label="公司编号" prop="comId" align="center" width="100"></el-table-column>
      <el-table-column label="公司名" prop="comName" align="center"></el-table-column>
      <el-table-column label="公司电话" prop="comPhone" align="center"></el-table-column>
      <el-table-column label="公司地址" prop="comAddress" align="center"></el-table-column>
      <el-table-column align="center" width="320">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search"  placeholder="输入用户名关键字搜索">
            <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 10px"></i>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary"icon="el-icon-edit" plain round @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger"icon="el-icon-delete" plain round @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button type="success" size="mini"icon="el-icon-plus" plain round @click="newCom">新增公司</el-button>
          <el-dialog
            :title="'当前编辑公司：'+title"
            :visible.sync="dialogFormVisible"
            :modal-append-to-body='false'
            width="30%"
          >
            <el-form>
              <el-form-item label="公司名" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comName" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司电话" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comPhone" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comAddress" style="width: 204px"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="新增公司"
            :visible.sync="newComFormVisible"
            :modal-append-to-body='false'
            width="30%"
          >
            <el-form :rules="rules" ref="ruleForm" :model="form">
              <el-form-item label="公司名" prop="comName" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comName" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司电话" prop="comPhone" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comPhone" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司地址" prop="comAddress" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.comAddress" style="width: 204px"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="newComFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="newSubmit('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getAllcom, updateCom, deleteCom,newCom} from "../../api";

  export default {
    data() {
      return {
        tableData: [],
        search: '',
        dialogFormVisible: false,
        formLabelWidth: '100px',
        newComFormVisible: false,
        title: '',
        isEdit: '',
        form: {
          comId: '',
          comName: '',
          comPhone: '',
          comAddress: ''
        },
        rules: {
          comName: [{required: true, message: '请输入公司名', trigger: 'blur'}],
          comPhone: [{required: true, message: '请输入公司电话', trigger: 'blur'}],
          comAddress: [{required: true, message: '请选择公司地址', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getU();
    },
    watch: {
      isEdit() {
        this.getU();
      }
    },
    methods: {
      async getU() {
        let {data} = await getAllcom();
        //console.log(data);
        this.tableData = data.data;
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.title = row.comName;
        this.form.comId = row.comId;
        this.form.comName = row.comName;
        this.form.comPhone = row.comPhone;
        this.form.comAddress = row.comAddress;
        this.dialogFormVisible = true;
      },
      handleDelete(index, row) {
        console.log(index, row);
        //this.isEdit=true;
        this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCom(row.comId).then(()=>{
            this.isEdit = Math.random();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      onSubmit() {
        console.log(this.form);
        updateCom(this.form.comId, this.form);
        this.isEdit = Math.random();
        this.dialogFormVisible = false;
      },
      newCom() {
        this.newComFormVisible = true;
      },
      newSubmit(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            console.log(this.form);
            newCom(this.form).then((res)=>{
              if (res.data.status == 200){
                this.isEdit=Math.random();
                this.$message({
                  type:'success',
                  message:res.data.msg
                });
                this.newComFormVisible = false;
              }else{
                this.$message({
                  type:'error',
                  message:res.data.msg
                })
              }
            }).catch((error)=>{
              console.log(error);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>

<style scoped>

</style>
