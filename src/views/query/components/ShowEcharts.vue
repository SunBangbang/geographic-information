<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :width="dialogWidth"
    @close="handleClose">
    <div id="radar" v-loading="loading" v-if="type === 1"></div>
    <div id="mulberry" v-else>
      <div class="citySelect">
        <el-select v-model="selectedCity" placeholder="选择桑基图分析目标" @change="cityChanged">
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div id="mulberry1" v-loading="loading" :style="{height: selectedCity!=='' ? '394px' : ''}"></div>
      <div id="mulberry2" v-loading="loading" :style="{height: selectedCity!=='' ? '394px' : ''}"></div>
    </div>
  </el-dialog>
</template>
<script>
import * as echarts from 'echarts';

export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: ''
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    echartsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogWidth:"",
      // 雷达图或桑基图1
      chart1: null,
      // 桑基图2
      chart2: null,
      loading: true,
      cityOptions: ['南京','南通','宿迁','常州','徐州','扬州','无锡','泰州','淮安','盐城','苏州','连云港','镇江','江苏省'],
      selectedCity: '',
    }
  },
  created() {
    console.log('created');
    if(this.type ===1 ){
        this.dialogWidth = "440px"
    }else{
        this.dialogWidth = "770px" ;
        this.loading = false;
    }
  },
  components: {},
  mounted() {
    console.log('mounted');
    //   setInterval(()=>{
    //         console.log(this.echartsData)
    //   },2000)
    this.$nextTick(() => {
      this.echartsInit()
    })

    // 桑基图默认加载江苏省
    if(this.type === 2) {
      this.selectedCity = '江苏省';
      this.cityChanged(this.selectedCity)
    }
  },
  watch: {
    // 图表数据到达
    echartsData(newValue, oldValue) {
      console.log('图表数据到达/改变');
      console.log(newValue);
      if(newValue === undefined || newValue === null){
        return
      }
      if(this.type === 1) {
        this.initRadar(newValue)
      } 
      if(this.type === 2) {
        // 初始化或重绘
        this.setMulberry(newValue)
      }
      this.loading = false;
    },
  },
  methods: {
    cityChanged() {
      console.log('cityChanged');
      this.$emit('mulberryCitySelected', this.selectedCity)
      this.loading = true;
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('update:title', "")
      this.$emit('update:type', 0)
      this.chart1.dispose()
      this.chart2.dispose()
    },
    echartsInit() {
      if(this.type == 1){
        this.chart1 = echarts.init(document.getElementById('radar'))
      }
      if(this.type == 2) {
        this.chart1 = echarts.init(document.getElementById('mulberry1'))
        this.chart2 = echarts.init(document.getElementById('mulberry2'))
      }
    },
    initRadar(data) {
      let max = this.getMaxValue(data.satrt, data.end)
      let option = {
        legend: {
          data: ['出发货运量分布', '到达货运量分布']
        },
        radar: {
          shape: 'circle',
          indicator: [
            { name: '南京', max},
            { name: '盐城', max},
            { name: '宿迁', max},
            { name: '泰州', max},
            { name: '镇江', max},
            { name: '扬州', max},
            { name: '淮安', max},
            { name: '连云港', max},
            { name: '南通', max},
            { name: '苏州', max},
            { name: '常州', max},
            { name: '徐州', max},
            { name: '无锡', max},
          ],
          axisLine: {
            show: false
          }
        },
        series: [
          {
            type: 'radar',
            symbol: 'none',
            data: [
              {
                value: this.dataFilter(data.end, 1),
                name: '出发货运量分布'
              },
              {
                value: this.dataFilter(data.satrt, 2),
                name: '到达货运量分布'
              }
            ]
          }
        ]
      }
      this.chart1.setOption(option)
    },
    getMaxValue(arr1, arr2) {
      let max = 0;
      arr1.forEach(element => {
        if(element.num > max){
          max = element.num
        }
      });
      arr2.forEach(element => {
        if(element.num > max){
          max = element.num
        }
      });
      console.log('maxValuend');
      return max
    },
    dataFilter(arr, type) {
      let citys=[
        '南京',
        '盐城',
        '宿迁',
        '泰州',
        '镇江',
        '扬州',
        '淮安',
        '连云港',
        '南通',
        '苏州',
        '常州',
        '徐州',
        '无锡',
      ]
      let result = []
      citys.forEach(city => {
        let find = arr.find(ele => {
          return ele[type==1?'startcity':'endcity']==city
        })
        result.push(find.num)
      })
      return result
    },
    setMulberry(data) {
      console.log('initMulberry data');
      // console.log(data);
      let option1 = {
        series: {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: data.data,
          links: data.links,
        }
      }
      let option2 = {
        series: {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: data.datas,
          links: data.linkss,
        }
      }
      this.chart1.clear()
      this.chart2.clear()
      this.chart1.setOption(option1)
      this.chart2.setOption(option2)
    },
  },
  computed: {}
}
</script>
<style lang="scss" scoped>
#radar {
  height: 394px;
}
#mulberry {
  .citySelect{
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.dialog{
  /deep/ .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
  /deep/ .el-dialog__body {
    padding-top: 2px;
    padding-bottom: 0;
    flex:1;
    overflow: auto;
  }
}

</style>
