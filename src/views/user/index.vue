<template>
  <div>
    <div class="toolbar">
      <div class="title"><span>用户信息管理</span></div>
      <div class="toolbar-list">
        <div class="role-block">
          <span>用户角色：</span>
          <el-select v-model="roleValue" placeholder="角色">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in roleOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- <div class="city-block">
          <span>所在城市：</span>
          <el-select v-model="cityValue" placeholder="城市">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in cityOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </div> -->
        <div class="query-block">
          <span>搜索内容：</span
          ><el-input
            size="small"
            v-model="query"
            placeholder="请输入姓名、用户名等搜索内容"
          ></el-input>
        </div>
        <el-button
          type="primary"
          plain
          size="small"
          icon="el-icon-search"
          class="queryBtn"
          @click="queryFn"
          >查询</el-button
        >
        <el-button
          type="primary"
          plain
          size="small"
          class="queryBtn"
          @click="saveClick"
          >浏览记录</el-button
        >
        <div class="btn-block" v-if="false">
          <el-button type="warning" plain size="small" @click="addUser"
            ><i class="iconfont icon-shangchuan"></i>新增用户</el-button
          >
        </div>
      </div>
    </div>
    <div class="content">
      <div class="grid-content">
        <div class="table-container">
          <el-table
            :data="tableData"
            stripe
            :header-cell-style="tableHeaderStyle"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column prop="name" label="账号名" align="center">
            </el-table-column>
            <el-table-column prop="company" label="用户单位" align="center">
            </el-table-column>
            <el-table-column
              prop="roleid"
              label="用户类别"
              align="center"
              :formatter="roleFormatter"
            >
            </el-table-column>
            <el-table-column prop="realname" label="负责人" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center">
            </el-table-column>
            <!-- <el-table-column prop="city" label="城市" align="center">
            </el-table-column> -->
            <el-table-column
              label="操作"
              fixed="right"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  class="seeBtn"
                  @click="seeUser(scope.row)"
                  >详情</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  class="editBtn"
                  @click="editUser(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  class="deleteBtn"
                  @click="deleteUser(scope.row)"
                  v-if="false"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container">
          <el-pagination
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
    </div>
    <add-user-dialog
      :visible.sync="dialogVisible"
      :editForm.sync="detailFrom"
      :title="dialogTitle"
      @submitResult="getUserList"
    />
    <user-info-dialog
      :info.sync="userDialogInfo"
      :imgUrl.sync="imgUrl"
      :visible.sync="infoDialogVisible"
    />
    <el-dialog
      class="savetable"
      title="浏览记录"
      :visible.sync="saveUpload"
      width="30%"
      :before-close="handleClose">
      <span>
        <el-table
          :data="savetableData"
          border
          style="width: 100%">
          <el-table-column
            prop="browsingUser"
            label="浏览人"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="pageName"
            label="浏览页面"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="browsingTime"
            align="center"
            :formatter="dateFormat"
            label="浏览时间">
          </el-table-column>
        </el-table>
      </span>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="saveUpload = false">取 消</el-button>
        <el-button type="primary" @click="saveUpload = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddUserDialog from './components/AddUserDialog'
import UserInfoDialog from './components/UserInfoDialog'
import { common, userManage } from '@/api'
import { city, role, userField, userInfoOrder } from '@/assets/js/localData.js'
export default {
  name: 'user',
  components: {
    AddUserDialog,
    UserInfoDialog
  },
  created() {
    this.getUserList()
  },  
  data() {
    return {
      savetableData: [],
      saveUpload:false,//浏览记录弹窗
      imgUrl: '', // 用户详情头像
      userDialogInfo: [], // 用以查看详情
      infoDialogVisible: false,
      dialogTitle: '新增用户',
      dialogUserInfo: {},
      dialogVisible: false,
      filterTableParam: {},
      detailFrom: {},
      query: '',
      pageno: 1,
      pagesize: 10,
      total: 0,
      avatarImg: require('@/assets/img/faren_xuanzhong.png'),
      roleValue: 0,
      cityValue: '全部',
      tableData: []
    }
  },
  computed: {
    ...mapState(['userInfo']),
    cityOptions() {
      return [...[{ label: '全部', value: '全部' }], ...city]
    },
    roleOptions() {
      return [...[{ label: '全部', value: 0 }], ...role]
    }
  },
  methods: {
    // 表格时间转换
    dateFormat(row) {
      let date = row.browsingTime
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    handleClose(done) {
      this.saveUpload = false
    },
    // 获取浏览记录
    saveClick(){
      this.saveUpload = true
      this.getSave()
    },
    async getSave() {
      let { code, data } = await userManage.getSave()
      if(code == 200){
        this.savetableData = data
      }
    },
    // 修改table header颜色
    tableHeaderStyle({ row, rowIndex }) {
      return { 'background-color': '#1b85d7', color: '#fff' }
    },
    //获取列表
    async getUserList() {
      let data = {
        pageno: this.pageno,
        pagesize: this.pagesize,
        query: this.query,
        city: this.cityValue !== '全部' ? this.cityValue : '',
        roleid: this.roleValue ? this.roleValue : ''
      }
      const result = await userManage.getUserList(data)
      if (result.status === 200) {
        this.total = result.res.userinfos.totalcount
        this.tableData = result.res.userinfos.results
      } else {
        this.total = 0
        this.tableData = []
      }
    },
    // 查询
    queryFn() {
      this.getUserList()
    },
    // 新增
    addUser() {
      this.dialogVisible = true
      this.dialogTitle = '新增用户'
    },
    // 详情
    seeUser(row) {
      const exclude = ['id', 'roleid', 'icard', 'imgurl', 'liable']
      let handleArr = []
      for (let i in row) {
        if (!exclude.includes(i)) {
          handleArr.push({
            label: userField[i],
            value: row[i]
          })
        } else {
          if (i === exclude[exclude.length - 1]) {
            this.imgDownload(row[i])
          }
        }
      }
      handleArr.sort((a, b) => {
        return userInfoOrder.indexOf(a.label) - userInfoOrder.indexOf(b.label)
      })
      this.userDialogInfo = handleArr
      this.infoDialogVisible = true
    },
    // 下载
    imgDownload(docurl) {
      common
        .downloadSingleFiles(
          {
            docurl
          },
          {
            responseType: 'blob'
          }
        )
        .then(res => {
          let blob = new Blob([res.data])
          this.imgUrl = window.URL.createObjectURL(blob)
        })
    },
    // 编辑
    editUser(row) {
      console.log(this.detailFrom);
      this.detailFrom = row
      this.dialogVisible = true
      this.dialogTitle = '编辑用户'
    },
    // 删除
    deleteUser(row) {
      this.$confirm('此操作将删除该用户，是否继续？', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          userManage.deleteUser({ userid: row.id }).then(res => {
            if (res.status === 200) {
              this.getUserList()
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.detailFrom = {}
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
    //分页事件
    handleCurrentChange(count) {
      this.pageno = count
      this.getUserList()
    },
    //身份状态
    roleFormatter(row) {
      const role = this.roleOptions.filter(i => {
        return Number(i.value) === Number(row.roleid)
      })
      return role[0].label
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 10px 20px 0 20px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 0.04);
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
  .toolbar-list {
    overflow: hidden;
    > div {
      float: left;
      height: 35px !important;
      margin-right: 20px;
      margin-bottom: 20px;
      span {
        flex: none;
      }
    }
    .queryBtn {
      margin-bottom: 20px;
    }
    .query-block {
      display: flex;
      align-items: center;
    }
    .btn-block {
      float: right;
      i {
        font-size: 12px;
        margin-right: 5px;
      }
    }
  }
}
.grid-content {
  padding: 25px 40px 20px 40px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 1px 1px 4px 4px rgba(0, 0, 0, 0.04);
}
.pagination-container {
  height: 75px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.seeBtn {
}
.editBtn {
  color: #ff9600;
  &:hover {
    color: rgba(255, 150, 0, 0.7);
  }
}
.deleteBtn {
  color: #ff0000;
  &:hover {
    color: rgba(255, 0, 0, 0.7);
  }
}
.savetable{
  /deep/.el-dialog__body{
    padding:20px 10px;
    height:350px;
    overflow: auto;
  }
}
</style>
