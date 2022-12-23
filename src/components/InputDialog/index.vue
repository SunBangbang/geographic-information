<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogInputVisible"
    :before-close="closeInputDialog"
    class=""
  >
    <div>
      <p class="s-t">事故信息</p>
      <el-form :model="form" class="form-body" ref="ruleForm" :rules="rules">
        <el-form-item
          label="事故名称"
          :label-width="formLabelWidth"
          class="row_1"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请填写事故名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="事故等级"
          :label-width="formLabelWidth"
          class="row_1"
          prop="grade"
        >
          <el-select v-model="form.grade" placeholder="请选择事故等级">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in levelOptions"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="设备大类"
          :label-width="formLabelWidth"
          class="row_1"
          prop="pcategory"
        >
          <el-select
            v-model="form.pcategory"
            placeholder="请选择设备大类"
            @change="chooseEquipment"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              :option="item.name"
              v-for="item in EquipmentOptions"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="flag == false"
          label="设备类别细目"
          :label-width="formLabelWidth"
          class="row_1"
          prop="majorName"
        >
          <el-select
            v-model="form.majorName"
            placeholder="请选择设备类别细目"
            @change="chooseEquipmentTypeBd"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in EquipmentTypeBd"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-else
          label="设备类别细目"
          :label-width="formLabelWidth"
          class="row_1"
          prop="major"
        >
          <el-select
            v-model="form.major"
            placeholder="请选择设备类别细目"
            @change="chooseEquipmentTypeBd"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in EquipmentTypeBd"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="flag == false"
          label="事故原因"
          :label-width="formLabelWidth"
          class="row_1"
          prop="reasonPaths"
        >
          <el-cascader
            v-model="form.reasonPaths"
            :options="resonOptions"
            :props="resonProps"
            :key="refreshItem"
            collapse-tags
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-else
          label="事故原因"
          :label-width="formLabelWidth"
          class="row_1"
          prop="reason"
        >
          <el-cascader
            v-model="form.reason"
            :options="resonOptions"
            :props="resonProps"
            :key="refreshItem"
            collapse-tags
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="设备名称"
          :label-width="formLabelWidth"
          class="row_1"
          prop="facname"
        >
          <el-input v-model="form.facname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="设备型号"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.facmodel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="设计单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.design" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="制造单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.produce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="安装单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.install" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="检验单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.inspection" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="检验日期"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-date-picker
            v-model="form.inspectiontime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="检验有效期"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input
            v-model="form.inspectionperiod"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="使用年限"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.life" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="改造单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.transform" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="改造项目"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input
            v-model="form.transformproject"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="改造时间"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-date-picker
            v-model="form.transformtime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="主要参数"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.param" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="维保单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.maintenance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故调查牵头单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.leadunit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="调查报告批复单位"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.approvalunit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故直接原因"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.directreason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故间接原因"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.indirectreason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故上报人员"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.adduser" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="出厂日期"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-date-picker
            v-model="form.productiondate"
            :picker-options="pickerOptionsStart"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="投入使用日期"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-date-picker
            v-model="form.usedate"
            :picker-options="pickerOptionsStart"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="事故地区"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故单位"
          :label-width="formLabelWidth"
          class="row_1"
          prop="company"
        >
          <el-input v-model="form.company" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故时间"
          :label-width="formLabelWidth"
          class="row_1"
          prop="accidenttime"
        >
          <el-date-picker
            v-model="form.accidenttime"
            :picker-options="pickerOptionsStart"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" class="row_1">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上报经济损失"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.lossreport" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="增补改后经济损失"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.lossreform" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="经济损失总数"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.losstotal" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="发生环节"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="涉事行业"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.industry" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="注册编号"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.registration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="使用证编号"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.license" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="事故类别"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input
            v-model="form.accidentcategory"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="事故现象"
          :label-width="formLabelWidth"
          class="row_1"
        >
          <el-input v-model="form.apperance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="死亡(人)"
          :label-width="formLabelWidth"
          class="row_1"
          prop="death"
        >
          <el-input v-model="form.death" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="受伤(人)"
          :label-width="formLabelWidth"
          class="row_1"
          prop="injured"
        >
          <el-input v-model="form.injured" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <div class="row_2 left-row"> -->

        <el-form-item
          label="事故描述"
          :label-width="formLabelWidth"
          class="row_4"
          prop="describe"
        >
          <el-input type="textarea" v-model="form.describe"></el-input>
        </el-form-item>
        <el-form-item
          label="事故救援简述"
          :label-width="formLabelWidth"
          class="row_4"
          prop="rescuedescribe"
        >
          <el-input type="textarea" v-model="form.rescuedescribe"></el-input>
        </el-form-item>
        <!-- </div> -->
        <div class="row_2 right-row">
          <p class="upload-title">
            <span>图片信息</span>
          </p>
          <el-upload
            class="upload-demo"
            action="s"
            :http-request="uploadImg"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemoveImg"
            :on-change="handleChangeImg"
            :file-list="imagesList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
        <div class="row_2 right-row">
          <p class="upload-title">
            <span>文件信息</span>
          </p>
          <el-upload
            class="upload"
            action="string"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadFile"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemoveFile"
            multiple="multiple"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeInputDialog">取 消</el-button>
      <el-button type="primary" @click="confirmInputDialog('ruleForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { accidentInput } from '../../api/'
import upload from '../../utils/upload'
import { reg, baseRegConst } from '../../utils/regular'
export default {
  name: 'input-dialog',
  props: {
    // 控制显隐
    dialogInputVisible: {
      type: Boolean,
      default: false
    },
    // 回显数据
    dialogInputObj: {
      type: Object,
      default: null
    },
    // 修改再次录用
    dialogCheckObj: {
      type: Object,
      default: null
    },
    EOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    ETypeBd: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    EquipmentTypeBd: {
      handler(newValue, oldValue) {
        if (this.flag == true) {
          this.form.major = ''
        }
      },
      deep: true
    },
    EquipmentOptions: {
      handler(newValue, oldValue) {},
      deep: true
    }
    // 'majorId':{
    //   handler(newValue,oldValue){
    //     console.log(newValue);
    //     console.log(oldValue);

    //   }
    // }
  },
  created() {
    this.getEquipmentType()
    console.log(this.dialogInputObj)
    if (this.dialogInputObj && this.dialogInputObj.id) {
      this.title = '编辑'
      this.flag = false
      this.test()
      accidentInput
        .lookAccidentDetail({ id: this.dialogInputObj.id })
        .then((res) => {
          //图片文件回显
          if (res.res.imgs != null) {
            res.res.imgs.map((item) => {
              item.url = upload.uploadUrl + item.url
            })
            console.log(res.res.imgs)
            this.imagesList = res.res.imgs
            console.log(this.imageList)
          }
          if (res.res.files != null) {
            res.res.files.map((item) => {
              item.url = upload.uploadUrl + item.url
            })
            this.fileList = res.res.files
          }
          console.log(res.res)
          this.form = res.res
          this.majorId = this.form.major
          console.log(this.form.pcategory)
        })
      // this.EquipmentTypeBd.forEach((el) => {
      //   if (el.id == this.dialogInputObj.major) {
      //     this.form.major = el.id
      //     // console.log(this.form.major)
      //   }
      // })
    } else {
      this.title = '新增'
      this.flag = true
      this.form = {
        name: '', // 事故名称
        grade: '', // 事故等级
        pcategory: '', // 设备大类
        major: '', //设备类别细目
        reason: '', // 事故原因
        facname: '', // 设备名称
        facmodel: '', // 设备型号
        design: '', // 设计单位
        produce: '', // 制造单位
        install: '', // 安装单位
        maintenance: '', // 维保单位
        productiondate: '', // 出厂日期
        usedate: '', // 投入使用日期
        area: '', // 事故地区
        company: '', // 事故单位
        accidenttime: '', //事故时间
        address: '', //地址
        death: '', // 死亡
        injured: '', // 受伤
        describe: '', // 事故描述
        shid: '', //审核id
        status: '', //审核类型
        city: '', //事故发生地（市）
        region: '', //事故发生地(区)
        pcategory: '', //设备大类
        apperance: '', //事故现象
        accidentcategory: '', //事故类别
        dateOfoccurrence: '', // 发生时间
        lossreport: '', //上报经济损失
        lossreform: '', //增补改后经济损失
        losstotal: '', //经济损失总数
        link: '', //发生环节
        industry: '', //涉事行业
        registration: '', //注册编号
        license: '', //使用证编号
        inspection: '', //检验单位
        inspectiontime: '', //检验日期
        inspectionperiod: '', //检验有效期
        life: '', //使用年限
        transform: '', //改造单位
        transformproject: '', //改造项目
        transformtime: '', //改造时间
        param: '', //主要参数
        rescuedescribe: '', //事故救援过程简述
        leadunit: '', //事故调查牵头单位
        approvalunit: '', //调查报告批复单位
        directreason: '', //事故直接原因
        indirectreason: '', //事故间接原因
        adduser: '', //事故上报人员
        image: '' //事故图片
      }
    }
  },
  data() {
    return {
      props: { multiple: true }, //开启多选
      flag: true,
      title: '', //dialog标题
      fileList: [],
      imagesList: [],
      delImage: [], //存放删除图片的数组
      delFile: [], //存放删除文件的数组
      multiple: true,
      formData: '',
      dialogImageUrl: '',
      dialogVisible: false,
      treeChecked: [],
      treeHash: {},
      EquipmentOptions: [], //设备树
      EquipmentTypeBd: [], //设备类别细目
      resonOptions: [], //事故原因
      refreshItem: 0, // 重新渲染级联选择器
      resonProps: {
        value: 'id',
        label: 'name',
        children: 'childrens',
        multiple: true
      },
      innerVisible: false,
      majorId: '',
      pictureType: ['image/jpeg', 'image/jpg', 'image/png'],
      form: {},
      formLabelWidth: '150px',
      levelOptions: [
        {
          value: '1',
          label: '特别重大事故'
        },
        {
          value: '2',
          label: '重大事故'
        },
        {
          value: '3',
          label: '较大事故'
        },
        {
          value: '4',
          label: '一般事故'
        }
      ],
      //限制开始时间
      pickerOptionsStart: {
        disabledDate(time) {
          return (
            time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
          )
        }
      },
      valuetype: '',
      rules: {
        name: [{ required: true, message: '请填写事故名称', trigger: 'blur' }],
        grade: [
          { required: true, message: '请选择事故等级', trigger: 'change' }
        ],
        pcategory: [
          { required: true, message: '请选择设备大类', trigger: 'change' }
        ],
        majorName: [
          { required: true, message: '请选择设备类别细目', trigger: 'change' }
        ],
        major: [
          { required: true, message: '请选择设备类别细目', trigger: 'change' }
        ],
        reasonPaths: [
          { required: true, message: '请选择事故原因', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请选择事故原因', trigger: 'change' }
        ],
        facname: [
          { required: true, message: '请填写设备名称', trigger: 'blur' }
        ],
        accidenttime: [
          { required: true, message: '请选择事故发生时间', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请输入事故单位', trigger: 'blur' }
        ],
        death: [
          { required: false, message: '请输入死亡人数', trigger: 'blur' },
          {
            validator: reg(
              baseRegConst.isPositiveInteger,
              '死亡人数格式不正确'
            ),
            trigger: 'blur'
          }
        ],
        injured: [
          { required: false, message: '请输入受伤人数', trigger: 'blur' },
          {
            validator: reg(
              baseRegConst.isPositiveInteger,
              '受伤人数格式不正确'
            ),
            trigger: 'blur'
          }
        ],
        describe: [
          { required: false, message: '请输入受伤人数', trigger: 'blur' },
          { max: 147, message: '事故描述长度不能超过147', trigger: 'blur' }
        ],
        rescuedescribe: [
          { required: false, message: '请输入受伤人数', trigger: 'blur' },
          { max: 147, message: '事故救援描述长度不能超过147', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //提交表单
    confirmInputDialog(formName) {
      let formData = new FormData()
      if (this.fileList.length != 0) {
        this.fileList.forEach((el) => {
          if (!el.id) {
            formData.append('files', el.raw)
          }
        })
      }
      if (this.imagesList.length != 0) {
        console.log(this.imagesList)
        this.imagesList.forEach((el) => {
          if (!el.id) {
            formData.append('imgs', el.raw)
          }
        })
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.form.major = this.majorId
            console.log(this.form.reason)
            console.log(this.form.reasonPaths);
              var reasonList = []
              this.form.reasonPaths.map((el) => {
                reasonList.push(el[el.length - 1])
              })
              this.form.reason = reasonList.toString()

             console.log(this.form.reason)

            // this.form.reason =
            //   this.form.reasonPaths[this.form.reasonPaths.length - 1] || ''
            delete this.form['reasonPaths']
            delete this.form['imgs']
            delete this.form['files']
            formData.append('ids', this.delFile.toString())
            formData.append('imgids', this.delImage.toString())
            formData.append('gzInfo', JSON.stringify(this.form))
            console.log(formData.get('imgs'))
            console.log(formData.get('files'))
            console.log(this.form)
            //调用编辑接口
            accidentInput
              .loggingAccident(formData)
              .then((res) => {
                if (res.status == 100) {
                  this.$message({
                    type: 'success',
                    offset: 350,
                    message: '编辑成功'
                  })
                  if (this.dialogCheckObj) {
                    let obj = {
                      type: 1,
                      accidentid: this.dialogCheckObj.id,
                      revuser: this.dialogCheckObj.revuser,
                      reason: ''
                    }
                    this.checkChange(obj)
                  } else {
                    this.$emit('inputDetailsHide')
                  }

                  //修改已退回为待审核
                }
              })
              .catch((err) => {
                console.dir(err)
              })
          } else {
            // this.form.major = this.majorId
            console.log(this.form.reason)
            var reasonList = []
            this.form.reason.map((el) => {
              reasonList.push(el[el.length - 1])
            })
            console.log(reasonList)
            this.form.reason = reasonList.toString()
            // this.form.reason = this.form.reason[this.form.reason.length - 1]
            // this.form.reasonPaths[this.form.reasonPaths.length - 1] || ''
            delete this.form['reasonPaths']
            console.log(this.form)
            formData.append('gzInfo', JSON.stringify(this.form))
            //新增
            accidentInput
              .loggingAccident(formData)
              .then((res) => {
                if (res.status == 100) {
                  this.$message({
                    type: 'success',
                    offset: 350,
                    message: '新增成功'
                  })
                  this.$emit('inputDetailsHide')
                }
              })
              .catch((err) => {
                console.dir(err)
              })
          }
        } else {
          return false
        }
      })
    },

    //取消
    closeInputDialog() {
      // this.form = {}
      this.$emit('inputDetailsHide')
    },
    checkChange(obj) {
      accidentInput.checkAccidentInfo(obj).then((res) => {
        if (res.status == 100) {
          this.$emit('checkDetails')
          this.$emit('inputDetailsHide')
        }
      })
    },
    //获取设备类型
    async getEquipmentType() {
      let { res, status } = await accidentInput.getEquipmentTree()
      if (status == 200) {
        console.log('res', res)
        this.EquipmentOptions = res.list
        console.log(this.EquipmentOptions)
      } else {
        this.EquipmentOptions = []
      }
    },
    //设备大类改变
    chooseEquipment(value) {
      console.log(this.form.pcategory)
      this.form.majorName = ''
      console.log(this.form.majorName)
      this.EquipmentOptions.map((e) => {
        if (value == e.id) {
          this.EquipmentTypeBd = e.childrens
          return
        }
      })
    },
    //设备类别细目改变
    chooseEquipmentTypeBd(value) {
      this.form.reasonPaths = []
      console.log(value)
      console.log(this.form.majorName)
      this.majorId = value
      this.getEquipmentType()
      accidentInput.getResonTree({ factypeid: value }).then((res) => {
        if (res.status == 200) {
          let result = res.res.list
          this.resonOptions = result
          this.refreshItem++
          result = this.handlerEmptyData(result)
        } else {
          this.resonOptions = []
        }
      })
    },
    //解决el-Cascader最后一层childrens为空数组bug
    handlerEmptyData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].childrens || data[i].childrens.length == 0) {
          data[i].childrens = undefined
        } else {
          this.handlerEmptyData(data[i].childrens)
        }
      }
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    handleChangeImg(file, imagesList) {
      console.log(file, imagesList)
      this.imagesList = imagesList
    },
    uploadFile(file) {
      console.log(file)
      // this.formData.append('file', file.file)
    },
    uploadImg(file) {
      console.log(file)
      // this.formData.append('file', file.file)
    },
    handleRemoveFile(file, fileList) {
      if (file.id) {
        this.delFile.push(file.id)
      }
      console.log(file, fileList)
    },
    handleRemoveImg(file, imagesList) {
      if (file.id) {
        this.delImage.push(file.id)
      }
      console.log(file, imagesList)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.5
      const pic = this.pictureType.find((item) => {
        return item === file.type
      })
      if (!pic) {
        this.$message({
          type: 'error',
          message: '上传图片只能是JPG/PNG格式',
          offset: 350
        })
        return false
      }
      if (!isLt2M) {
        this.$message({
          type: 'error',
          message: '上传图片大小不能超过500k',
          offset: 350
        })
        return false
      }
      return true
    },
    handlePreview(file) {
      console.log(file)
    },

    // handleRemove(file, fileList) {
    //   //移除图片
    //   console.log(file, fileList)
    // },
    // handlePictureCardPreview(file) {
    //   //预览图片时调用
    //   console.log(file)
    //   this.dialogImageUrl = file.url
    //   this.dialogVisible = true
    // },
    test() {
      let id = this.dialogInputObj['pcategory']
      accidentInput
        .getResonTree({ factypeid: this.dialogInputObj['major'] })
        .then((res) => {
          if (res.status == 200) {
            let result = res.res.list
            this.resonOptions = result
            this.refreshItem++
            result = this.handlerEmptyData(result)
          } else {
            this.resonOptions = []
          }
        })
      this.EOptions.forEach((r) => {
        if (r.id === id) {
          r['childrens'].forEach((rr) => {
            console.log(rr.name, rr.id)
            let obj = {
              id: rr.id,
              name: rr.name
            }
            this.EquipmentTypeBd.push(obj)
          })
        }
      })
    }
    // handleAvatarSuccess(res, file) {
    //   //图片上传成功
    //   console.log(res)
    //   console.log(file)
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // handleExceed(files, fileList) {
    //   //图片上传超过数量限制
    //   this.$message.error('上传图片不能超过6张!')
    //   console.log(file, fileList)
    // },
    // imgUploadError(err, file, fileList) {
    //   //图片上传失败调用
    //   console.log(err)
    //   this.$message.error('上传图片失败!')
    // }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 80%;
}

/deep/ .el-textarea__inner {
  height: 150px;
}
/deep/ .el-date-editor {
  width: 100%;
}
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-cascader {
  width: 100%;
}

/deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
  display: none;
}

.form-body {
  display: flex;
  flex-wrap: wrap;
}

.row_1 {
  width: 25%;
  min-width: 320px;
}

.row_2 {
  width: 50%;
  /*min-width: 640px;*/
}

.row_4 {
  width: 76%;
}
.left-row {
  display: flex;
  flex-wrap: wrap;
  min-width: 640px;
}

.right-row {
  padding-left: 33px;
  min-width: 640px;
}

.upload-title {
  margin-bottom: 10px;
  margin-top: 10px;
  span:first-child {
    color: #2a8df0;
    font-size: 16px;
  }
}

.upload-list-box {
  display: flex;
  margin-top: 20px;
}

.upload-list {
  width: 165px;
  height: 110px;
  margin-right: 25px;
  border: 1px solid #c2cad8;
  border-radius: 2px;
}

.reason-box {
  width: 100%;
  display: flex;
  padding-left: 30px;
  margin-bottom: 20px;
}

.reason-tobeCheck {
  width: 380px;
  height: 415px;
  margin-right: 35px;
  border-radius: 4px;
  border: 1px solid #e7ecf2;
  > p {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    background-color: #eff3f8;
  }
  > div {
    height: 375px;
    overflow-y: auto;
  }
}

.reason-checked {
  width: 320px;
  height: 415px;
  border-radius: 4px;
  border: 1px solid #e7ecf2;
  > p {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    background-color: #eff3f8;
  }
  > div {
    height: 375px;
    padding: 5px 12px;
    overflow-y: auto;
  }
  .reason-list {
    margin-bottom: 10px;
  }
}
</style>
