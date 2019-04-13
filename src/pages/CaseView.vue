<template>
  <Page>
    <div v-if="loading">
      <a-spin class="loading" tip="Loading..."/>
    </div>
    <div class="case-view-container" style="position: relative" v-else>
      <a-button type="primary" class="edit-button" v-if="userInfo['username'] === data['author']" @click="edit">编辑</a-button>
      <a-tooltip placement="top" >
        <template slot="title">
          <span>选择此案例作为项目参考</span>
        </template>
        <a-button type="primary" class="edit-button" v-if="role === studentRole" @click="apply">项目申报</a-button>
      </a-tooltip>
      <div class="page-title" style="width: 90%">{{data.title}}</div>
      <div class="info-container">
        <a-avatar :src="data.avatar" class="avatar"/>
        <div class="author">{{data.author}}</div>
        <div class="tags">
          <template v-for="tag in data.tags">
            <a-tag class="tag">{{tag}}</a-tag>
          </template>
        </div>
        <div class="clear"></div>
      </div>
<!--      <div class="markdown-area" v-html="md.render(data.content)"></div>-->
      <MarkdownView class="markdown-area" :markdown="data.content" />
      <div class="demo-url" v-if="data.demoUrl != null">演示地址: <a :href="data.demoUrl">{{data.demoUrl}}</a></div>
    </div>
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import MarkdownView from '@/components/MarkdownView'
  import {mapState} from 'vuex'
  import UserUtils from '@/utils/user-utils'
  import Constants from '@/utils/constants-utils'

  export default {
    data() {
      return {
        id: this.$route.query.id,
        data: null,
        loading: true
      }
    },
    components: {
      Page, MarkdownView
    },
    computed: {
      ...mapState(['userInfo']),
      role() {
        return UserUtils.getRole()
      },
      studentRole() {
        return Constants.role.STUDENT
      }
    },
    methods: {
      edit() {
        // 将关于该案例的全部数据存入到vuex中
        this.$store.commit('saveEditCaseForm', this.data)
        this.$router.push({
          path: '/case/edit',
          query: {
            id: this.id
          }
        })
      },
      apply() {
        this.$router.push({
          path: '/project/creation',
          query: {
            caseId: this.$route.query.id
          }
        })
      }
    },
    created() {
      const getCaseDetails = async () => {
        try {
          this.loading = true
          const data = await this.$stHttp({
            url: `/case/details?caseId=${this.id}`
          })
          this.data = data["data"]
          console.log(this.data)
        } catch (e) {
          this.$message.error(e)
        } finally {
          this.loading = false
        }
      }

      getCaseDetails()
    }
  }
</script>

<style lang="less">
  @import "../style/markdown";

  .loading {
    margin-top: 60px;
    .horizontal-center;
  }

  .case-view-container {

    .edit-button {
      position: absolute;
      top: 49px;
      right: 64px;
    }

    .info-container {
      margin-top: 16px;

      .avatar {
        .size(23px, 23px);
        margin-left: 64px;
        float: left;
      }

      .author {
        .font(16px, rgba(0, 0, 0, 0.65), normal, 23px);
        margin-left: 16px;
        .float(left);
      }

      .tags {
        .float(left);
        margin-left: 24px;

        .tag {
          box-sizing: border-box;
        }
      }
    }

    .demo-url {
      margin-top: 48px;
      .margin-left-right(64px, 64px);
      .font(16px, black, bold, 24px);

      a {
        font-weight: normal;
      }
    }
  }

</style>
