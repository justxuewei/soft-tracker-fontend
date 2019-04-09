<template>
  <div class="footer-container">
    <div class="footer-info-container">
      <a-row>
        <a-col :span="6">
          <img class="footer-logo" src="../assets/images/footer-logo.svg" />
        </a-col>
        <a-col :span="4"  :offset="10">
          <div class="col-title">相关资源</div>
          <a class="col-item" href="https://gitlab.com">GitLab</a>
          <a class="col-item" href="https://about.gitlab.com/product/continuous-integration/">GitLab CI<span> - 持续集成工具</span></a>
          <a class="col-item" href="https://www.docker.com/">Docker<span> - 容器化技术</span></a>
        </a-col>
        <a-col :span="4">
          <div class="col-title">帮助</div>
          <a class="col-item" href="#">更新日志</a>
          <a class="col-item" href="#">常见问题</a>
          <a class="col-item" href="#">问题反馈</a>
        </a-col>
      </a-row>
    </div>
    <div class="footer-copyright">
      Designed by <a href="https://www.nxw.name">XavierNiu</a>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .footer-container {
    background-color: #001529;
    color: white;

    .footer-info-container {
      padding-top: 52px;
      padding-bottom: 32px;

      .footer-logo {
        height: 31px;
        margin-left: 40px;
      }

      .col-title {
        .font(16px, white, bold);
        padding-bottom: 8px;
        line-height: 22px;
      }

      .col-item {
        display: block;
        margin-top: 6px;
        .font(14px, white);
        line-height: 20px;

        span {
          color: #939393;
        }
      }
    }

    .footer-copyright {
      height: 52px;
      border-top: 1px solid #979797;
      text-align: center;
      line-height: 52px;

      a {
        color: white;
        font-weight: bold;
      }
    }
  }
</style>
