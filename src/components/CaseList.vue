<template>
  <div v-if="loading">
    <a-skeleton active />
    <a-divider style="margin-top: 30px; margin-bottom: 15px"/>
    <a-skeleton active />
  </div>
  <div v-else>
    <template  v-for="item in list">
      <CaseListItem :path="path" :id="item.id" :title="item.title" :brief-intro="item.briefIntro"
                    :avatar="item.avatar" :author="item.author" :tags="item.tags" :date="item.date" />
    </template>
  </div>
</template>

<script>
  import CaseListItem from './CaseListItem'

  export default {
    props: [
      'loading', 'list', 'path'
    ],
    components: {
      CaseListItem
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";
</style>
