<template>
  <Page>
    <div>
      <a-affix :style="{ position: 'absolute', right: '64px'}" :offsetTop="110">
        <a-button type="primary" @click="back">
          <a-icon type="left"/>
          返回
        </a-button>
      </a-affix>
      <div class="page-title">案例正文预览</div>
      <MarkdownView class="markdown-area" :markdown="markdown"/>
    </div>
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import {mapState} from 'vuex'
  import MarkdownView from '@/components/MarkdownView'

  export default {
    data() {
      return {
        fromRoute: null
      }
    },
    beforeRouteEnter(to, from, next) {
      console.log(from)
      next(vm => {
        vm.fromRoute = from
      })
    },
    computed: {
      ...mapState(['caseForm', 'editCaseForm']),
      markdown() {
        // 查看case create form正文
        if (this.caseForm != null && this.caseForm['content'] !== undefined) {
          return this.caseForm['content']
        }

        // 查看case edit form正文
        if (this.editCaseForm != null && this.editCaseForm['content'] !== undefined) {
          return this.editCaseForm['content']
        }

        return ''
      }
    },
    methods: {
      back() {
        this.$router.push({
          path: this.fromRoute.path,
          query: this.fromRoute.query
        })
      }
    },
    components: {
      Page, MarkdownView
    }
  }
</script>

<style lang="less">
  @import "../style/markdown";
</style>
