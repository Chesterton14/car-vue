<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm">
      <h2 class="title">车联网监控平台</h2>
      <el-form-item>
        <span class="svg-container">
            <i class="iconfont icon-people"></i>
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="svg-container">
            <i class="iconfont icon-lock"></i>
        </span>
        <el-input v-model="loginForm.password" name="password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item  style="width: 240px;position: relative">
        <span class="svg-container">
            <i class="iconfont icon-lock"></i>
        </span>
        <el-input v-model="loginForm.vertifyCode"  name="code" type="text" placeholder="验证码" style="width: 150px"></el-input>
        <span @click="getVertifyCode" v-html="code" style="position: absolute;margin-left: 45px;background-color: #ffffff;border-radius:4px;height: 53.6px"></span>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click="toLogin" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {doLogin, getIndex,getCode} from "../api";

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123',
          vertifyCode:''
        },
        code:''
      }
    },
    created(){
      this.keyupSubmit()
      this.getVertifyCode()
    },
    methods: {
      toLogin() {
        this.$store.dispatch('toLogin', {
          loginUser: this.loginForm.username,
          loginPassword: this.loginForm.password,
          vertifyCode:this.loginForm.vertifyCode
        }).then((res) => {
          if (res.data.status === 200) {
            window.localStorage.setItem('userinfo', JSON.stringify(res.data.data));
            this.$store.dispatch('getUser');
            this.$router.push('/index')
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error',
              center: true,
              duration: 2000
            });
          }
        }).catch((error) => {
          console.log(error.response.data.message)
          this.$message({
            message: error.response.data.message,
            type: 'error',
            center: true,
            duration: 1500
          });
        })
      },
      async getVertifyCode(){
        let res = await getCode()
        this.code = res.data;
      },
      keyupSubmit(){
        document.onkeydown=e=>{
          let _key=window.event.keyCode;
          if(_key===13){
            this.toLogin()
          }
        }
      },
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .title {
      font-size: 30px;
      font-weight: 400;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      i{
        font-size: 20px;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

  }
</style>
