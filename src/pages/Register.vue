<template>
  <div class="login-background">
    <div class="panel">
      <div class="title">注册</div>
      <a-alert class="form-item" style="margin-top: 24px" type="error" :message="errorMsg" showIcon v-if="errorMsg !== ''" />
      <a-input class="form-item username-input" placeholder="账户" v-model="username" ref="usernameInput">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="username" slot="suffix" type="close-circle" @click="emitEmpty('usr')" />
      </a-input>
      <a-input class="form-item other-input" placeholder="邮箱" v-model="email" ref="emailInput">
        <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="email" slot="suffix" type="close-circle" @click="emitEmpty('email')" />
      </a-input>
      <a-input type="password" class="form-item other-input" placeholder="密码" v-model="password" ref="passwordInput">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="password" slot="suffix" type="close-circle" @click="emitEmpty('psw')" />
      </a-input>
      <a-input type="password" class="form-item other-input" placeholder="确认密码" v-model="confirmedPassword" ref="confirmedPasswordInput">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
        <a-icon v-if="confirmedPassword" slot="suffix" type="close-circle" @click="emitEmpty('cfmPsw')" />
      </a-input>
      <a-button type="primary" class="form-item button" @click="register" :loading="loading">提交</a-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import constants from '@/utils/constants-utils'

  export default {
    name: "Register",
    data() {
      return {
        errorMsg: '',
        username: '',
        email: '',
        password: '',
        confirmedPassword: '',
        loading: false
      }
    },
    methods: {
      emitEmpty(e) {
        switch (e) {
          case 'usr':
            this.$refs.usernameInput.focus()
            this.username = ''
            break
          case 'email':
            this.$refs.emailInput.focus()
            this.email = ''
            break
          case 'psw':
            this.$refs.passwordInput.focus()
            this.password = ''
            break
          case 'cfmPsw':
            this.$refs.confirmedPasswordInput.focus()
            this.confirmedPassword = ''
            break
        }
      },
      register() {
        if (this.username === '') {
          this.errorMsg = "用户名不能为空"
          return
        }
        if (this.email === '') {
          this.errorMsg = "邮箱不能为空"
          return
        }
        if (this.password === '') {
          this.errorMsg = "密码不能为空"
          return
        }
        if (this.password !== this.confirmedPassword) {
          this.errorMsg = "确认密码与原密码不一致"
          return
        }
        this.loading = true
        axios({
          method: 'post',
          url: constants.softTrackerHostPrefix() + '/auth/register',
          data: {
            username: this.username,
            password: this.password,
            email: this.email
          }
        }).then(() => {
          this.loading = false
          // 重新登录
          window.location.href = "/login"
        }).catch((error) => {
          this.loading = false
          this.errorMsg = error.response.data['message']
        })
      }
    }
  }
</script>

<style lang="less">
  @import "../style/login-register";

</style>
