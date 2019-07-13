<template>
  <div id="app">
    <el-row>
      <el-col :span="24"><div class="header-div"></div></el-col>
    </el-row>
    <el-row class="content">
      <el-col class="content_col" :span="20" :offset="2">
        <router-view/>
        <div class="slider_btn">
          <el-button @click="changeData(1)" :class="select == 1?'active':''">图片数据</el-button>
          <el-button @click="changeData(2)" :class="select == 2?'active':''">用户数据</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data: function(){
      return {
        select: 1
      }
    },
    created: function(){
      this.$store.commit('resetCurrentMonth',new Date().getMonth() + 1);
    },
    methods:{
      changeData(da){
        if(this.select == 1 && da == 2){
          this.select = da;
          this.$router.push({name: 'userData'});
        }else if(this.select == 2 && da == 1){
          this.select = da;
          this.$router.push({name: 'home'});
        }else if(this.select == 1 && da == 1){
          this.select = da;
          this.$router.push({name: 'home'});
        }
      }
    }
  }
</script>

<style>
  body{
    background: #848587;
    margin: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: auto;
  }
  .header-div{
    height: 60px;
    background: #c3c3c3;
  }
  .content{
    margin-top: 60px;
  }
  .content_col{
    position: relative;
  }
  .slider_btn{
    position: absolute;
    left: 0;
    top: 200px;
  }
  .slider_btn .el-button{
    display: block;
    margin: 10px 0 !important;
  }
  .slider_btn .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
</style>
