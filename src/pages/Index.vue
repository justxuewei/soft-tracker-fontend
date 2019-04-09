<template>
  <div>
    <Page>
      <div class="page-title">面板</div>

      <a-menu v-model="current" mode="horizontal" class="menu">

        <a-menu-item key="in-process">
          <a-icon type="clock-circle" />正在进行
        </a-menu-item>

        <a-menu-item key="discuss">
          <a-icon type="team" />问题讨论<a-badge style="margin-left: 6px" count="1" />
        </a-menu-item>

        <a-menu-item key="closed">
          <a-icon type="check-circle" />已经结题
        </a-menu-item>

      </a-menu>
    </Page>
  </div>
</template>

<script>
  import Page from '@/components/Page'

  export default {
    name: 'Index',
    data() {
      return {
        current: ['in-process']
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

</style>
