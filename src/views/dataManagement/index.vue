<template>
  <div class="view">
    <div class="box">
      <div class="operation-box">
        <div><span>数据管理</span></div>
        <div>
          <div>
            <el-button icon="el-icon-plus" size="mini" @click="dialogVisibles" v-if="addshow"
            >新增</el-button
            >
            <el-button icon="el-icon-download" size="mini" type="primary" @click="exportData" v-if="exportshow"
              >导出</el-button
            >
          </div>
          
          <div>
            <el-select
              v-model="leftvalue"
              placeholder="请选择"
              @change="selectOne"
              size="mini"
            >
              <el-option
                v-for="item in leftOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="rightvalue"
              placeholder="请选择"
              @change="selectTwo"
              size="mini"
            >
              <el-option
                v-for="item in rightOptions"
                :key="item.prop"
                :label="item.label"
                :value="item.prop"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="tStatisticalContainerValue"
              placeholder="请选择"
              @change="selectThree"
              size="mini"
              v-if="this.rightvalue == 'tStatisticalContainer'"
            >
              <el-option
                v-for="item in tStatisticalContainerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          height="100%"
          :ref="tableData"
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderStyle"
          border
          show-overflow-tooltip
        >
          <template v-for="(item, index) in tableHeaders">
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
              show-overflow-tooltip
            >
            </el-table-column>
          </template>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="150"
            v-if="caozuoshow"
          >
            <template slot-scope="scope">
              <!-- <el-upload
                class="upload-demo"
                ref="upload"
                accept=".png,.jpg"
                :action="uploadUrl"
                :on-success='uploadchange'
                :data={id:uploadId}
                :file-list="fileList"
              >
                <el-button type="text" size="mini" class="uploadingBtn" @click="uploadingBtn(scope.row)"
                >上传</el-button>
              </el-upload> -->

              <el-button type="text" size="mini" class="editBtn" @click="editBtn(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" size="mini" class="deleteBtn"  @click="deleteBtn(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          v-if="paginationShow"
          background
          layout="prev, pager, next"
          :current-page="pageno"
          :page-size="pagesize"
          :total="total"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <add-dialog
      :tableHeaders="tableHeaders"
      :title="dialogTitle"
      :rightvalue="rightvalue"
      :visible.sync="dialogVisible"
      :editForm.sync="detailFrom"
      :rowdata="rowdata"
      :isaddUpdate="isaddUpdate"
      v-if="dialogVisible"
    />
   
  </div>
</template>
<script>
import {
  BaseAnchorage,
  BaseBerth,
  infrastructure,
  statisticalQuery,
  situationMonitoring,
  StatisticalBerth,
  BaseBridge,
  BaseCabinwashing,
  BaseChannel,
  BasePortplanning,
  BaseShiplock,
  tBaseShoreline,
  BaseWaterservice,
  BaseWorkarea,
  StatisticalCargothroughput,
  StatisticalChannel,
  tStatisticalChannelFreight,
  tStatisticalChannelGoodstotal,
  tStatisticalContainer,
  StatisticalThroughput
} from '@/assets/js/localData'
import { common, dataManagement } from '@/api'
import AddDialog from './components/AddDialog'
import user from '@/api/modules/user'
export default {
  components: {
    AddDialog
  },
  activated(){
    // this.tableHeaders = BaseAnchorage
    this.getBaseAnchorage()
  },
  created() {

    this.tableHeaders = BaseAnchorage
    this.getBaseAnchorage()
    // console.log(this.tableHeaders)
  },
  data() {
    return {
      paginationShow:true,
      total: 0, //分页
      pagesize: 10, //分页
      pageno: 1, //分页
      leftvalue: '1',
      dialogVisible: false,
      detailFrom: {},
      dialogTitle: '新增数据',
      leftOptions: [
        {
          value: '1',
          label: '基础设施'
        },
        {
          value: '2',
          label: '统计查询'
        },
        {
          value: '3',
          label: '态势监测'
        }
      ],
      rightvalue: '锚地基本信息',
      rightOptions: [],
      // 年度集装箱吞吐量类型
      tStatisticalContainerOptions:[
        {
          value: 'coastal',
          label: '沿海'
        },
        {
          value: 'along_river',
          label: '沿江'
        },
        {
          value: 'inland_river',
          label: '内河'
        },

      ],
      testValue: '',
      tableData: [],
      tableHeaders:[],
      addedit:true,
      rowdata:{},
      isaddUpdate:true,
      addshow:true, 
      exportshow:true,
      caozuoshow:true,
      fileList:[],
      uploadId:'',
      uploadUrl:'',
      uploadIds:'',
      tStatisticalContainerValue:'沿海',
      // data:{
      //   id:uploadIds,
      // }
      // 过滤表格
    }
  },
  mounted() {
    // 调接口
    this.rightOptions = infrastructure
    this.getBaseAnchorage()
    // this.getStatisticalBerth()
    this.jurisdiction()
  },

  methods: {

    // 用户权限
    jurisdiction(){
      user.getUserInfo().then(res=>{
        console.log(res.res.realname);
        if(res.res.realname == '内部人员'){
          this.addshow = false
          this.exportshow = true
          this.caozuoshow = false
        }else if(res.res.realname == '其他用户'){
          this.addshow = false
          this.exportshow = false
          this.caozuoshow = false
        }
      })
    },


    // 导出
    exportData(){
      console.log(this.rightvalue);
      let url = 'http://101.132.68.240:6022/PSGIS/'
      if(this.rightvalue == 'BaseAnchorage' || this.rightvalue == '锚地基本信息'){
        // 锚地
        window.location.href = url + 'BaseAnchorage/export'
      }else if(this.rightvalue == 'BaseBerth'){
        // 码头
        window.location.href = url + 'BaseBerth/export'
      }else if(this.rightvalue == 'BaseBridge'){
        // 桥梁
        window.location.href = url + 'BaseBridge/export'
      }else if(this.rightvalue == 'BaseCabinwashing'){
        // 洗舱站
        window.location.href = url + 'BaseCabinwashing/export'
      }else if(this.rightvalue == 'BaseChannel'){
        // 航道
        window.location.href = url + 'BaseChannel/export'
      }else if(this.rightvalue == 'BasePortplanning'){
        // 基本设施-港口规划-作业区
        window.location.href = url + 'BasePortplanning/export'
      }else if(this.rightvalue == 'BaseShiplock'){
        // 船闸
        window.location.href = url + 'BaseShiplock/export'
      }else if(this.rightvalue == 'tBaseShoreline'){
        // 基本设施-港口规划-岸线
        window.location.href = url + 'tBaseShoreline/export'
      }else if(this.rightvalue == 'BaseWaterservice'){
        // 水上服务区
        window.location.href = url + 'BaseWaterservice/export'
      }else if(this.rightvalue == 'BaseWorkarea'){
        // 作业区基本信息
        window.location.href = url + 'BaseWorkarea/export'
      }else if(this.rightvalue == 'StatisticalBerth' || this.rightvalue == "统计查询-港口泊位"){
        window.location.href = url + 'StatisticalBerth/export'
      }else if(this.rightvalue == 'StatisticalCargothroughput'){
        window.location.href = url + 'StatisticalCargothroughput/export'
      }else if(this.rightvalue == 'StatisticalChannel'){
        window.location.href = url + 'StatisticalChannel/export'
      }else if(this.rightvalue == 'tStatisticalChannelFreight'){
        window.location.href = url + 'tStatisticalChannelFreight/export'
      }else if(this.rightvalue == 'tStatisticalChannelGoodstotal'){
        window.location.href = url + 'tStatisticalChannelGoodstotal/export'
      }else if(this.rightvalue == 'tStatisticalContainer'){
        //  window.location.href = url + 'tStatisticalContainer/export?geographic=inland_river'
        window.location.href = url + 'tStatisticalContainer/export?geographic' + '=' + this.tStatisticalContainerValue
      }else if(this.rightvalue == 'StatisticalThroughput'){
        window.location.href = url + 'StatisticalThroughput/export'
      }
    },
    // 新增按钮
    dialogVisibles(){
      this.dialogVisible = true
      this.dialogTitle = '新增数据'
      this.addedit = true
      this.isaddUpdate = true
      console.log(this.rightvalue);
    },
    // 编辑按钮
    editBtn(row){
      this.rowdata = row
      this.dialogVisible = true
      this.detailFrom = row
      this.isaddUpdate = false
      if(this.addedit){
        this.dialogTitle = '编辑数据'
        // this.addedit = false
      }
      console.log(this.rightvalue);
    },
    // 上传按钮
    // uploadingBtn(row){
    //   console.log(row);
    //   this.uploadId = row.objectid
    //   if(this.rightvalue == 'BaseAnchorage' || "锚地基本信息"){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseAnchorage/attached'
    //   }else if(this.rightvalue == 'BaseBerth'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseBerth/attached'
    //   }else if(this.rightvalue == 'BaseBridge'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseBridge/attached'
    //   }else if(this.rightvalue == 'BaseCabinwashing'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseCabinwashing/attached'
    //   }else if(this.rightvalue == 'BaseChannel'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseChannel/attached'
    //   }else if(this.rightvalue == 'BasePortplanning'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BasePortplanning/attached'
    //   }else if(this.rightvalue == 'BaseShiplock'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseShiplock/attached'
    //   }else if(this.rightvalue == 'tBaseShoreline'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/tBaseShoreline/attached'
    //   }else if(this.rightvalue == 'BaseWaterservice'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseWaterservice/attached'
    //   }else if(this.rightvalue == 'BaseWorkarea'){
    //     this.uploadUrl = 'http://192.168.2.63:8082/PSGIS/BaseWorkarea/attached'
    //   }
    // },
    // 上传的回调
    uploadchange(file){
      console.log(file.code);
      if(file.code == 200){
        this.$message.success('上传成功!')
      }else{
        this.$message.error('上传失败!')
      }
    },

    // 删除
    deleteBtn(row){
      console.log(this.rightvalue);
      if(this.rightvalue == 'BaseAnchorage' || this.rightvalue == '锚地基本信息'){
        // 锚地
        this.BaseAnChorageetDelete(row)
      }else if(this.rightvalue == 'BaseBerth'){
        // 码头
        this.BaseBerthDelete(row)
      }else if(this.rightvalue == 'BaseBridge'){
        // 桥梁
        this.BaseBridgeDelete(row)
      }else if(this.rightvalue == 'BaseCabinwashing'){
        // 洗舱站
        this.BaseCabinwashingDelete(row)
      }else if(this.rightvalue == 'BaseChannel'){
        // 航道
        this.BaseChannelDelete(row)
      }else if(this.rightvalue == 'BasePortplanning'){
        // 基本设施-港口规划-作业区
        this.BasePortplanningDelete(row)
      }else if(this.rightvalue == 'BaseShiplock'){
        // 船闸
        this.BaseShiplockDelete(row)
      }else if(this.rightvalue == 'tBaseShoreline'){
        // 基本设施-港口规划-岸线
        this.tBaseShorelineDelete(row)
      }else if(this.rightvalue == 'BaseWaterservice'){
        // 水上服务区
        this.BaseWaterserviceDelete(row)
      }else if(this.rightvalue == 'BaseWorkarea'){
        // 作业区基本信息
        this.BaseWorkareaDelete(row)
      }
    },

    // 删除
    // 锚地删除
    async BaseAnChorageetDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseAnChorageetDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseAnchorage()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 码头删除
    async BaseBerthDelete(row) {
      console.log(row);
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseBerthDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseBerth()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 桥梁删除
    async BaseBridgeDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseBridgeDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseBridge()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 洗舱站删除
    async BaseCabinwashingDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseCabinwashingDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseCabinwashing()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 航道删除
    async BaseChannelDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseChannelDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseChannel()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 基本设施-港口规划-作业区删除
    async BasePortplanningDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BasePortplanningDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBasePortplanning()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 船闸删除
    async BaseShiplockDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseShiplockDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseShiplock()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 基本设施-港口规划-岸线删除
    async tBaseShorelineDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.tBaseShorelineDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.gettBaseShoreline()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 水上服务区删除
    async BaseWaterserviceDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseWaterserviceDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseWaterservice()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 作业区删除
    async BaseWorkareaDelete(row) {
      this.$confirm('此操作将删除该条数据，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          dataManagement.BaseWorkareaDelete({objectid:row.objectid}).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: res.msg,
              })
              this.getBaseWorkarea()
            } else this.$message.error(res.msg)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },





    // 锚地基本信息
    async getBaseAnchorage() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseAnchorage(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
    

      // console.log(res,status)
      // console.log(res.data.results)
      // data = res.data.results
    },
    // chaxun 
    async getStatisticalBerth() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getStatisticalBerth(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
     

      // console.log(res,status)
      // console.log(res.data.results)
      // data = res.data.results
    },
    // 码头泊位基本信息
    async getBaseBerth() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseBerth(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = BaseBerth
    },
    // 桥梁基本信息
    async getBaseBridge() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseBridge(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 洗舱站基本信息
    async getBaseCabinwashing() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseCabinwashing(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 航道基本信息
    async getBaseChannel() {
      let datas = {
        pageIndex: this.pageno,
        pageSize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { code, data } = await dataManagement.getBaseChannel(datas)
      if (code == 200) {
        this.total = data.totalcount
        this.tableData = data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 基本设施-港口规划-作业区
    async getBasePortplanning() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBasePortplanning(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 船闸基本信息
    async getBaseShiplock() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseShiplock(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 基础设施-港口规划-岸线
    async gettBaseShoreline() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.gettBaseShoreline(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
        console.log(this.tableData)
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 水上服务区基本信息
    async getBaseWaterservice() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseWaterservice(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
        console.log(this.tableData)
      } else {
        this.total = 0
        this.tableData = []
      }
     
    },
    // 作业区基本信息
    async getBaseWorkarea() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getBaseWorkarea(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
     
    },
    // 统计查询-港口泊位
    async getStatisticalBerth() {
      let datas = {
        pageIndex: this.pageno,
        pageSize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { code, data } = await dataManagement.getStatisticalBerth(datas)
      if (code == 200) {
        this.total = data.totalcount
        this.tableData = data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      
    },
    // 统计查询-港口吞吐-货类吞吐
    async getStatisticalCargothroughput() {
      let datas = {
        pageIndex: this.pageno,
        pageSize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { code, data } = await dataManagement.getStatisticalCargothroughput(
        datas
      )
      if (code == 200) {
        this.total = data.totalcount
        this.tableData = data.results
      } else {
        this.total = 0
        this.tableData = []
      }
     
    },
    // 统计查询-内河航道 内河航道船闸基础状况表
    async getStatisticalChannel() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getStatisticalChannel(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = StatisticalChannel
    },
    // 统计查询-航道货运-船闸/航道年度货运量与船舶通过量
    async gettStatisticalChannelFreight() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.gettStatisticalChannelFreight(
        data
      )
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = tStatisticalChannelFreight
    },
    // 统计查询-航道货运-货物结构
    async gettStatisticalChannelGoodstotal() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } =
        await dataManagement.gettStatisticalChannelGoodstotal(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = tStatisticalChannelGoodstotal
    },
    // 统计查询-港口吞吐-年度集装箱吞吐量
    async gettStatisticalContainer() {
      if(this.tStatisticalContainerValue == '沿海'){
        this.tStatisticalContainerValue = 'coastal'
      }
      let datas = {
        pageIndex: this.pageno,
        pageSize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : '',
        geographic:this.tStatisticalContainerValue,
      }
      let { code, data } = await dataManagement.gettStatisticalContainer(datas)
      if (code == 200) {
        this.total = data.totalcount
        this.tableData = data.collection
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = tStatisticalContainer
    },
    // 统计查询-港口吞吐
    async getStatisticalThroughput() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      let { res, status } = await dataManagement.getStatisticalThroughput(data)
      if (status == 200) {
        this.total = res.data.totalcount
        this.tableData = res.data.results
      } else {
        this.total = 0
        this.tableData = []
      }
      this.tableHeaders = StatisticalThroughput
    },

    // 修改table tr行颜色
    tableRowStyle({ row, rowIndex }) {
      return { 'background-color': '#fff' }
    },
    // 修改table header颜色
    tableHeaderStyle({ row, rowIndex }) {
      return { 'background-color': '#bfcfdc', color: '#333333' }
    },
    // 分页
    handleCurrentChange(count) {
      this.pageno = count
      console.log(this.rightvalue)
     
      if(this.rightvalue == 'BaseAnchorage' || "锚地基本信息"){
        this.getBaseAnchorage()
      }else if(this.rightvalue == 'BaseBerth'){
        this.getBaseBerth()
      }else if(this.rightvalue == 'BaseBridge'){
        this.getBaseBridge()
      }else if(this.rightvalue == 'BaseCabinwashing'){
        this.getBaseCabinwashing()
      }else if(this.rightvalue == 'BaseChannel'){
        this.getBaseChannel()
      }else if(this.rightvalue == 'BasePortplanning'){
        this.getBasePortplanning()
      }else if(this.rightvalue == 'BaseShiplock'){
        this.getBaseShiplock()
      }else if(this.rightvalue == 'tBaseShoreline'){
        this.gettBaseShoreline()
      }else if(this.rightvalue == 'BaseWaterservice'){
        this.getBaseWaterservice()
      }else if(this.rightvalue == 'BaseWorkarea'){
        this.getBaseWorkarea()
      }else if(this.rightvalue == 'StatisticalBerth' || "统计查询-港口泊位"){
        this.getStatisticalBerth()
      }else if(this.rightvalue == 'StatisticalCargothroughput'){
        this.getStatisticalCargothroughput()
      }else if(this.rightvalue == 'StatisticalChannel'){
        this.getStatisticalChannel()
      }else if(this.rightvalue == 'tStatisticalChannelFreight'){
        this.gettStatisticalChannelFreight()
      }else if(this.rightvalue == 'tStatisticalChannelGoodstotal'){
        this.gettStatisticalChannelGoodstotal()
      }else if(this.rightvalue == 'tStatisticalContainer'){
        this.gettStatisticalContainer()
      }else if(this.rightvalue == 'StatisticalThroughput'){
        this.getStatisticalThroughput()
      }
    },
    // 联动选择
    selectOne(row) {
      this.rightOptions = []
      this.caozuoshow = true
      this.addshow = true
      this.exportshow = true
      this.jurisdiction()
      // console.log(row)
      this.pageno = 1
      this.pagesize = 10
      if (row == 1) {
        this.tableHeaders=BaseAnchorage
        this.rightOptions = infrastructure
        this.getBaseAnchorage()
      } else if (row == 2) {
        this.tableHeaders=StatisticalBerth
        this.rightOptions = statisticalQuery
        this.getStatisticalBerth()
        this.caozuoshow = false
        this.addshow = false
        this.exportshow = true
      } else if (row == 3) {
         this.tableHeaders=''
        this.rightOptions = situationMonitoring
      }
      this.rightvalue = this.rightOptions[0].label
      this.testValue = row
      
    },

    selectTwo(row) {
      this.pageno = 1
      this.pagesize = 10
      // alert(row)
      if (row == 'BaseAnchorage') {
        this.tableHeaders = BaseAnchorage
        this.getBaseAnchorage()
      } else if (row == 'BaseBerth') {
         this.tableHeaders = BaseBerth
        this.getBaseBerth()
      } else if (row == 'BaseBridge') {
        this.tableHeaders = BaseBridge
        this.getBaseBridge()
      } else if (row == 'BaseCabinwashing') {
        this.tableHeaders = BaseCabinwashing
        this.getBaseCabinwashing()
      } else if (row == 'BaseChannel') {
        this.tableHeaders = BaseChannel
        this.getBaseChannel()
      } else if (row == 'BasePortplanning') {
        this.tableHeaders = BasePortplanning
        this.getBasePortplanning()
      } else if (row == 'BaseShiplock') {
        this.tableHeaders = BaseShiplock
        this.getBaseShiplock()
      } else if (row == 'tBaseShoreline') {
        this.tableHeaders = tBaseShoreline
        this.gettBaseShoreline()
      } else if (row == 'BaseWaterservice') {
         this.tableHeaders = BaseWaterservice
        this.getBaseWaterservice()
      } else if (row == 'BaseWorkarea') {
         this.tableHeaders = BaseWorkarea
        this.getBaseWorkarea()
      } else if (row == 'StatisticalBerth') {
        this.tableHeaders = StatisticalBerth
        this.getStatisticalBerth()
      } else if (row == 'StatisticalCargothroughput') {
         this.tableHeaders = StatisticalCargothroughput
        this.getStatisticalCargothroughput()
      } else if (row == 'StatisticalChannel') {
         this.tableHeaders = StatisticalChannel
        this.getStatisticalChannel()
      } else if (row == 'tStatisticalChannelFreight') {
        this.tableHeaders = tStatisticalChannelFreight
        this.gettStatisticalChannelFreight()
      } else if (row == 'tStatisticalChannelGoodstotal') {
        this.tableHeaders = tStatisticalChannelGoodstotal
        this.gettStatisticalChannelGoodstotal()
      } else if (row == 'tStatisticalContainer') {
        this.tableHeaders = tStatisticalContainer
        this.gettStatisticalContainer()
      } else if (row == 'StatisticalThroughput') {
        this.tableHeaders = StatisticalThroughput
        this.getStatisticalThroughput()
      }

      // this.getBaseBerth()
    },
    // 统计查询-港口吞吐-年度集装箱吞吐量类型
    selectThree(row){
      this.tStatisticalContainerValue = row
      this.gettStatisticalContainer()
    }
  },

 

  // statisticalQuery
  // situationMonitoring
  // 获取js数据
  // computed: {
  //   tableHeaders: function () {
  //     if(this.testValue == 1){
  //       return BaseAnchorage
  //     }else if(this.testValue == 2){
  //       return StatisticalBerth
  //     }else{
  //        return BaseAnchorage
  //     }

  //   },
  // rightOptions: function () {
  //   return infrastructure
  // }
}

// }
</script>
<style lang="scss" scoped>
.view {
  width: 100%;
  height: 100%;
  padding: 10px 15px;
}
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px 15px;
}
.operation-box {
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: column;

  > div:first-child {
    flex: 1;
    font-size: 16px;
    color: #2a95e8;
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
      position: relative;
      left: 0;
      top: 0;
      font-size: 18px;
      font-weight: 500;
      color: #2a8df0;
      &::before {
        content: '';
        width: 3px;
        height: 15px;
        margin-top: -7.5px;
        position: absolute;
        left: 0;
        top: 50%;
        background-color: #2a8df0;
      }
    }
  }
  > div:last-child {
    font-size: 16px;
    color: #2a95e8;
    display: flex;
    justify-content: space-between;
    .el-select {
      margin-left: 10px;
    }
  }
}
.table-box {
  // flex: 1;
  width: 100%;
  height: 85%;
  //   border: 1px solid black;
  margin: 10px 0;
}
.pagination-container {
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.upload-demo{
  padding:0;
  height: 0;
  width: 15px;
}
</style>