<template>
  <div v-if="closedProjectList.loading">
    <a-skeleton active />
  </div>
  <div v-else>
    <template v-for="item in projectList.closed">
      <ProjectItem :project="item">
        <template v-slot:others>
          <div class="item project-list-score">
            {{item.score}}分
          </div>
        </template>
      </ProjectItem>
    </template>
  </div>
</template>

<script>
  import ProjectItem from './ProjectItem'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'ClosedProjectList',
    data() {
      return {
        closedProjectList: {
          loading: true
        }
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
        await this.getProjectList('closed')
        this.closedProjectList.loading = false
      }
      loadData()
    },
    components: {
      ProjectItem
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .item {
    margin-left: 38px;
  }

  .project-list-score {
    .font(@size: 16px, @line: 40px, @opacity: 0.45);
  }

</style>
