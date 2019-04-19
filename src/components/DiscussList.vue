<template>
  <div style="margin-top: 24px">
    <a-list
      bordered
      :dataSource="discuss"
      :loading="loadingDiscuss"
      :locale="{emptyText: '暂无数据'}"
    >
      <!--suppress CommaExpressionJS -->
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="discuss-item-container">
          <a class="title" :href="item.webUrl">{{item.title}}</a>
          <div class="project">项目：{{item.project}}</div>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'DiscussList',
    data() {
      return {
        loadingDiscuss: true
      }
    },
    computed: {
      ...mapState(['discuss']),
    },
    methods: {
      ...mapActions(['getDiscuss']),
      async loadDiscuss() {
        await this.getDiscuss()
        this.loadingDiscuss = false
      }
    },
    created() {
      if (this.discuss.length !== 0) this.loadingDiscuss = false
      this.loadDiscuss()
      console.log("created")
    }
  }
</script>

<style lang="less">

  .discuss-item-container {
    display: flex;
    width: 100%;

    .title {
      display: block;
      flex: 1;
    }

    .project {
    }
  }

</style>
