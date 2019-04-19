<template>
  <div>
    <Page>
      <div class="page-title">面板</div>

      <a-menu v-model="current" mode="horizontal" class="menu" @select="menuSelectedEvent">

        <a-menu-item key="running">
          <a-icon type="clock-circle"/>
          正在进行
        </a-menu-item>

        <a-menu-item key="discuss">
          <a-icon type="team"/>
          问题讨论
          <a-badge style="margin-left: 6px" :count="discussCount"/>
        </a-menu-item>

        <a-menu-item key="closed">
          <a-icon type="check-circle"/>
          已结题
        </a-menu-item>

      </a-menu>

      <div class="list-container">
        <router-view></router-view>
      </div>

    </Page>
  </div>
</template>

<script>
  import Page from '@/components/Page'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'Index',
    data() {
      return {
        current: ['running'],

      }
    },
    computed: {
      ...mapState(['discuss']),
      discussCount() {
        if (this.discuss == null) return 0
        return this.discuss.length
      }
    },
    methods: {
      ...mapActions(['getDiscuss']),
      menuSelectedEvent(e) {
        switch (e.key) {
          case 'running':
            this.$router.push({
              path: '/running'
            })
            break
          case 'discuss':
            this.$router.push({
              path: '/discuss'
            })
            break
          case 'closed':
            this.$router.push({
              path: '/closed'
            })
            break
        }
      }
    },
    created() {
      this.getDiscuss()
      if (this.$route.path === '/discuss') {
        this.current = ['discuss']
      } else if (this.$route.path === '/closed') {
        this.current = ['closed']
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .menu {
    margin-top: 17px;
    margin-left: 64px;
    margin-right: 64px;
  }

  .list-container {
    .margin-left-right(64px, 64px);
    margin-top: 16px;
  }

</style>
