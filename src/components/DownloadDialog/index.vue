<template>
  <el-dialog
    width="950px"
    :title="title"
    :visible="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="view">
      <div class="tree-container">
        <p class="title">选择下载文件</p>
        <el-select
          v-model="projectValue"
          placeholder="请选择"
          @change="haneleProjectChange"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.proid"
            :label="item.projectname"
            :value="item.proid"
          >
          </el-option>
        </el-select>
        <!-- <el-button type="primary" size="mini" @click="download"
        >确认下载</el-button
      > -->
        <div class="tree-box">
          <el-tree
            :props="treeProps"
            :load="loadNode"
            lazy
            show-checkbox
            @node-click="handleNodeClick"
            @check="handleCheck"
          >
          </el-tree>
        </div>
      </div>
      <div class="form-container">
        <p class="title">填写申请信息</p>
        <el-form
          ref="applyForm"
          :rules="rules"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="申请原因" prop="applyreason">
            <el-input type="textarea" v-model="form.applyreason"></el-input>
          </el-form-item>
          <el-form-item label="数据用途" prop="datapurpose">
            <el-input type="textarea" v-model="form.datapurpose"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        <div class="upload-form-item">
          <span class="upload-label">证明材料</span>
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :on-preview="filePreview"
            :on-remove="fileRemove"
            :on-change="fileChange"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              上传数据用途证明材料
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="button-box">
      <el-button type="warning" plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="download">确认提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { copy } from '@/utils/utils'
import { common, update } from '@/api'
export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '提交下载申请'
    },
    // 控制弹框显隐
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        applyreason: '',
        datapurpose: ''
      },
      rules: {
        applyreason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
        datapurpose: [
          { required: true, message: '请输入数据用途', trigger: 'blur' }
        ]
      },
      projectValue: '',
      treeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      node: '',
      resolve: '',
      treeData: [],
      projectOptions: [], // 项目options
      projectData: [], // 项目options
      checked: [],
      fileList: [], // 申请附件
      monomerOtherFileIds: [], // 单体其他文件id
      monomerTileFileIds: [], // 单体3dtile文件id
      projectFileIds: [] // 项目文件id
    }
  },
  mounted() {
    this.getAllProjects()
  },
  methods: {
    // 弹窗关闭
    handleClose() {
      this.projectValue = []
      this.treeData = []
      this.node.childNodes = []
      this.fileList = []
      this.checked = []
      this.monomerOtherFileIds = []
      this.monomerTileFileIds = []
      this.projectFileIds = []
      this.loadNode(this.node, this.resolve)
      this.resetForm('applyForm')
      this.$emit('update:visible', false)
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 附件删除
    fileRemove(file, fileList) {
      this.fileList = fileList
    },
    // 附件预览
    filePreview() {},
    // 附件切换
    fileChange(file, fileList) {
      this.fileList = fileList
      let index = this.fileList.indexOf(file)
      if (file.size / (1024 * 1024) > 100) {
        // 限制文件大小
        this.$message.error(`当前限制文件大小不能大于100M`)
        this.fileList.splice(index, 1)
        return false
      }
    },
    handleCheck(checkedNodes, checkedKeys) {
      //   console.log(checkedNodes)
      console.log(checkedKeys)
      //   console.log(checkedKeys.checkedNodes)
      this.checked = [...checkedKeys.checkedNodes]
      this.projectFileIds = []
      this.monomerTileFileIds = []
      this.monomerOtherFileIds = []
      this.classification(this.checked)
    },
    handleNodeClick(data, node) {
      console.log(data)
    },
    haneleProjectChange(val) {
      this.projectData.forEach(item => {
        if (item.proid === val) {
          this.treeData = [item]
          this.node.childNodes = []
          this.loadNode(this.node, this.resolve)
        }
      })
    },
    // 确认下载
    download() {
      // 下载项目全部文件
      if (this.checked.length < 1) {
        this.$message.error('请勾选所需下载的文件')
        return
      }
      this.$refs['applyForm'].validate(valid => {
        if (valid) {
          if (this.checked[0].proid && !this.checked[0].downloadType)
            this.submitDownloadApply(this.checked[0].proid)
          else {
            // console.log(this.projectFileIds)
            // console.log(this.monomerTileFileIds)
            // console.log(this.monomerOtherFileIds)
            this.submitDownloadApply()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 下载文件分类
    classification(arr) {
      arr.forEach(i => {
        if (i.children && i.children.length > 0) this.classification(i.children)
        else
          switch (i.downloadType) {
            case 'projectFile':
              if (this.projectFileIds.indexOf(i.docid) < 0)
                this.projectFileIds.push(i.docid)
              break
            case 'monomerTile':
              if (this.monomerTileFileIds.indexOf(i.docid) < 0)
                this.monomerTileFileIds.push(i.docid)
              break
            case 'monomerOther':
              if (this.monomerOtherFileIds.indexOf(i.docid) < 0)
                this.monomerOtherFileIds.push(i.docid)
              break
          }
      })
    },
    // 提交下载申请接口
    async submitDownloadApply(proid) {
      let formData = new FormData()
      let applyinfo = {
        proid: this.projectValue,
        applyreason: this.form.applyreason,
        datapurpose: this.form.datapurpose
      }
      formData.append('applyinfo', JSON.stringify(applyinfo))
      if (proid) formData.append('proid', proid)
      else {
        // 需要下载的项目文件
        if (this.projectFileIds && this.projectFileIds.length > 0)
          formData.append('prodocids', this.projectFileIds.join(','))
        // 需要下载的单体3dtiles文件
        if (this.monomerTileFileIds && this.monomerTileFileIds.length > 0)
          formData.append('buildingids', this.monomerTileFileIds.join(','))
        // 需要下载的单体其他文件
        if (this.monomerOtherFileIds && this.monomerOtherFileIds.length > 0)
          formData.append('buildingdocids', this.monomerOtherFileIds.join(','))
      }
      if (this.fileList && this.fileList.length > 0)
        this.fileList.forEach(i => {
          formData.append('files', i.raw, i.name)
        })
      const result = await update.submitDownloadApply(formData)
      if (result.status === 200) {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.handleClose()
        this.$emit('submitDownloadSuccess')
      } else this.$message.error('提交失败!')
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        return resolve(this.treeData)
      }
      if (node.level === 1) {
        const projectJsonFiles = await this.getProjectJsonFiles(node.data.proid)
        const projectOtherFiles = await this.getProjectOtherFiles(
          node.data.proid
        )
        const monomerInfo = await this.getMonomerInfo(node.data.proid)
        let filesArr = [
          {
            name: 'geoJson文件',
            children: projectJsonFiles
          },
          {
            name: '项目文件',
            children: projectOtherFiles
          }
        ]
        return resolve([...filesArr, ...monomerInfo])
      }
      if (node.level >= 2) {
        if (node.data.children && node.data.children.length > 0) {
          node.data.children.forEach(item => {
            if (!item.children) {
              item.isLeaf = true
            }
          })
          return resolve(node.data.children)
        } else return resolve([])
      }
    },
    // 刷新tree
    refreshTree() {
      this.node = []
      this.loadNode(this.node, this.resolve)
    },
    // 获取全部项目接口
    async getAllProjects() {
      const result = await common.getProjectsInfo({
        pageno: 0,
        pagesize: 0,
        status: 4
      })
      if (result.status === 200) {
        this.projectOptions = copy(result.res.projectinfos.results)
        this.projectData = copy(result.res.projectinfos.results)
        this.projectData.forEach(item => {
          item['name'] = `项目-${item['projectname']}`
        })
      } else {
        this.projectOptions = []
      }
    },
    // 获取项目下全部单体信息
    getMonomerInfo(proid) {
      return new Promise(resolve => {
        common.getMonomerInfo({ proid }).then(res => {
          if (res.status === 200) {
            let resultArr = []
            res.res.buildinginfos.results.forEach(item => {
              let hash = {}
              let handleArr = []
              if (item['buildingdoc'] && item['buildingdoc'].length > 0) {
                item['buildingdoc'].forEach(item1 => {
                  item1['name'] = item1['docname']
                  item1['downloadType'] = 'monomerOther'
                  if (!hash[item1.filetype]) {
                    handleArr.push({ name: item1.filetype, children: [item1] })
                    hash[item1.filetype] = true
                  } else {
                    handleArr.forEach(item2 => {
                      if (item2.name === item1.filetype)
                        item2.children.push(item1)
                    })
                  }
                })
              }
              resultArr.push({
                name: `单体-${item['buildingname']}`,
                children: [
                  {
                    name: '3dtiles文件',
                    children: [
                      {
                        name: item['tilesname'],
                        docid: item['buildingid'],
                        downloadType: 'monomerTile'
                      }
                    ]
                  },
                  {
                    name: '单体文件',
                    children: handleArr
                  }
                ]
              })
            })
            resolve(resultArr)
          } else {
            resolve([])
          }
        })
      })
    },
    // 获取项目geoJson文件
    getProjectJsonFiles(proids) {
      return new Promise(resolve => {
        common.getProjectJsonFiles({ proids }).then(res => {
          if (res.status === 200) {
            res.res.docinfos.results.forEach(item => {
              item['name'] = item['docname']
              item['downloadType'] = 'projectFile'
            })
            resolve(res.res.docinfos.results)
          } else {
            resolve([])
          }
        })
      })
    },
    // 获取项目其他文件
    getProjectOtherFiles(proids) {
      return new Promise(resolve => {
        common.getProjectOtherFiles({ proids }).then(res => {
          if (res.status === 200) {
            let hash = {}
            let resultArr = []
            res.res.docinfos.results.forEach(item => {
              item['name'] = item['docname']
              item['downloadType'] = 'projectFile'
              if (!hash[item.filetype]) hash[item.filetype] = [...[item]]
              else hash[item.filetype] = [...hash[item.filetype], ...[item]]
            })
            for (let i in hash) {
              resultArr.push({
                name: i,
                children: hash[i]
              })
            }
            resolve(resultArr)
          } else {
            resolve([])
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  display: flex;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.tree-container {
  flex: none;
  width: 350px;
}
.tree-box {
  height: 340px;
  padding: 5px;
  border: 4px solid #eee;
  overflow: auto;
}
.form-container {
  flex: 1;
  padding-left: 10px;
}
.upload-form-item {
  display: flex;
  margin-bottom: 22px;
  .upload-label {
    width: 80px;
    padding: 7px 12px 0 0;
    text-align: right;
  }
  .upload-demo {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
.button-box {
  margin-top: 10px;
  text-align: right;
}
/deep/.el-textarea__inner {
  height: 80px;
  resize: none;
}
/deep/.el-select {
  width: 100%;
  margin-bottom: 20px;
}
/deep/.el-tree {
  min-width: 100%;
  display: inline-block;
}
/deep/ .el-list-enter-active,
/deep/ .el-list-leave-active {
  transition: none;
}

/deep/ .el-list-enter,
/deep/ .el-list-leave-active {
  opacity: 0;
}
/deep/ .el-upload-list {
  max-width: 470px;
  overflow-y: auto;
}
</style>
