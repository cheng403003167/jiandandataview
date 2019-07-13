<template>
  <div class="user_con">
    <el-button v-if="select != 1" @click="reback()">返回</el-button>
    <p class="userData_des">
      <span class="text">{{text}}</span>
      <span class="fli">（注：从2019-06-15号起）</span>
    </p>
    <div class="parent-dom" v-if="select == 1">
      <vue-scroll :ops="ops"> 
        <div class="child-dom">
          <p v-for="(item,index) in userdata" :key="index" @click="userInfo(item,index)">
            <span>{{index+1}}</span>
            <span>{{item.userName}}</span>
            <span>{{item.number}}</span>
          </p>  
        </div> 
      </vue-scroll>
    </div>
    <div class="parent-dom2" v-else>
      <vue-scroll :ops="ops"> 
        <div class="child-dom2">
          <p v-for="(item,index) in userinfo" :key="index">
            <span class="dateText">{{item.dateText}}</span>
            <span class="timeData">
              <i v-for="n in 23" :key="n" :class="timeColor(item.time,n)" :title="item.time[n]?'上传的图片数：'+item.time[n]:''">{{n}}</i>
            </span>
            <span class="total">
              <i>{{'共'+item.total+'张图片'}}</i>
            </span>
          </p>  
        </div> 
      </vue-scroll>
    </div>
  </div>
</template>
<script>
  export default {
    data: function(){
      return {
        ops: {
          vuescroll: {
            mode: 'native',

          },
          scrollPanel: {},
          rail: {},
          bar: {
            background: '#409EFF',
            minSize: 0.1
          }
        },
        text: '用户上传排行榜',
        select: 1,
        userdata: [],
        userinfo: []
      }
    },
    mounted(){
      this.getUserData();
    },
    methods:{
      getUserData(){
        let that = this;
        this.axios({
          url: 'http://ch.dnitu.top/jiandanimgAPI/userChart',
          method: 'get',
        }).then((data)=>{
          if(data.data.length>0){
            that.userdata = that.userdata.concat(data.data);
          }
        })
      },
      userInfo(datas,index){
        let that = this;
        this.axios({
          url: 'http://ch.dnitu.top/jiandanimgAPI/userInfo/'+datas.userId,
          method: 'get',
        }).then((data)=>{
          if(data.data.length>0){
            let tempData = [],tempTime = [];
            that.select = 2;
            that.text = '第'+index+' '+datas.userName+' '+datas.number;
            data.data.forEach((item)=>{
              if(!tempTime.includes(item.update.split(' ')[0])){
                tempTime.push(item.update.split(' ')[0]);
                let ind = tempTime.indexOf(item.update.split(' ')[0]);
                tempData[ind] = {};
                tempData[ind].dateText = item.update.split(' ')[0];
                tempData[ind].time = {};
                tempData[ind].time[new Date(item.update).getHours().toString()] = 1;
                tempData[ind].type = {};
                tempData[ind].type[item.imgName.split('.')[1]] = 1;
              }else{
                let ind = tempTime.indexOf(item.update.split(' ')[0]);
                if(tempData[ind].time[new Date(item.update).getHours().toString()]){
                  tempData[ind].time[new Date(item.update).getHours().toString()]++;
                }else{
                  tempData[ind].time[new Date(item.update).getHours().toString()] = 1;
                }
                if(tempData[ind].type[item.imgName.split('.')[1]]){
                  tempData[ind].type[item.imgName.split('.')[1]]++;
                }else{
                  tempData[ind].type[item.imgName.split('.')[1]] = 1;
                }
              }
            });
            for(let ss = 0;ss<tempData.length;ss++){
              tempData[ss].total = 0;
              tempData[ss].classed = {};
              for(let ssD in tempData[ss].type){
                tempData[ss].total += tempData[ss].type[ssD];
              }
              for(let ssT in tempData[ss].time){
                tempData[ss].classed[ssT] = that.timeColor(tempData[ss].time[ssT]);
              }
            }
            for(let ss3 in tempData){
              that.userinfo.push(tempData[ss3]);
            }
          }
        })
      },
      timeColor(time,n){
        let tempClass = '';
        for(let s in time){
          if(s == n){
            if(0<time[s] && time[s]<=3){
              tempClass = 'class1';
            }
            if(3<time[s] && time[s]<=6){
              tempClass = 'class2';
            }
            if(6<time[s] && time[s]<=9){
              tempClass = 'class3';
            }
            if(9<time[s] && time[s]<=12){
              tempClass = 'class4';
            }
            if(12<time[s] && time[s]<=15){
              tempClass = 'class5';
            }
            if(15<time[s] && time[s]<=18){
              tempClass = 'class6';
            }
            if(18<time[s] && time[s]<=21){
              tempClass = 'class7';
            }
            if(21<time[s] && time[s]<=24){
              tempClass = 'class8';
            }
            if(time[s]>24){
              tempClass = 'class9';
            }
          }
        }
        return tempClass;
      },
      reback(){
        this.select = 1;
        this.userinfo = [];
        this.text = '用户上传排行榜';
      }
    }
  }
</script>
<style>
  .user_con{
    position: relative;
    display: inline-block;
    margin: auto;
  }
  .user_con .el-button{
    position: absolute;
    top: -20px;
    left: 0;
  }
  .userData_des{
    font-size: 16px;
    color: #fff;
  }
  .userData_des .fli{
    font-size: 14px;
  }
  .parent-dom,.parent-dom2{
    background: #fff;
    height: 600px;
  }
  .child-dom p{
    margin: 0;
    padding: 10px 0;
    cursor: pointer;
    text-align: left;
  }
  .child-dom p:nth-of-type(odd){
    background: #ddd;
  }
  .child-dom p:hover{
    background: #409EFF;
    color: #fff;
  }
  .child-dom p span{
    display: inline-block;
    margin: 0 6px;
  }
  .child-dom p span:nth-of-type(1){
    width: 36px;
  }
  .child-dom p span:nth-of-type(3){
    float: right;
  }
  .class1{
    background: rgb(236, 245, 255) !important;
  }
  .class2{
    background: rgb(217, 236, 255) !important;
  }
  .class3{
    background: rgb(198, 226, 255) !important;
  }
  .class4{
    background: rgb(179, 216, 255) !important;
  }
  .class5{
    background: rgb(160, 207, 255) !important;
  }
  .class6{
    background: rgb(140, 197, 255) !important;
  }
  .class7{
    background: rgb(121, 187, 255) !important;
  }
  .class8{
    background: rgb(102, 177, 255) !important;
  }
  .class9{
    background: rgb(83, 168, 255) !important;
  }
  .child-dom2 p{
    margin: 0 !important;
    padding: 6px 0;
    text-align: left;
  }
  .child-dom2 span{
    display: inline-block;
    margin: 0 4px;
    vertical-align: middle;
  }
  .child-dom2 .dateText{
    width: 90px;
  }
  .child-dom2 .timeData i{
    display: inline-block;
    width: 24px;
    line-height: 20px;
    font-style: initial;
    background: #ddd;
    cursor: pointer;
    color: #fff;
    text-align: center;
  }
  .child-dom2 .total i{
    display: inline-block;
    font-size: 14px;
    font-style: initial;
  }
</style>

