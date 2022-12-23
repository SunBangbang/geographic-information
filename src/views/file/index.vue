<template>
  <div class="view">
    <div class="card">
      <div class="card-top">
        <div class="title"><span>文档管理</span></div>
        <div class="toolbar">
          <div class="search-box">
            <div class="date-block">
              <span class="demonstration">时间检索：</span>
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="selectTime"
              >
              </el-date-picker>
            </div>
            <div class="project-block">
              <span>文档类型：</span>
              <el-select
                v-model="projectValue"
                placeholder="请选择"
                @change="selectBehavior"
              >
                <el-option
                  v-for="item in projectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="project-block">
              <el-input
                placeholder="输入关键字查询"
                v-model="filterText"
                suffix-icon="el-icon-search"
              >
              </el-input>
            </div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              plain
              @click="serchquery"
              >查询</el-button
            >
          </div>
          <div class="btns">
            <el-button
              type="success"
              icon="el-icon-plus"
              plain
              v-if="addtype"
              @click="fileType"
              >新增类型</el-button
            >
            <el-button type="success" icon="el-icon-plus" plain @click="addFile"
              v-if="addfile"
              >新增文件</el-button
            >
          </div>
        </div>
      </div>

      <div class="tab-content">
        <div class="table-container" v-for="item in fileList" :key="item.name">
          <div>
            <div class="project-name">{{ item.name }}</div>
            <el-table
              :data="item.data"
              :row-style="tableRowStyle"
              :header-cell-style="tableHeaderStyle"
              border
              style="width: 100%"
              @row-click="clickData"
            >
              <el-table-column
                label="序号"
                type="index"
                width="100"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="文件名称"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column label="文件大小" prop="docsize" align="center">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.size | formatbytes }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="文件格式"
                prop="keyword"
                align="center"
              ></el-table-column>
              <el-table-column
                label="上传时间"
                prop="time"
                align="center"
              ></el-table-column>
              <el-table-column label="操作" width="200" align="center" v-if="caozuoshow">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    class="deleteBtn"
                    @click="handleDelRow(scope.row.id)"
                    v-if="deleteshow"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    class="proDownloadBtn"
                    @click="handleDownload(scope.row)"
                    >下载</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    class="previewBtn"
                    @click="handlePreview(scope.row)"
                    >预览</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pagenoPro"
          :page-size="pagesizePro"
          :total="totalPro"
          @current-change="handleProCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <div class="right-box">
      <div class="title"><span>文档信息</span></div>
      <div class="right-conter">
        <div>
          <span>航道等级划分标准</span>
          <div>
            <span>55</span>
            <span>阅读</span>
          </div>
        </div>
        <div>
          <p><span>上传时间：</span><span>2022年1月5日15:45:01</span></p>
          <p><span>上传人：</span><span>李凤杰</span></p>
          <p><span>文档大小：</span><span>0.3M</span></p>
        </div>
        <div>
          <div>文档摘要</div>
          <div></div>
        </div>
        <div>
          <div>关联文档</div>
          <div></div>
        </div>
      </div>
    </div>
    <add-file-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :selectOptions.sync="selectOptions"
      @submitResult="getFileList"
      :editForm.sync="editForm"
    />
    <file-type-dialog
      v-if="fileVisible"
      :visible.sync="fileVisible"
      :editForm.sync="editForm"
      :selectOptions.sync="selectOptions"
      @submitResult="getFileList"
      @sendUpdate="fileType"
    />
    <viewer :imgUrls.sync="viewerUrls" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { common, file } from '@/api'
import AddFileDialog from './components/AddFile.vue'
import FileTypeDialog from './components/FileType.vue'
import Viewer from '@/components/Viewer'
import { update } from '../../api'
import user from '@/api/modules/user'

export default {
  components: { AddFileDialog, Viewer, FileTypeDialog },
  name: 'file',
  data() {
    return {
      editForm: {},
      dateValue: [],
      fileVisible: false,
      dialogVisible: false,
      fileList: [],
      detailFrom: {},
      dialogTitle: '新增文件',
      tableData: [],
      projectValue: '',
      projectOptions: [],
      selectOptions: [],
      filterText: '',
      pagenoPro: 1,
      pagesizePro: 20,
      totalPro: 0,
      selectId: 0,
      viewerUrls: [],
      addtype:true,
      addfile:true,
      caozuoshow:true,
      deleteshow:true,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    handleTableData() {
      this.proTableData.forEach((i) => {
        i['projectotherfiles'] = []
        this.proOtherFiles.forEach((j) => {
          if (i.proid === j.proid) {
            i['projectotherfiles'].push(j)
          }
        })
      })
      return this.proTableData
    }
  },
  mounted() {
    this.getFileType()
    this.getFileList()
    this.getUpdateType()
    this.jurisdiction()
  },
  methods: {
     // 用户权限
    jurisdiction(){
      user.getUserInfo().then(res=>{
        console.log(res.res.realname);
        if(res.res.realname == '内部人员'){
          this.addtype = false
          this.addfile = false
          this.caozuoshow = true
          this.deleteshow = false
        }else if(res.res.realname == '其他用户'){
          this.addtype = false
          this.addfile = false
          this.caozuoshow = false
          this.deleteshow = false
        }
      })
    },

    //
    clickData(row, event, column) {
      // console.log(row, event, column)
      this.getFileinfo(row.id)
    },
    async getFileinfo(id) {
      let data = {
        id:id,
      }
      console.log(data)
      let { res, status } = await file.getFileinfo(data)
      if (status === 200) {
        let all = []
        let data = res.file
        console.log(data);
        // data.forEach((r) => {
        //   let obj = {
        //     id: r.id,
        //     name: r.name
        //   }
        //   this.selectOptions.push(obj)
        // })
        // console.log(this.selectOptions)

        // all.push(data)
        // console.log(all);
        this.selectOptions = data
        this.selectOptions.unshift({
          id: 0,
          name: '全部'
        })
        this.projectValue = this.projectOptions[0].name
      } else {
        this.projectOptions = []
      }
    },
    // 修改table tr行颜色
    tableRowStyle({ row, rowIndex }) {
      return { 'background-color': '#fff' }
    },
    // 修改table header颜色
    tableHeaderStyle({ row, rowIndex }) {
      return { 'background-color': '#bfcfdc', color: '#333333' }
    },
    async getFileList() {
      let data = {
        query: this.filterText,
        pageno: this.pagenoPro,
        pagesize: this.pagesizePro
      }
      if (this.dateValue && this.dateValue.length > 0) {
        data.starttime = new Date(this.dateValue[0] + ' 00:00:00').getTime()
      }
      if (this.dateValue && this.dateValue.length > 1) {
        data.endtime = new Date(this.dateValue[1] + ' 23:59:59').getTime()
      }
      if (this.selectId != 0) {
        data.type = this.selectId
      }
      let { res, status } = await file.getFileList(data)
      if (status === 200) {
        this.fileList = res.data
        this.totalPro = res.total
        console.log(this.fileList)
      } else {
        this.fileList = []
        this.totalPro = 0
      }
    },

    async handleDelRow(id) {
      let { res, status } = await file.deleteFile({
        fileids: id,
        name:"sgh"
      })
      if (status === 200) {
        this.$message.success('删除成功')
        this.getFileList()
      } else {
        this.$message.error('删除失败')
      }
    },

    // 下载文件
    handleDownload(row) {
      window.open(
        'http://101.132.68.240:6022/PSGIS/emergency/down?id=' +
          row.id +
          '&name=' +
          row.name
      )
    },
    handlePreview(row) {
      file
        .getFileinfo(
          { id: row.id },
          {
            responseType: 'blob'
          }
        )
        .then((res) => {
          if (res.status === 200) {
            let blob = new Blob([res.data], { type: 'application/pdf' })
            let href = window.URL.createObjectURL(blob) //创建下载的链接
            let aaa =[]
            let bbb = Object.values(res)
            aaa.push(Object.values(bbb[0]))
            let ccc = aaa[0]
            let ddd = Object.values(ccc[0])
            let eee = ddd[9]
            let url  = eee.split("file")[1]
            console.log(url);
            window.open("http://101.132.68.240:6022/PSGISPDF"+ url)
            // window.open("http://192.168.2.49:8080/内河通航标准GB50139-2014.pdf")
            // window.location.href = "http://192.168.2.89:8080/PSGIS"+ url
            // if (
            //   file.docformat === 'png' ||
            //   file.docformat === 'jpg' ||
            //   file.docformat === 'jpeg'
            // ) {
            //   this.viewerUrls.push(href)
            // } else {
            //   this.previewDialogVisible = true
            //   this.previewObj = {
            //     type: file.docformat,
            //     url: href,
            //     appendToBody: true
            //   }
            // }
          }
        })
    },

    selectTime(e) {
      console.log(e)
    },

    //新增文件
    addFile() {
      this.dialogVisible = true
      this.dialogTitle = '新增文件'
    },
    async getFileType() {
      let { res, status } = await file.getFileType()
      if (status === 200) {
        let data = res.data
        data.forEach((r) => {
          let obj = {
            id: r.id,
            name: r.name
          }
          this.selectOptions.push(obj)
        })
        console.log(this.selectOptions)
        this.projectOptions = data

        this.projectOptions.unshift({
          id: 0,
          name: '全部'
        })
        this.projectValue = this.projectOptions[0].name
      } else {
        this.projectOptions = []
      }
    },
    // 分页切换
    handleProCurrentChange(count) {
      this.pagenoPro = count
      this.getFileList()
    },
    // 下拉框
    selectBehavior(row) {
      this.selectId = row
      // this.getFileList()
    },
    //点击查询
    serchquery() {
      this.getFileList()
    },

    // 新增类型
    fileType(typeBox) {
      console.log(typeBox)
      this.fileVisible = true
      this.dialogTitle = '新增文件'
    },

    async getUpdateType() {
      let { msg, status } = await file.getUpdateType()
      if (status === 404) {
        console.log(msg)
      } else {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.card {
  padding: 10px 20px 10px 20px;
  height: 100%;
  width: 79%;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  .card-top {
    min-height: 15%;
  }
  .title {
    height: 60px;
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
  .toolbar {
    padding: 0 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .search-box {
      width: 80%;
      > div {
        margin-bottom: 5px;
      }

      .date-block,
      .query-block,
      .project-block {
        margin-right: 20px;
        display: flex;
        align-items: center;
        > span {
          flex: none;
          width: 70px;
        }
      }
      .date-block,
      .query-block,
      .project-block,
      .query-btn {
        float: left;
      }
    }
    .btns {
      float: right;
    }
  }

  .tab-content {
    height: 75%;
    min-height: 60%;
    overflow-y: auto;
    .table-container > div {
      // background-color: #f8f8f8;
      // padding: 0 14px 14px 14px;
      margin-bottom: 8px;
    }
    .project-name {
      height: 45px;
      line-height: 45px;
      font-size: 16px;
      font-weight: bold;
      color: #2e74aa;
    }
    .doc-list {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      justify-content: space-between;
      > div {
        width: 28.5%;
        min-width: 290px;
        padding-left: 12px;
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        span {
          width: 62%;
        }
        .btn-box {
          width: 38%;
          // background-color: #fff;
          display: flex;
          justify-content: space-around;
        }
        &::before {
          content: '';
          width: 5px;
          height: 5px;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -2.5px;
          border-radius: 50%;
          background-color: #3c586e;
        }
      }
    }
  }
  .pagination-container {
    height: 75px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.right-box {
  width: 20%;
  height: 100%;
  padding: 10px;
  background-color: #ffffff;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;

  .title {
    height: 60px;
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
  .right-conter {
    flex: 1;
    // border: 1px solid black;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        font-size: 16px;
        color: #1578c3;
        text-decoration: underline;
      }
      > div {
        width: 97px;
        height: 36px;
        background-color: rgba(0, 145, 255, 0.4);
        border-radius: 4px;
        border: solid 1px #0091ff;
        display: flex;
        align-items: center;
        justify-content: space-around;
        span:first-child {
          color: #0974c3;
          font-size: 16px;
        }
        span:last-child {
          color: black;
          font-size: 16px;
        }
      }
    }
    > div:nth-child(2) {
      height: 20%;
      background-color: #f6f8fb;
      border-radius: 4px;
      border: solid 1px #c2cad8;
      padding: 10px;
      overflow-y: auto;
      > p {
        margin: 10px 0;
        span {
          color: #666666;
        }
      }
    }
    > div:nth-child(3) {
      height: 30%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div:first-child {
        width: 100%;
        font-size: 16px;
        color: #333333;
        height: 20%;
        display: flex;
        align-items: center;
      }
      > div:last-child {
        width: 100%;
        height: 80%;
        background-color: #f6f8fb;
        border-radius: 4px;
        border: solid 1px #c2cad8;
        padding: 10px;
        overflow-y: auto;
      }
    }
    > div:nth-child(4) {
      height: 40%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      > div:first-child {
        width: 100%;
        font-size: 16px;
        color: #333333;
        height: 20%;
        display: flex;
        align-items: center;
      }
      > div:last-child {
        width: 100%;
        height: 80%;
        background-color: #f6f8fb;
        border-radius: 4px;
        border: solid 1px #c2cad8;
        padding: 10px;
        overflow-y: auto;
      }
    }
  }
}
</style>
