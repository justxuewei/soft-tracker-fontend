<template>
  <Page>
    <div class="page-title">案例正文预览</div>
    <div class="markdown-area" v-html="previewHtml"></div>
  </Page>
</template>

<script>
  import Page from "@/components/Page"
  import MarkdownIt from 'markdown-it'

  export default {
    data() {
      return {
        md: new MarkdownIt()
      }
    },
    computed: {
      previewHtml() {
        if (this.$store.state.caseForm == null || this.$store.state.caseForm['content'] === undefined) {
          return ''
        }
        const md = this.$store.state.caseForm['content']
        return this.md.render(md)
      }
    },
    components: {
      Page
    }
  }
</script>

<style lang="less">
  @import "../style/markdown";
</style>
