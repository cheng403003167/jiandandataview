<template>
  <div class="day">
    <el-row type="flex" justify="space-between" class="btn-con">
      <router-link class="reback" to="/">返回</router-link>
    </el-row>
    <div id="main" style="width: 800px;height:400px;"></div>
    <el-row type="flex" justify="space-between" class="btn-con">
      <el-button @click="getDayData(month,day,'reduce')">前一天</el-button>
      <el-button v-show="hasPrev" @click="prevStep()">上一步</el-button>
      <el-button @click="getDayData(month,day,'add')">后一天</el-button>
    </el-row>
    <el-row type="flex" justify="space-between" class="btn-con2">
      <el-button :class="imgData == 1?'active':''" @click="changeImgData()">图片数据</el-button>
      <el-button :class="imgData == 2?'active':''" @click="changeImgHour()">每小时数据</el-button>
      <el-button :class="imgData == 3?'active':''" @click="changeUserData()">用户数据</el-button>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data: function(){
    return {
      config:{
        title: {
            text: '',
        },
        tooltip:{
          show: true,
        },
        xAxis: {
            data: [],
        },
        yAxis: {},
        series: [{
            name: '每日图片数',
            type: 'bar',
            data: []
        }]
      },
      configTimeData:{
        title: {
            text: '每小时上传图片的数据'
        },
        tooltip:{
          show: true,
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [],
            type: 'line',
            name: '图片数'
        }]
      },
      dayData: {},
      year: 0,
      month: 0,
      day: 0,
      time: 0,
      timeModel:{'0':0,'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,'21':0,'22':0,'23':0},
      hasPrev: 0,
      imgData: 1 //判断是图片类型显示还是用户数据显示，1为图片类型显示，2为每小时数据，3为用户数据
    }
  },
  created: function(){
    this.year = new Date().getFullYear();
    this.month = this.$route.query.monthId;
    this.day = this.$route.query.dayId;
    this.maxDayToMonth = new Date(this.year,this.month,0).getDate();
  },
  mounted: function(){
    this.getDayData(this.month,this.day)
  },
  methods:{
    getDayData: function(month,day,flag){
      var that = this;
      if(flag == 'reduce'){
        day = parseInt(day) - 1;
      }else if(flag == 'add'){
        day = parseInt(day) + 1;
      }
      if(day < 1){
        if(month-1>0){
          let prevMonth = new Date(this.year,--month,0);
          day = prevMonth.getDate();
        }else{
          let prevMonth = new Date(this.year-1,12,0);
          day = 31;
          month = 12;
        }
      }
      if(day > this.maxDayToMonth){
        day = 1;
        if(month+1>12){
          month = 1;
        }else{
          month++;
        }
      }
      this.axios({
        url: 'http://localhost:3000/jiandanimgAPI/day/'+this.year+'/'+this.dubbleString(month)+'/'+this.dubbleString(day),
        method: 'get',
      }).then((data)=>{
        if(data.data.originData.length>0){
          that.dayData = data.data;
          that.day = parseInt(day);
          that.month = parseInt(month);
          if(flag == 'add' && day == 1 && month == 1){
            that.year++;
          }else if(flag == 'reduce' && day == 31 && month == 12){
            that.year--;
          }
          that.maxDayToMonth = new Date(this.year,month,0).getDate();
          if(that.imgData == 1){
            that.changeImgData();
          }else if(that.imgData == 2){
            that.changeImgHour();
          }else if(that.imgData == 3){
            that.changeUserData();
          }
        }
      })
    },
    changeImgData(){
      this.imgData = 1;
      var myChart = echarts.init(document.getElementById('main'));
      this.config.series[0].data = [];
      this.config.xAxis.data = [];
      this.config.title.text = this.dubbleString(this.month)+'月'+this.dubbleString(this.day)+'日图片数据('+this.getDayName()+')';
      this.config.xAxis.data.push('总数');
      this.config.series[0].data.push(this.dayData.originData.length);
      this.config.series[0].name = '图片数量';
      this.config.xAxis.data.push('jpg');
      this.config.series[0].data.push(this.dayData.type['jpg']);
      this.config.xAxis.data.push('gif');
      this.config.series[0].data.push(this.dayData.type['gif']);
      myChart.setOption(this.config);
      myChart.off('click');
    },
    changeImgHour(){
      this.imgData = 2;
      let tempDate = Object.assign({},this.timeModel);
      this.dayData.originData.forEach((item)=>{
        let hours = new Date(item.update).getHours().toString();
        if(tempDate[hours] == 0){
          tempDate[hours] = 1;
        }else if(tempDate[hours] > 0){
          ++tempDate[hours];
        }
      });
      this.configTimeData.xAxis.data = [];
      this.configTimeData.series[0].data = [];
      for(let st in tempDate){
        this.configTimeData.xAxis.data.push(st);
        this.configTimeData.series[0].data.push(tempDate[st]);
      }
      this.configTimeData.title.text = this.dubbleString(this.month)+'月'+this.dubbleString(this.day)+'日每小时上传图片的数据('+this.getDayName()+')';
      var myChart = echarts.init(document.getElementById('main'));
      myChart.setOption(this.configTimeData);
      myChart.off('click');
      myChart.on('click',(chartParams)=>{
        this.time = chartParams.name;
        this.changeTimeData(this.time);
      })
    },
    changeTimeData(time){
      if(this.time != time){
        this.time = time;
      }
      var myChart = echarts.init(document.getElementById('main'));
      let temp_time_data = [],user_arr = [],num_arr = [];
      this.dayData.originData.forEach((item)=>{
        let hours = new Date(item.update).getHours().toString();
        if(hours == time){
          temp_time_data.push(item);
        }
      });
      temp_time_data.forEach((item)=>{
        if(user_arr.indexOf(item.userName)<0){
          user_arr.push(item.userName);
          num_arr[user_arr.indexOf(item.userName)] = 1;
        }else{
          num_arr[user_arr.indexOf(item.userName)]++;
        }
      });
      this.config.series[0].data = [];
      this.config.xAxis.data = [];
      this.config.title.text = this.dubbleString(this.month)+'月'+this.dubbleString(this.day)+'日'+time+'时上传图片数据('+this.getDayName()+')';
      this.config.xAxis.data = user_arr;
      this.config.series[0].data = num_arr;
      myChart.setOption(this.config);
      myChart.off('click');
      myChart.on('click',(chartParams)=>{
        this.changeUserTimeData(chartParams);
      });
    },
    changeUserTimeData(data){
      let tempDate = Object.assign({},this.timeModel);
      this.dayData.originData.forEach((item)=>{
        if(item.userName == data.name){
          let hours = new Date(item.update).getHours().toString();
          if(tempDate[hours] == 0){
            tempDate[hours] = 1;
          }else if(tempDate[hours] > 0){
            ++tempDate[hours];
          }
        }
      });
      this.configTimeData.xAxis.data = [];
      this.configTimeData.series[0].data = [];
      for(let st in tempDate){
        this.configTimeData.xAxis.data.push(st);
        this.configTimeData.series[0].data.push(tempDate[st]);
      }
      this.configTimeData.title.text = this.dubbleString(this.month)+'月'+this.dubbleString(this.day)+'日"'+data.name+'"每小时上传图片的数据('+this.getDayName()+')';
      var myChart = echarts.init(document.getElementById('main'));
      myChart.setOption(this.configTimeData);
      myChart.off('click');
      this.hasPrev = 1;
    },
    changeUserData(){
      this.imgData = 3;
      var tempId = [],userName = [],userNumber = [],userInfo = [];
      this.dayData.originData.forEach((item)=>{
        if(tempId.indexOf(item.userId)<0){
          tempId.push(item.userId);
          userName[tempId.indexOf(item.userId)] = item.userName;
          userNumber[tempId.indexOf(item.userId)] = 1;
        }else{
          userNumber[tempId.indexOf(item.userId)]++;
        }
      });
      for(var ts = 0;ts<10;ts++){
        var max = Math.max(...userNumber);
        userInfo.push({
          id: tempId[userNumber.indexOf(max)],
          userName: userName[userNumber.indexOf(max)],
          number: max
        });
        tempId.splice(userNumber.indexOf(max),1);
        userName.splice(userNumber.indexOf(max),1);
        userNumber.splice(userNumber.indexOf(max),1);
      }
      var myChart = echarts.init(document.getElementById('main'));
      this.config.series[0].data = [];
      this.config.xAxis.data = [];
      this.config.title.text = this.dubbleString(this.month)+'月'+this.dubbleString(this.day)+'日用户图片数据(默认展示前10个)('+this.getDayName()+')';
      this.config.xAxis.data.push('总数');
      this.config.series[0].data.push(this.dayData.originData.length);
      this.config.series[0].name = '图片数量';
      for(let s = 0;s<10;s++){
        this.config.xAxis.data.push(userInfo[s].userName);
        this.config.series[0].data.push(userInfo[s].number);
      }
      myChart.setOption(this.config);
      myChart.off('click');
      myChart.on('click',(chartParams)=>{
        if(chartParams.name != '总数'){
          this.changeUserTimeData(chartParams);
        }
      });
    },
    prevStep(){
      if(this.hasPrev){
        this.hasPrev = 0;
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(this.config);
        myChart.on('click',(chartParams)=>{
          this.changeUserTimeData(chartParams);
        });
      }
    },
    dubbleString(data){
      if(data.toString().length<=1){
        data = 0 + data.toString();
      }
      return data;
    },
    getDayName(){
      let days = new Date(this.year+'-'+this.dubbleString(this.month)+'-'+this.dubbleString(this.day)).getDay();
      let days_x = '';
      switch(days){
        case 0:
          days_x =  '星期日';
          break;
        case 1:
          days_x =  '星期一';
          break;
        case 2:
          days_x =  '星期二';
          break;
        case 3:
          days_x =  '星期三';
          break;
        case 4:
          days_x =  '星期四';
          break;
        case 5:
          days_x =  '星期五';
          break;
        default:
          days_x =  '星期六';
          break;
      }
      return days_x;
    }
  }
}
</script>

<style>
  .reback{
    text-decoration: none;
    color: #000;
  }
  #main{
    margin-top: 30px;
  }
  .btn-con{
    width: 900px;
    margin: auto;
  }
  .btn-con2{
    width: 900px;
    margin: 20px auto;
  }
  .btn-con2 .active{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
</style>