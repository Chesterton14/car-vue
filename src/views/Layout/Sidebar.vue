<template>
  <el-menu
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#304156"
    text-color="#BFCBD9"
  >
    <el-submenu v-for="(item1,index) in demo" :key="index" :index="item1.path">
      <template slot="title">
        <i class="iconfont" :class="item1.meta.icon"></i>
        {{item1.meta.title}}
      </template>
      <router-link tag="el-menu-item" :to="item2.path" v-for="(item2,index2) in item1.children" :key="index2" :index="item2.path">
        {{item2.meta.title}}
      </router-link>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "Sidebar",
    data() {
      return {
        demo:[]
      }
    },
    created() {
      this.getSideList();
    },
    methods: {
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
      getSideList(){
        let sideBarList=this.$router.options.routes.filter(item => item.isSidebar === true);
        let userRole=JSON.parse(window.localStorage.getItem('userinfo')).roleId;
        if(userRole == "1"){
          this.demo = sideBarList;
        }else{
          this.demo=sideBarList.filter(item=>item.meta.role=='user');
        }
        //console.log(userRole);
        //console.log(sideBarList);
        //let isRole = sideBarList.filter(item => item.meta.role)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-aside {
    color: rgb(191, 203, 217);

    .el-menu {
      border: none;

      i {
        font-size: 20px;
        color: rgb(191, 203, 217);
      }

      .el-menu-item {
        background-color: #1f2d3d !important;
      }

      .el-menu-item:hover {
        background-color: #001528 !important;
      }

      li.router-link-active {
        color: rgb(64, 158, 255) !important;
      }
    }
  }
</style>
