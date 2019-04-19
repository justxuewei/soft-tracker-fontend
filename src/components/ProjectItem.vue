<template>
  <div>
    <div class="item-container">
      <a-row>
        <a-col :span="10">
          <a-avatar shape="square" class="avatar" size="large" :style="{backgroundColor: randomColor}">{{avatar}}</a-avatar>
          <router-link :to="navLink" class="project-name">{{project.name}}</router-link>
          <div class="role">{{role}}</div>
          <div class="clear"></div>
        </a-col>
        <a-col :span="14">
          <div class="right-container">

            <div class="status">
              <div class="title">状态</div>
              <div class="content" v-if="'rejected' !== project.status">{{projectStatus}}</div>
              <div class="content" v-else style="color: #f31d28; opacity: 1"><a-icon style="color: #f31d28; margin-right: 5px" type="warning" />{{projectStatus}}</div>
            </div>

            <slot name="others"></slot>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-divider style="margin: 0"/>
  </div>
</template>

<script>

  import {mapState, mapActions} from 'vuex'
  import constants from '@/utils/constants-utils'

  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

  export default {
    name: 'ProjectItem',
    props: ['project'],
    computed: {
      ...mapState(['userInfo']),
      avatar() {
        if (this.project == null || this.project.name === undefined) return "project"
        return this.project.name.substr(0, 1)
      },
      randomColor() {
        const random = Math.floor(Math.random()*10)
        return colorList[random % colorList.length]
      },
      role() {
        let role = ''
        const a = async () => {
          if (this.userInfo == null)
            await this.getUserInfo()
          const userId = this.userInfo.id
          for (let item of this.project.members) {
            if (userId === item['userId']) {
              role = constants.projectRole[item['role']]
            }
          }
        }

        a()

        return role
      },
      projectStatus() {
        return constants.projectStatus[this.project.status]
      },
      navLink() {
        return {
          path: '/project/details',
          query: {
            id: this.project.id
          }
        }
      }
    },
    methods: {
      ...mapActions(['getUserInfo'])
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .item-container {
    padding: 15px 19px;

    .avatar {
      .float(left);
    }

    .project-name {
      .float(left);
      .font(14px, 40px, rgba(0, 0, 0, 0.65));
      margin-left: 24px;
    }

    .role {
      .float(left);
      padding: 2px 12px;
      border-radius: 12px;
      margin-left: 12px;
      margin-top: 8px;
      .font(@size: 12px, @line: 17px, @color: #5C5C5C);
      border: 1px solid #979797;
    }

    .right-container {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      /*background-color: #C21F39;*/

      .status {
        text-align: center;

        .title {
          .font(14px, 22px, @weight: bold, @opacity: 0.45)
        }

        .content {
          .font(14px, 22px, @opacity: 0.45)
        }
      }
    }
  }

</style>
