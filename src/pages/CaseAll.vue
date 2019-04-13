<template>
  <Page>
    <div class="page-title">教师案例</div>
    <div class="case-list">
      <CaseList :loading="loading" :list="list" :path="path" />
    </div>
  </Page>
</template>

<script>
  import CaseList from '@/components/CaseList'
  import Page from '@/components/Page'

  export default {
    name: 'CaseAll',
    data() {
      return {
        loading: true,
        list: null,
        path: '/case/view'
      }
    },
    components: {
      Page, CaseList
    },
    mounted() {
      const getList = async () => {
        this.loading = true
        try {
          const res = await this.$stHttp({
            url: '/case'
          })
          this.list = res.data
        } catch (e) {
          this.$message.error(e.message)
        } finally {
          this.loading = false
        }
      }

      getList()
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
