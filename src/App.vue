<template>
  <div id="app">
    <el-row>
      <el-col :span="24"><div class="header-div"></div></el-col>
    </el-row>
    <el-row class="content">
      <el-col :span="20" :offset="2"><router-view/></el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    created: function(){
      this.$store.commit('resetCurrentMonth',new Date().getMonth() + 1);
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
</style>
