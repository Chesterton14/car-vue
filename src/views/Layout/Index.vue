<template>
  <el-container class="main-container">
    <el-aside style="width: 210px;background-color:#304156 ">
      <router-link tag="a" class="info" to="/index/home">
          <span>车联网监控平台</span>
      </router-link>
      <Sidebar></Sidebar>
    </el-aside>
    <el-container>
      <el-header style="padding: 0;height: 50px" ref="header">
        <Navbar></Navbar>
      </el-header>
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Navbar from './Navbar.vue'
  import Sidebar from './Sidebar.vue'

  export default {
    name: "Index",
    components: {Navbar,Sidebar},

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .main-container {
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .el-main{
    padding: 0  !important;
  }
  .info{
    display: block;
    text-decoration: none;
    width: 210px;
    height: 50px;
    line-height: 50px;
    color: rgb(191, 203, 217);
    text-align: center;
    font-size: 20px;
  }
  .info:hover{
    background-color: rgb(38,52,69) ;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /*fade-transform*/
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-enter {
    opacity: 0;
    //transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    //transform: translateX(30px);
  }
</style>
