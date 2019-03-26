<template>
  <div style="height: 100%;width: 100%;text-align: center">
    <el-card class="box-card">
      <div class="text item">
        <div class="usericon">
          <i class="iconfont icon-gongsi" style="font-size: 20px"></i>
        </div>
        <div class="userinfo">
          <span>{{form.comName}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="text-align: left">
      <el-form label-width="100px" :model="form">
        <el-form-item label="公司名：">
          <transition name="fade-transform" mode="out-in">
            <span v-if="isInput">{{form.comName}}</span>
            <el-input v-else="isInput" suffix-icon="el-icon-tickets" type="text" v-model="form.comName"></el-input>
          </transition>
        </el-form-item>
        <el-form-item label="公司电话：">
          <transition name="fade-transform" mode="out-in">
            <span v-if="isInput">{{form.comPhone}}</span>
            <el-input v-else="isInput" suffix-icon="el-icon-tickets" type="text" v-model="form.comPhone"></el-input>
          </transition>
        </el-form-item>
        <el-form-item label="公司地址：">
          <transition name="fade-transform" mode="out-in">
            <span v-if="isInput">{{form.comAddress}}</span>
            <el-input v-else="isInput" suffix-icon="el-icon-tickets" type="text" v-model="form.comAddress"></el-input>
          </transition>
        </el-form-item>
        <el-form-item>
          <transition name="fade-transform" mode="out-in">
            <el-button v-if="isInput" type="primary" @click="onInput">修改</el-button>
            <span v-else="isInput">
            <el-button type="primary" @click="onSubmit">立即提交</el-button>
            <el-button @click="cancelInput">取消</el-button>
          </span>
          </transition>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {getCom,getUser,updateCom} from "../../api";

  export default {
    name: "company",
    data() {
      return {
        form: {
          comName: '',
          comPhone: '',
          comAddress: ''
        },
        isInput: true,
        comId:''
      }
    },
    created() {
      this.getCominfo();
    },
    methods: {
      onInput() {
        this.isInput = false;
      },
      cancelInput() {
        this.isInput = true;
      },
      async onSubmit() {
        let {data}=await updateCom(this.comId,this.form);
        console.log(data);
        this.$message({
          message: '修改成功',
          type: 'success',
          center: true,
          duration: 1500
        });
        this.isInput = true;
      },
      async getCominfo() {
        let{data}= await getUser(JSON.parse(window.localStorage.getItem('userinfo')).id);
        this.comId=data.data[0].comId;
        let res = await getCom(data.data[0].comId);
        console.log(res);
        let comData = res.data.data[0];
        this.form.comName = comData.comName;
        this.form.comPhone = comData.comPhone;
        this.form.comAddress = comData.comAddress;
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
