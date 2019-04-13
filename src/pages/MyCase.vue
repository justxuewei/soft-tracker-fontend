<template>
  <Page>
    <div class="page-title">我的案例</div>
    <div class="case-list">
      <CaseList :loading="loading" :list="list" path="/case/view"/>
    </div>
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import CaseList from '@/components/CaseList'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        loading: true,
        list: null
      }
    },
    components: {
      Page, CaseList
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ])
    },
    mounted() {
      const getCaseList = async () => {
        if (this.$store.state.userInfo == null || this.$store.state.userInfo['id'] === undefined) {
          await this.getUserInfo()
        }
        const userId = this.$store.state.userInfo['id']
        this.loading = true
        try {
          const data = await this.$stHttp({
            url: `/case?tutorId=${userId}`
          })
          this.list = data["data"]
        } catch (e) {
          this.$message.error(e.message)
        } finally {
          this.loading = false
        }
      }
      getCaseList()
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .case-list {
    margin-top: 48px;
    .margin-left-right(100px, 100px);
  }
</style>
