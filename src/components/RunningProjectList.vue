<template>
  <div v-if="loading">
    <a-skeleton active />
  </div>
  <div v-else>
    <template v-for="item in projectList.running">
      <ProjectItem :project="item">
        <template v-slot:others>
          <div class="item progress-bar">
            <a-progress class="bar" size="small" :percent="item['progress']" status="active" />
          </div>
        </template>
      </ProjectItem>
    </template>
  </div>
</template>

<script>
  import ProjectItem from './ProjectItem'
  import {mapState, mapActions} from 'vuex'
  import ACol from 'ant-design-vue/es/grid/Col'
  import {Icon} from 'ant-design-vue'

  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1141408_hjyqq5uynct.js'
  })

  export default {
    name: 'RunningProjectList',
    components: {
      ACol,
      ProjectItem,
      IconFont
    },
    data() {
      return {
        loading: true
      }
    },
    computed: {
      ...mapState(['projectList'])
    },
    methods: {
      ...mapActions(['getProjectList']),
    },
    created() {
      const loadData = async () => {
        await this.getProjectList('running')
        this.loading = false
      }
      loadData()
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .item {
    margin-left: 38px;
  }

  .progress-bar {
    width: 22%;

    .bar {
      margin-top: 14px;
    }
  }

  .update-info {
    width: 18%;
    .font(14px, 40px, @opacity: 0.45);
    text-align: right;
  }

  .icon {
    font-size: 22px;
    line-height: 22px;
    margin-top: 8px;
    cursor: pointer;
  }

</style>
