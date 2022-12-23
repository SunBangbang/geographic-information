<template>
  <div class="login">
    <div class="login-top">
      <div class="logo-name">
        <img src="../../assets/img/logo.png" alt="" />
        <span class="system-name">江苏省港航地理信息云平台</span>
      </div>
    </div>
    <div class="login-body">
      <div>
        <!-- <p class="system_name">基础管理平台</p> -->
        <div class="login-user">
          <p class="hint">|&nbsp;欢迎登录</p>
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
            <div class="user-row">
              <div class="icon">用户名</div>
              <el-form-item prop="account">
                <el-input
                  placeholder="请输入账号"
                  v-model="loginForm.account"
                  ref="account"
                  @keydown.enter.native="nextStep"
                ></el-input>
              </el-form-item>
            </div>
            <div class="user-row">
              <div class="icon" style="letter-spacing: 8.5px">密码</div>
              <el-form-item prop="password">
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  v-model="loginForm.password"
                  ref="password"
                  @keyup.enter.native="nextStep"
                ></el-input>
              </el-form-item>
            </div>
            <div class="user-row">
              <div class="icon">验证码</div>
              <el-form-item prop="verification">
                <el-input
                  placeholder="请输入验证码"
                  v-model="loginForm.verification"
                  ref="verification"
                  @keyup.enter.native="nextStep"
                ></el-input>
                <canvas
                  class="verification-code"
                  ref="canvas"
                  width="90"
                  height="45"
                  @click="changeVerification"
                ></canvas>
              </el-form-item>
            </div>
          </el-form>
          <ul>
            <li><span @click="findPass" class="findPass">忘记密码？</span></li>
            <li><span @click="goRegister" class="goRegister">去注册</span></li>
          </ul>
          <el-button class="login-btn" @click.prevent="handleLogin(formName)"
            >登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { encryption } from '@/utils/utils'
export default {
  data() {
    const verificationRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        if (!this.getVerify(value.trim())) {
          callback(new Error('验证码输入错误'))
        }
        callback()
      }
    }
    return {
      formName: 'loginForm',
      loginForm: {
        account: '',
        password: '',
        verification: ''
      },
      loginRules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verification: [{ validator: verificationRule, trigger: 'blur' }]
      },
      hint: '',
      verifyStr: 'ABCEFGHJKLMNPQRSTWXY123456789',
      verifyResult: '',
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.drawPic()
    if (this.loginForm.account === '') {
      this.$refs.account.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 注册账号
    goRegister() {
      this.$router.push({ path: '/register' })
    },
    // 找回密码
    findPass() {
      this.$router.push({ path: '/findPass' })
    },
    nextStep() {
      if (this.loginForm.account === '') {
        this.$refs.account.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      } else if (this.loginForm.verification === '') {
        this.$refs.verification.focus()
      } else {
        this.handleLogin(this.formName)
      }
    },
    handleLogin(formName) {
      this.hint = ''
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const publicKey = await this.$store.dispatch('user/getPublicKey')
          let data = {
            name: encryption(this.loginForm.account, publicKey),
            pwsd: encryption(this.loginForm.password, publicKey)
          }
          this.$store
            .dispatch('user/login', data)
            .then(res => {
              if (res.status === 200) {
                // this.$router.push({
                //   path: '/guide'
                // })
                this.$router.push({
                  // path: this.redirect || '/',
                  path: '/',
                  query: this.otherQuery
                })
              } else {
                this.hint = res.msg
                this.changeVerification()
              }
            })
            .catch(err => {
              this.changeVerification()
            })
        } else {
          this.changeVerification()
          return false
        }
      })
    },
    changeVerification() {
      this.drawPic()
    },
    getVerify(str) {
      return str.toUpperCase() === this.verifyResult.toUpperCase()
    },
    /**生成一个随机数**/
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    /**生成一个随机色**/
    randomColor(min, max) {
      var r = this.randomNum(min, max)
      var g = this.randomNum(min, max)
      var b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    /**绘制干扰线**/
    drawline(ctx, width, height) {
      for (let i = 0; i < 1; i++) {
        ctx.strokeStyle = this.randomColor(40, 180)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height))
        ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height))
        ctx.stroke()
      }
    },
    /**绘制干扰点**/
    drawPoint(ctx, width, height) {
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(
          this.randomNum(0, width),
          this.randomNum(0, height),
          1,
          0,
          2 * Math.PI
        )
        ctx.fill()
      }
    },
    /**绘制文字**/
    drawTxt(ctx) {
      for (let i = 0; i < 4; i++) {
        let txt = this.verifyStr[this.randomNum(0, this.verifyStr.length)]
        this.verifyResult += txt
        ctx.fillStyle = this.randomColor(50, 160) //随机生成字体颜色
        ctx.font = this.randomNum(20, 40) + 'px SimHei' //随机生成字体大小
        let x = 7 + i * 20
        let y = this.randomNum(30, 35)
        // let deg = this.randomNum(-45, 45); //随机字体旋转角度
        let deg = this.randomNum(0, 0)
        //修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate((deg * Math.PI) / 180)
        ctx.fillText(txt, 0, 0)
        //恢复坐标原点和旋转角度
        ctx.rotate((-deg * Math.PI) / 180)
        ctx.translate(-x, -y)
      }
    },
    /**绘制验证码**/
    drawPic() {
      this.verifyResult = ''
      let canvas = this.$refs.canvas
      let width = canvas.width
      let height = canvas.height
      let ctx = canvas.getContext('2d')
      /**绘制背景色**/
      ctx.fillStyle = this.randomColor(180, 240) //颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height)
      this.drawTxt(ctx)
      // this.drawline(ctx, width, height)
      // this.drawPoint(ctx, width, height)
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped="">
.login {
  width: 100%;
  height: 100%;
  min-width: 830px;
  position: relative;
  left: 0;
  top: 0;
  background: url('../../assets/img/login/login_bg.png') no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  .system_name {
    color: #fff;
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32px;
    font-weight: 500;
    width: 530px;
    text-align: center;
  }
  .login-top {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    background-image: linear-gradient(
        0deg,
        rgba(12, 69, 99, 0.7) 0%,
        rgba(11, 55, 79, 0.73) 8%,
        rgba(10, 40, 59, 0.93) 75%,
        #0a283b 100%
      ),
      linear-gradient(#021132, #021132);
    background-blend-mode: normal, normal;
    box-shadow: 0px 0px 10px 0px #0a2e37;
    opacity: 0.75;
    padding-left: 1%;
    .logo-name {
      display: flex;
      align-items: center;
    }
    .system-name {
      font-weight: 600;
      font-size: 24px;
      margin-left: 10px;
      margin-bottom: 0px;
      cursor: pointer;
      background-image: -webkit-linear-gradient(left, #4ce7e9, #41c6ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .login-body {
    position: absolute;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -55%);
    > div {
      width: 100%;
      height: 100%;
      position: relative;
      left: 0;
      top: 0;
    }
  }
  .login-user {
    width: 380px;
    height: 400px;
    background-color: #ffffff;
    box-shadow: 0px 1px 30px 5px rgba(0, 0, 0, 0.14);
    border-radius: 10px;
    opacity: 0.8;
    padding: 0 25px 0 25px;
    > p {
      height: 85px;
      line-height: 85px;
      text-align: left;
      /*font-weight: bold;*/
      font-size: 20px;
      color: #23b8e6;
      // &:before {
      //   content: '';
      //   width: 2px;
      //   height: 15px;
      //   position: relative;
      //   background-color: #23b8e6;
      //   margin-right: 8px;
      // }
    }
    .user-row {
      display: flex;
      justify-content: center;
      position: relative;
      // align-items: center;
      /deep/ .el-form-item {
        width: 390px;
        margin-bottom: 25px;
        border-bottom: 1px solid #d2d2d2;
        input {
          height: 40px;
          padding: 0 20px 0 80px;
          border: 0px;
          border-radius: 0;
          // color: #8b8d8f;
          // background-color: #2879ca;
        }
        input::placeholder {
          color: #8b8d8f;
          font-size: 14px;
        }
      }
      .icon {
        position: absolute;
        top: -5px;
        left: 0px;
        display: inline-block;
        width: 45px;
        height: 40px;
        line-height: 50px;
        text-align: center;
        font-weight: bold;
        color: #111111;
        z-index: 80;
      }
    }
    .user-row:last-child {
      /deep/ .el-form-item__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-input__inner {
          flex: 1;
        }
      }
      canvas {
        height: 34px;
        width: 90px;
        position: absolute;
        top: 6%;
        right: 1%;
      }
    }
    .login-hint {
      width: 100%;
      height: 30px;
      line-height: 30px;
      color: #f24d5b;
      font-size: 14px;
    }
    .login-btn {
      display: block;
      background-image: linear-gradient(
          rgba(58, 191, 240, 0.61),
          rgba(58, 191, 240, 0.61)
        ),
        linear-gradient(#00add5, #00add5);
      width: 330px;
      height: 50px;
      border: none;
      color: #fff;
      font-size: 18px;
    }
    > ul {
      width: 330px;
      height: 30px;
      // margin: 0 auto;
      display: flex;
      justify-content: space-between;
      span {
        cursor: pointer;
      }
    }
    .findPass {
      color: #23b8e6;
    }
    .goRegister {
      color: #23b8e6;
    }
  }
}
</style>
