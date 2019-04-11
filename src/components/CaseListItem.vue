<template>
  <div class="item-container">
    <router-link :to="{path: path, query: {id: id}}" class="title">{{title}}</router-link>
    <div class="tags">
      <template v-for="tag in tags">
        <a-tag>{{tag}}</a-tag>
      </template>
    </div>
    <div class="brief-intro">案例简介: {{briefIntro}}</div>
    <div class="info">
      <a-avatar :src="avatar" class="avatar" />
      <div class="author">{{author}}</div>
      <div class="date">{{date}}</div>
      <div class="clear"></div>
    </div>
    <a-divider style="margin-top: 15px; margin-bottom: 16px" />
  </div>
</template>

<script>
  export default {
    props: ['title', 'tags', 'briefIntro', 'avatar', 'author', 'date', 'id', 'path'],
    data() {
      return {}
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .item-container {

    .title {
      .font(16px, rgba(0, 0, 0, 0.85), bold, 24px)
    }

    .tags {
      margin-top: 12px;
    }

    .brief-intro {
      margin-top: 16px;
      .font(14px, rgba(0, 0, 0, 0.65), normal, 24px);
    }

    .info {
      margin-top: 16px;

      .avatar {
        .size(20px, 20px);
        border-radius: 50%;
        overflow: hidden;
        .float(left);
      }

      .author {
        .font(14px, rgba(0, 0, 0, 0.65), normal, 20px);
        margin-left: 16px;
        .float(left);
      }

      .date {
        .font(14px, rgba(0, 0, 0, 0.25), normal, 20px);
        margin-left: 24px;
        .float(left);
      }
    }
  }

</style>
