<template>
  <div style="width: 100%;height: 100%;text-align: center">
    <el-table
      :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
      style="width: 95%;display: inline-block;margin-top: 30px"
      border
      ref="table"
    >
      <el-table-column label="用户编号" prop="id" align="center" width="100"></el-table-column>
      <el-table-column label="用户名" prop="username" align="center"></el-table-column>
      <el-table-column label="所属公司" prop="comName" align="center"></el-table-column>
      <el-table-column label="角色" prop="roleName" align="center"></el-table-column>
      <el-table-column align="center" width="320">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search"  placeholder="输入用户名关键字搜索">
            <i slot="prefix" class="el-input__icon el-icon-search" style="margin-left: 10px"></i>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary"icon="el-icon-edit" plain round @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger"icon="el-icon-delete" plain round @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button type="success" size="mini" icon="el-icon-plus" plain round @click="newUser">新增用户</el-button>
          <el-dialog
            :title="'当前编辑用户：'+title"
            :visible.sync="dialogFormVisible"
            :modal-append-to-body='false'
            width="30%"
          >
            <el-form>
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.username" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input type="password" autocomplete="off" v-model="form.password" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司" :label-width="formLabelWidth">
                <el-select placeholder="选择公司" v-model="form.comId">
                  <el-option
                    v-for="(item,index) in coms"
                    :key="index"
                    :label="item.comName"
                    :value="item.comId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色" :label-width="formLabelWidth">
                <el-select placeholder="选择角色" v-model="form.roleId">
                  <el-option
                    v-for="(item,index) in roles"
                    :key="index"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="新增用户"
            :visible.sync="newUserFormVisible"
            :modal-append-to-body='false'
            width="30%"
          >
            <el-form :rules="rules" ref="ruleForm" :model="form">
              <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                <el-input type="text" autocomplete="off" v-model="form.username" required
                          style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                <el-input type="password" autocomplete="off" v-model="form.password" style="width: 204px"></el-input>
              </el-form-item>
              <el-form-item label="公司" prop="comId" :label-width="formLabelWidth">
                <el-select placeholder="选择公司" v-model="form.comId">
                  <el-option
                    v-for="(item,index) in coms"
                    :key="index"
                    :label="item.comName"
                    :value="item.comId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色" prop="roleId" :label-width="formLabelWidth">
                <el-select placeholder="选择角色" v-model="form.roleId">
                  <el-option
                    v-for="(item,index) in roles"
                    :key="index"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="newUserFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="newSubmit('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
  import {getAlluser, getAllcom, getCom, updateUser, deleteUser, newUserapi,getAllroles,getRole} from "../../api";

  export default {
    data() {
      return {
        tableData: [],
        search: '',
        dialogFormVisible: false,
        newUserFormVisible: false,
        formLabelWidth: '100px',
        title: '',
        coms: [],
        isEdit: '',
        form: {
          id: '',
          username: '',
          password: '',
          comId: '',
          comName: '',
          roleId:''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          comId: [{required: true, message: '请选择公司', trigger: 'blur'}],
          roleId: [{required: true, message: '请选择角色', trigger: 'blur'}],
        },
        roles:[]
      }
    },
    created() {
      this.getU();
      this.getcom();
    },
    watch: {
      isEdit() {
        this.getU();
      }
    },
    methods: {
      async getU() {
        let {data} = await getAlluser();
        //console.log(data);
        let orignData = data.data;
        let res = await getAllcom();
        //console.log(res.data.data);
        let roleres = await getAllroles();
        //console.log(roleres.data.data);
        let comIds = res.data.data;
        let roleIds = roleres.data.data;
        this.roles = roleres.data.data;
        for (let i = 0; i < orignData.length; i++) {
          for (let j = 0; j < comIds.length; j++) {
            if (orignData[i].comId === comIds[j].comId) {
              orignData[i].comName = comIds[j].comName;
            }
          }
        }
        for (let i = 0; i < orignData.length; i++) {
          for (let j = 0; j < roleIds.length; j++) {
            if (orignData[i].roleId === roleIds[j].roleId) {
              orignData[i].roleName = roleIds[j].roleName;
            }
          }
        }
        this.tableData = orignData;
      },
      async handleEdit(index, row) {
        //console.log(row);
        this.title = row.username;
        this.form.id = row.id;
        this.form.username = row.username;
        this.form.password = row.password;
        let {data} = await getCom(row.comId);
        this.form.comId = data.data[0].comId;
        let res = await getRole(row.roleId);
        //console.log(res);
        this.form.roleId = res.data.data[0].roleId;
        this.dialogFormVisible = true;
      },
      handleDelete(index, row) {
        //console.log(index, row);
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(row.id).then(() => {
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
        updateUser(this.form.id, this.form).then((res)=>{
          //console.log(this.form);
          this.isEdit = Math.random();
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.dialogFormVisible = false;
        }).catch((error)=>{
          console.log(error);
        });
      },
      newUser() {
        this.newUserFormVisible = true;
      },
      newSubmit(formname) {
        this.$refs[formname].validate((valid) => {
          if (valid) {
            //console.log(this.form);
            newUserapi(this.form).then((res) => {
              //console.log(res.data);
              if (res.data.status == 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.isEdit = Math.random();
                this.newUserFormVisible = false;
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg
                });
              }
            }).catch((error) => {
              console.log(error);
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      async getcom() {
        let {data} = await getAllcom();
        this.coms = data.data;
      }
    },
  }
</script>

<style scoped>

</style>
