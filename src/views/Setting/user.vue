<template>
  <div style="height: 100%;width: 100%;text-align: center">
    <el-card class="box-card">
      <div class="text item">
        <div class="usericon">
          <i class="iconfont icon-Icon-morentouxiang"></i>
        </div>
        <div class="userinfo">
          <span>{{form.username}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="text-align: left">
      <el-form label-width="80px" :model="form">
        <el-form-item label="用户名">
          <transition name="fade-transform" mode="out-in">
            <span v-if="isInput">{{form.username}}</span>
            <el-input v-else="isInput" type="text" v-model="form.username" suffix-icon="el-icon-tickets"></el-input>
          </transition>
        </el-form-item>
        <transition name="fade-transform" mode="out-in">
          <el-form-item label="密码" v-if="!isInput">
            <el-input type="password" v-model="form.password" suffix-icon="el-icon-tickets"></el-input>
          </el-form-item>
        </transition>
        <el-form-item label="公司">
          <transition name="fade-transform" mode="out-in">
            <span v-if="isInput">{{form.comName}}</span>
            <el-select v-else="isInput" placeholder="选择公司" v-model="form.comId">
              <el-option
                v-for="(item,index) in coms"
                :key="index"
                :label="item.comName"
                :value="item.comId">
              </el-option>
            </el-select>
          </transition>
        </el-form-item>
        <el-form-item>
          <transition name="fade-transform" mode="out-in">
            <el-button v-if="isInput" type="primary" @click="onInput">修改</el-button>
            <span v-else="isInput">
            <el-button type="primary" @click="onSubmit">立即提交</el-button>
          <el-button @click="cancel">取消</el-button>
          </span>
          </transition>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {getAllcom,updateUser,getUser,getCom} from "../../api";

  export default {
    name: "user",
    data() {
      return {
        form: {
          username: '',
          password: '',
          comName: '',
          comId:''
        },

        isInput: true,
        coms: [],
      }
    },
    created() {
      this.getU();
      this.getcom();
    },
    methods: {
      async getU(){
        let userID = JSON.parse(window.localStorage.getItem('userinfo')).id;
        //console.log(userN);
        let{data}=await getUser(userID);
        let userData = data.data[0];
        this.form.username=userData.username;
        this.form.password=userData.password;
        let res = await getCom(userData.comId);
        //console.log(res);
        this.form.comId=res.data.data[0].comId;
        this.form.comName=res.data.data[0].comName;
      },
      onInput() {
        this.isInput = false;
      },
      cancel() {
        this.isInput = true;
      },
      async onSubmit() {
        //console.log(this.form);
        await updateUser(JSON.parse(window.localStorage.getItem('userinfo')).id,this.form);
        this.$message({
          message: '修改成功',
          type: 'success',
          center: true,
          duration: 1500
        });
        this.isInput = true;
      },
      async getcom() {
        let {data} = await getAllcom();
        this.coms = data.data;

      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 20px;
  }

  .item {
    padding: 18px 0;
    display: flex;
  }

  .box-card {
    width: 95%;
    display: inline-block;
    margin-top: 10px;
    line-height: 50px;
  }

  .usericon, userinfo {
    height: 50px;
    width: 10%;
  }

  .el-input {
    width: 203px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /*fade-transform*/
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.2s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
