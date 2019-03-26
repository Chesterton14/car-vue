<template>
  <div class="navbar">
    <breadcrumd></breadcrumd>
    <el-dropdown>
      <span class="el-dropdown-link">
        {{username}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item><a href="javascript:" @click="toUser">个人中心</a></el-dropdown-item>
        <el-dropdown-item ><a href="javascript:" @click.prevent="logOut">退出登录</a></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import breadcrumd from './breadcrumd.vue'
  export default {
    name: "Navbar",
    components:{breadcrumd},
    data(){
      return{
        username:''
      }
    },
    created(){
        this.username= JSON.parse(window.localStorage.getItem('userinfo')).username;
    },
    methods:{
      logOut () {
        this.$store.dispatch('logOut');
        window.localStorage.removeItem('userinfo');
        this.$router.push('/');
        this.$message({
          message:'已退出',
          type:'success',
          center:true,
          duration:1500
        })
      },
      toUser(){

        this.$router.push('/setting/user');

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px !important;
    line-height: 50px !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #000000;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-dropdown{
    float:right;
    margin-right: 20px;
  }
  a{
    text-decoration: none;
    color: #000000;
  }

</style>
