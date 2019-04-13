<template>
  <div class="header-container">
    <img src="../assets/images/header-logo.svg" class="header-logo"  alt="SoftTracker" style="cursor: pointer" @click="goHome"/>
    <a-dropdown>
      <div class="user-info-container">
        <img :src="userAvatarUrl" class="avatar-img" />
        <div class="username">{{username}}</div>
        <div class="clear"></div>
      </div>

      <a-menu slot="overlay" @click="menuClicked">
        <a-menu-item style="cursor: default">我的角色: {{role}}</a-menu-item>
        <a-menu-divider />
        <a-menu-item v-if="role === '导师'" key="case">我的案例</a-menu-item>
        <a-menu-item key="logout">退出登录</a-menu-item>
      </a-menu>
    </a-dropdown>

    <a-tooltip placement="bottom" class="add-icon">
      <template slot="title">
        <span v-if="role === '导师'">新建教师案例</span>
        <span v-if="role === '学生'">新建项目</span>
      </template>
      <a-icon type="plus" @click="add"></a-icon>
    </a-tooltip>
    <div class="clear"></div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import ObjectUtils from '@/utils/object-utils'
  import UserUtils from '@/utils/user-utils'

  export default {
    created() {
      // 检查vuex中是否存在userinfo相关信息
      if (ObjectUtils.isNull(this.userInfo)) {
        console.log(">>> 用户信息不存在，从服务器中获取数据")
        this.getUserInfo()
      }
    },
    data() {
      return {}
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      userAvatarUrl() {
        return UserUtils.getAvatar()
      },
      username() {
        if (this.userInfo == null) return ""
        return this.userInfo['username']
      },
      /**
       * 目前只能使用单角色
       */
      role() {
        return UserUtils.getRole()
      }
    },
    methods: {
      add() {
        console.log(">>> add item tapped")
        let path = '';
        switch (this.role) {
          case '学生':
            path = '/case/all'
            break
          case '导师':
            path = '/case/create'
        }
        this.$router.push({path: path})
      },
      ...mapActions([
        'getUserInfo'
      ]),
      menuClicked(e) {
        switch (e.key) {
          case 'case':
            this.$router.push({name: 'MyCase'})
            break
          case 'logout':
            window.localStorage.clear()
            // 清除vuex数据
            window.location.reload()
            // this.$router.push({path: '/login'})
        }
      },
      goHome() {
        this.$router.push({path: "/"})
      }
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .header-container {
    height: 64px;
    background-color: #fff;
    box-shadow: 0 2px 9px rgba(0, 0, 0, 0.08);

    .header-logo {
      height: 30px;
      .float(left);
      margin-top: 17px;
      margin-left: 40px;
    }

    .add-icon {
      .float(right);
      font-size: 24px;
      margin-top: 20px;
      margin-right: 24px;
      opacity: 0.65;
      cursor:pointer;
    }

    .user-info-container {
      .float(right);
      height: 24px;
      margin-top: 20px;
      margin-right: 24px;
      cursor:pointer;

      .avatar-img {
        .float(left);
        .size(24px, 24px);
        border-radius: 50%;
        overflow: hidden;
      }

      .username {
        .float(left);
        margin-left: 8px;
        .font(14px, rgba(0, 0, 0, 0.65));
        line-height: 24px;
      }
    }

  }
</style>
