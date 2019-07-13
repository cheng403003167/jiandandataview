<template>
  <div class="home">
    <div id="main" style="width: 800px;height:400px;"></div>
    <el-row type="flex" justify="space-between" class="btn-con">
      <el-button class="nextMonth" @click="changeMonth('jian')">上月</el-button>
      <el-button class="nextMonth" @click="changeMonth('add')">下月</el-button>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import echarts from 'echarts'

export default {
  name: 'home',
  data: function(){
    return {
      config:{
        title: {
            text: ''
        },
        tooltip: {},
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            name: '每日图片数',
            type: 'bar',
            data: []
        }]
      },
    }
  },
  mounted: function(){
    this.getMonthData(this.$store.state.currentMonth);
  },
  methods:{
    getMonthData(month){
      let that = this;
      if(month.toString().length<=1){
        month = 0 + month.toString();
      }
      var myChart = echarts.init(document.getElementById('main'));
      this.axios({
        url: 'http://localhost:3000/jiandanimgAPI/month/'+new Date().getFullYear()+'/'+month,
        method: 'get',
      }).then((data)=>{
        if(data.data.originData.length>0){
          this.config.title.text = month + '月上传图片数';
          this.config.xAxis.data = [];
          this.config.series[0].data = [];
          for(let t in data.data.day){
            this.config.xAxis.data.push(t+'日');
            this.config.series[0].data.push(data.data.day[t]);
          }
        }else{
          this.config.title.text = month + '月无数据';
          this.config.xAxis.data = [];
          this.config.series[0].data = [];
        }
        myChart.on('click',(chartParams)=>{
          that.$router.push({name: 'day',query:{dayId:parseInt(chartParams.name),monthId:that.$store.state.currentMonth}})
        });
        myChart.setOption(this.config);
      })
    },
    changeMonth(flag){
      if(flag == 'jian'){
        this.$store.commit('resetCurrentMonth',this.$store.state.currentMonth-1)
      }else if(flag == 'add'){
        this.$store.commit('resetCurrentMonth',this.$store.state.currentMonth+1)
      }
      this.getMonthData(this.$store.state.currentMonth);
      
    }
  }
}
</script>
<style>
  .home{
    position: relative;
    text-align: center;
  }
  #main{
    display: block;
    margin: auto;
  }
  .nextMonth{
    cursor: pointer;
  }
  .btn-con{
    width: 900px;
    margin: auto;
  }
</style>
