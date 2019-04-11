<template>
  <div class="login-background" @keyup.enter="login">>
    <div class="panel">
      <div class="title">登录</div>
      <div class="subtitle">登录到SoftTracker，解锁全部功能</div>
      <a-alert class="form-item" style="margin-top: 24px" type="error" :message="errorMsg" showIcon
               v-if="errorMsg !== ''"/>
      <a-input class="form-item username-input" placeholder="账户" v-model="username" ref="usernameInput">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="username" slot="suffix" type="close-circle" @click="emitEmpty('usr')"/>
      </a-input>
      <a-input type="password" class="form-item other-input" placeholder="密码" v-model="password" ref="passwordInput">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="password" slot="suffix" type="close-circle" @click="emitEmpty('psw')"/>
      </a-input>
      <a-button type="primary" class="form-item button" @click="login">登录</a-button>
      <router-link class="form-item register-link" :to="{path: '/register'}">注册账户</router-link>
    </div>
  </div>
</template>

<script>
  import auth from '@/http/auth'

  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        errorMsg: '',
        fromRoute: null
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(from)
      next(vm => {
        vm.fromRoute = from
      })
    },
    methods: {
      emitEmpty(e) {
        switch (e) {
          case 'usr':
            this.$refs.usernameInput.focus()
            this.username = ''
            break
          case 'psw':
            this.$refs.passwordInput.focus()
            this.password = ''
            break
        }
      },
      login() {
        if (this.username === '') {
          this.errorMsg = '用户名不能为空'
          return
        }
        if (this.password === '') {
          this.errorMsg = '密码不能为空'
          return
        }
        const login = async () => {
          try {
            await auth.login(this.username, this.password)
            // 跳转到下一个url
            if (!this.fromRoute.name) {
              console.log('>>> 登录成功后，无历史记录回退到主页')
              this.$router.push({path: '/'})
            } else {
              console.log('>>> 登录成功后，有历史记录回退到上一步')
              this.$router.back()
            }
          } catch (e) {
            this.errorMsg = e
          }
        }
        // 执行登录
        login()
      }
    }
  }
</script>

<style lang="less">
  @import "../style/login-register";

  .register-link {
    margin-top: 24px;
    .font(14px, #1890FF);
    text-align: right;
  }

</style>
