<template>
  <div>
    <Header id="header"/>
    <div id="container" class="container" :style="{minHeight: containerMinHeight + 'px'}">
      <slot></slot>
    </div>
    <Footer id="footer"/>
  </div>
</template>

<script>
  import Header from './Header'
  import Footer from './Footer'

  export default {
    mounted() {
      window.onresize = () => {
        return (() => {
          this.calContainerMinHeight()
        })()
      }
      this.calContainerMinHeight()
    },
    data() {
      return {
        containerMinHeight: 0
      }
    },
    components: {
      Header,
      Footer
    },
    methods: {
      calContainerMinHeight() {
        const footerHeight = document.getElementById("footer").offsetHeight
        const headerHeight = document.getElementById("header").offsetHeight
        const clientHeight = document.getElementById("app").offsetHeight
        this.containerMinHeight = clientHeight - headerHeight - footerHeight
      }
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .container {
    padding-bottom: 60px;
    box-sizing: border-box;
    position: relative;

    .page-title {
      .font(@size: 30px, @line: 42px, @color: black, @weight: bold);
      padding-top: 48px;
      padding-left: 64px;
    }
  }
</style>
