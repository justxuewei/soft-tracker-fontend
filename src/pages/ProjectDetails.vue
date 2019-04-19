<template>
  <div>
    <Header id="header"/>
    <div v-if="loading" style="margin: 48px 64px">
      <a-skeleton :paragraph="{rows: 4}" active/>
    </div>
    <div v-if="!loading && !error" class="project-details-container" :style="{minHeight: containerMinHeight + 'px'}">
      <div id="title" class="title-container">
        <div class="page-title">
          {{project.name}}
          <span :class="statusCSS">
            <a-icon
              class="icon"
              :type="!checkStatus('closed')? 'clock-circle' : 'check-circle'"/>
            {{!checkStatus('closed')? '进行中': '已结题'}}
          </span>
        </div>
        <a :href="`${gitlabPrefix}/${masterUsername}/${$route.query.id}`" v-if="showEnterGitlabButton"
           class="enter-gitlab">
          <a-button type="primary">进入GitLab</a-button>
        </a>
      </div>

      <div class="details-container">

        <a-card title="项目总览" class="overview">
          <a-steps progressDot :current="stepIndex" class="steps">
            <a-step title="项目申报" description="填写项目申报表"/>
            <a-step title="项目审核" description="等待导师审核"/>
            <a-step title="项目开发" description="根据申报内容进行开发"/>
            <a-step title="项目答辩" description="演示以及答辩"/>
            <a-step title="结题" description="项目关闭"/>
          </a-steps>

          <div class="project-info-container">
            <a-row>
              <a-col :span="8">
                <div class="list-item"><span>申报题目：</span>{{project['name']}}</div>
              </a-col>
              <a-col :span="8">
                <div class="list-item"><span>当前状态：</span>{{currentStatus}}</div>
              </a-col>
              <a-col :span="8">
                <div class="list-item"><span>指导教师：</span>{{getTutor}}</div>
              </a-col>
              <a-col :span="8">
                <div class="list-item"><span>教师案例：</span>
                  <router-link :to="{path: '/case/view', query: {id: project.caseId}}">
                    <a-icon type="link"/>
                    点击进入
                  </router-link>
                </div>
              </a-col>
              <a-col :span="8" v-if="checkStatus('applying')">
                <div class="list-item"><span>申报书：</span><a :href="downloadLink">
                  <a-icon type="download"/>
                  点击下载</a></div>
              </a-col>
              <a-col :span="8">
                <div class="list-item"><span>最后更新日期：</span>{{project['updateTime']}}</div>
              </a-col>
              <a-col :span="16">
                <div class="list-item"><span>成员：</span>{{getMaster}}、{{getMember}}</div>
              </a-col>
            </a-row>
          </div>

          <div v-if="checkStatus('applying') && getTutor === userInfo.realname" class="audit-container">
            <a-popconfirm
              title="确定要批准该申报吗？"
              @confirm="passApplication"
              okText="确定"
              cancelText="取消"
            >
              <a-button icon="check-circle" type="primary">
                批准申报
              </a-button>
            </a-popconfirm>
            <a-button icon="stop" type="danger" @click="rejectApplication" style="margin-left: 20px">
              驳回申报
            </a-button>
            <!--suppress JSUndeclaredVariable -->
            <a-modal
              :visible="rejectedModalVisible"
              title='驳回申报'
              okText='提交'
              cancelText="取消"
              @cancel="() => {rejectedModalVisible = false}"
              @ok="submitRejectEvent"
            >
              <a-form layout='vertical' :form="rejectForm">

                <a-form-item
                  label='理由'
                  help="请填写驳回理由以帮助学生进一步修改申报书"
                >
                  <a-input
                    type='textarea'
                    v-decorator="['reason', {rules: [{ required: true, message: '理由是必须的' }],}]"
                    :autosize="{ minRows: 5}"></a-input>
                </a-form-item>

              </a-form>
            </a-modal>
          </div>

        </a-card>

        <a-card title="项目驳回" class="item-card rejected-info" v-if="checkStatus('rejected') && checkRole('student')">
          <a-alert
            class="rejected-alert"
            message="该项目已被导师驳回"
            description="请根据老师的反馈对申请内容进行修改，修改完成后点击“重新申请”按钮重新发起项目申报。"
            type="error"
            showIcon
          />
          <div class="rejected-reason">驳回理由：{{project.extraInfo.reason}}</div>

          <router-link v-if="checkProjectRole('master')" class="reapply"
                       :to="{path: '/project/reapply', query: {cid: project['caseId'], pid: project['id']}}">
            <a-button icon="interation" type="primary">重新申请</a-button>
          </router-link>
        </a-card>

        <a-card title="开发面板" class="item-card dev-panel" v-if="checkStatus('developing')">
          <div class="module-list">
            <h4>项目模块</h4>
            <a :href="`${gitlabPrefix}/${masterUsername}/${$route.query.id}/issues?label_name[]=module`"><a-button class="manage-button" type="primary">管理任务模块</a-button></a>
            <a-list bordered
                    class="issue-list"
                    :dataSource="defaultIssues.modules"
                    :loading="loadingDefaultIssues"
                    :locale="{emptyText: '暂无数据'}"
            >
              <!--suppress CommaExpressionJS -->
              <a-list-item slot="renderItem" slot-scope="item, index">
                <div class="discuss-item-container">
                  <a class="title" :href="item.webUrl">{{item.title}}</a>
                  <div class="project">
                    <div v-if="item.state === 'opened'" style="color: #1890FF"><a-icon type="clock-circle" theme="filled" /> 进行中</div>
                    <div v-else style="color: #52C41A"><a-icon type="check-circle" theme="filled" /> 已完成</div>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
          <div class="discussion-list">
            <h4>问题讨论</h4>
            <a :href="`${gitlabPrefix}/${masterUsername}/${$route.query.id}/issues?label_name[]=discuss`"><a-button class="manage-button" type="primary">管理问题讨论</a-button></a>
            <a-list bordered
                    class="issue-list"
                    :dataSource="defaultIssues.discussions"
                    :loading="loadingDefaultIssues"
                    :locale="{emptyText: '暂无数据'}"
            >
              <!--suppress CommaExpressionJS -->
              <a-list-item slot="renderItem" slot-scope="item, index">
                <div class="discuss-item-container">
                  <a class="title" :href="item.webUrl">{{item.title}}</a>
                  <div class="project">
                    <div v-if="item.state === 'opened'" style="color: #1890FF"><a-icon type="clock-circle" theme="filled" /> 进行中</div>
                    <div v-else style="color: #52C41A"><a-icon type="check-circle" theme="filled" /> 已解决</div>
                  </div>
                </div>
              </a-list-item>
            </a-list>
          </div>
        </a-card>

        <a-card title="GitLab CI配置文件"
                class="item-card gitlab-ci-config-container"
                v-if="checkStatus('developing') && checkRole('student')">
          <a-alert
            message="使用帮助"
            description="GitLab CI配置文件用于指导代码上传到仓库后的自动化操作，如自动化单元测试和自动化打包等。该文件十分重要，请务必将下载后的文件重命名为'.gitlab-ci.yml'并复制到项目根目录。如果提供的配置文件不能满足你的需求，可以自行创建该配置文件，更多信息请参见GitLab CI帮助。"
            type="info"
            showIcon
          />
          <div class="download-container">
            <div class="select-container">
              <div class="title">配置类型：</div>
              <!-- 暂时只有maven project所以采用硬编码机制 -->
              <a-select
                defaultValue="maven"
                class="select"
                @change="gitlabCIConfigChangedEvent"
              >
                <a-select-option value="maven">Maven Project</a-select-option>
              </a-select>
            </div>
            <a href="#"><a-button type="primary" class="button" block>下载</a-button></a>
          </div>
        </a-card>

        <a-card title="结题"
                class="item-card gitlab-ci-config-container"
                v-if="checkStatus('developing') && checkRole('student')">
          <a-alert
            message="请注意"
            :description='`请在提交结题前确认工作是否全部完成，提交后将交由导师进行评分，请再次核查项目内容及源代码是否已经合并到Master分支，确认无误后请输入"${project.name}"确认结题。`'
            showIcon
            type="warning"
          />
          <div class="download-container">
            <div class="select-container">
              <div class="title">项目名称：</div>
              <a-input
                class="select"
                placeholder="请输入"
                v-model="projectNameConfirm"
              />
            </div>
            <a-button type="primary" class="button" :loading="confirmingDefence" block @click="projectDefenceConfirmEvent">确认结题</a-button>
          </div>
        </a-card>

        <a-card title="项目评分"
                class="item-card project-score"
                v-if="checkStatus('defending') || checkStatus('closed')">
          <a-table :locale="{emptyText: '暂无数据'}" :pagination="false" :columns="scoreTableColumns" :dataSource="scoresData" :loading="loadingScoreData">
          </a-table>

          <div class="download-container" v-if="checkRole('tutor') && checkStatus('defending')">
            <div class="select-container">
              <a-alert
                v-if="projectScore.errorMsg != null"
                message="出错了"
                :description="projectScore.errorMsg"
                type="error"
                style="width: 100%; margin-bottom: 30px"
                showIcon
              />
            </div>
            <div class="select-container">
              <div class="title">代码质量：</div>
              <a-input class="select" placeholder="请输入一个0-100的数字" v-model="projectScore.codeQualityScore"></a-input>
            </div>
            <div class="select-container" style="margin-top: 15px">
              <div class="title">答辩得分：</div>
              <a-input class="select" placeholder="请输入一个0-100的数字" v-model="projectScore.defenceScore"></a-input>
            </div>
            <a-button type="primary" class="button" block @click="projectScoreSubmitEvent">确认提交</a-button>
          </div>
        </a-card>

      </div>
    </div>
    <Footer id="footer"/>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import ARow from 'ant-design-vue/es/grid/Row'
  import ACol from 'ant-design-vue/es/grid/Col'
  import constants from '@/utils/constants-utils'
  import {mapState} from 'vuex'

  export default {
    name: 'ProjectDetails',
    data() {
      return {
        project: null,
        loading: true,
        error: false,
        containerMinHeight: 0,
        rejectedModalVisible: false,
        rejectForm: this.$form.createForm(this),
        defaultIssues: {
          modules: [],
          discussions: []
        },
        loadingDefaultIssues: true,
        projectNameConfirm: "",
        confirmingDefence: false,
        scoreTableColumns: [
          {
            title: '项目',
            dataIndex: 'item',
          },
          {
            title: '评分标准',
            dataIndex: 'standard'
          },
          {
            title: '得分',
            dataIndex: 'score'
          }
        ],
        scoresData: null,
        loadingScoreData: false,
        projectScore: {
          errorMsg: null,
          codeQualityScore: null,
          defenceScore: null,
          submiting: false
        }
      }
    },
    components: {
      ACol,
      ARow,
      Header,
      Footer
    },
    computed: {
      ...mapState(['userInfo']),
      statusCSS() {
        const css = 'status '
        if (this.checkStatus('closed')) {
          return css + 'closed'
        } else {
          return css + 'running'
        }
      },
      showEnterGitlabButton() {
        // noinspection RedundantIfStatementJS
        if (this.checkStatus('applying') || this.checkStatus('rejected')) {
          return false
        }
        return true
      },
      stepIndex() {
        switch (this.project['status']) {
          case 'applying':
            return 1
          case 'rejected':
            return 0
          case 'developing':
            return 2
          case 'defending':
            return 3
          case 'closed':
            return 4
        }
      },
      currentStatus() {
        return constants.projectStatus[this.project['status']]
      },
      getTutor() {
        for (let t of this.project.members) {
          if (t.projectRole === 'tutor') {
            return t.realname
          }
        }
        return '无数据'
      },
      getMaster() {
        for (let t of this.project.members) {
          if (t.projectRole === 'master') {
            return t.realname + '(组长)'
          }
        }
        return '无数据'
      },
      masterUsername() {
        for (let t of this.project.members) {
          if (t.projectRole === 'master') {
            return t.username
          }
        }
        return null
      },
      gitlabPrefix() {
        return constants.gitlabHostPrefix()
      },
      getMember() {
        let str = []
        for (let t of this.project.members) {
          if (t.projectRole === 'member') {
            str.push(t.realname + '(成员)')
          }
        }
        return str.join('、')
      },
      downloadLink() {
        return `${constants.softTrackerHostPrefix()}/download/${this.project.extraInfo.saveName}`
      }
    },
    methods: {
      /**
       * 项目权限判断
       * @param type
       * @returns {boolean}
       */
      checkProjectRole(type) {
        if (this.project == null || this.userInfo == null) return false
        for (let member of this.project['members']) {
          if (member['id'] === this.userInfo['id']) {
            return type === member['projectRole']
          }
        }
        return false
      },
      checkRole(type) {
        if (this.project == null || this.userInfo == null) return false
        for (let role of this.userInfo['roles']) {
          if (type === role) return true
        }
        return false
      },
      /**
       * 状态判断
       * @param type
       * @returns {boolean}
       */
      checkStatus(type) {
        if (this.project == null || this.userInfo == null) return false
        return type === this.project['status']
      },
      getProjectDetailsContainerMinHeight() {
        const footerHeight = document.getElementById('footer').offsetHeight
        const headerHeight = document.getElementById('header').offsetHeight
        const appHeight = document.getElementById('app').offsetHeight
        this.containerMinHeight = appHeight - headerHeight - footerHeight
      },
      passApplication() {
        const pass = async () => {
          const passRequesting = this.$message.loading('正在请求，请稍后', 0)
          try {
            await this.$stHttp({
              method: 'post',
              url: `/project/${this.$route.query.id}/accept_application`
            })
            // 刷新数据
            await this.getProjectDetails()
          } catch (e) {
            this.$message.error(e.message)
          } finally {
            passRequesting()
          }
        }

        pass()
      },
      rejectApplication() {
        this.rejectedModalVisible = true
      },
      submitRejectEvent(e) {
        e.preventDefault()
        this.rejectForm.validateFields((err, fieldsValue) => {
          if (err) return
          const rejectApplicationReq = async () => {
            try {
              await this.$stHttp({
                method: 'post',
                url: `/project/reject/${this.project.id}`,
                data: fieldsValue
              })
              // 刷新数据
              await this.getProjectDetails()
              this.rejectedModalVisible = false
            } catch (e) {
              this.$message.error(e.message)
            }
          }

          rejectApplicationReq()
        })
      },
      async getProjectDetails() {
        try {
          this.loading = true
          const res = await this.$stHttp({
            url: `/project/${this.$route.query.id}`
          })
          this.project = res.data
        } catch (e) {
          this.$message.error(e.message)
          this.error = true
        } finally {
          this.loading = false
        }
      },
      async loadProjectDefaultIssues() {
        // 如果状态不为开发中则禁止加载该信息
        if (!this.checkStatus('developing')) {
          console.log("如果状态不为开发中则禁止加载该信息")
          return
        }
        this.loadingDefaultIssues = true
        try {
          const res = await this.$stHttp({
            url: `/project/${this.$route.query.id}/default_issues`
          })
          this.defaultIssues = res['data']
        } catch (e) {
          this.$message.error(e.message)
          this.error = true
        } finally {
          this.loadingDefaultIssues = false
        }
      },
      async init() {
        await this.getProjectDetails()
        await this.loadProjectDefaultIssues()
        await this.loadScoreData()
      },
      async confirmDefence() {
        try {
          this.confirmingDefence = true
          await this.$stHttp({
            url: `/project/${this.$route.query.id}/confirm_defence`,
            method: 'post'
          })
          // 刷新数据
          await this.getProjectDetails()
        } catch (e) {
          this.$message.error(e.message)
        } finally {
          this.confirmingDefence = false
        }
      },
      async loadScoreData() {
        if (!(this.checkStatus('defending') || this.checkStatus('closed'))) return
        try {
          this.loadingScoreData = true
          const res = await this.$stHttp({
            url: `/project/${this.$route.query.id}/score`
          })
          this.scoresData = res.data
        } catch (e) {
          this.$message.error(e.message)
        } finally {
          this.loadingScoreData = false
        }
      },
      gitlabCIConfigChangedEvent(v) {},
      projectDefenceConfirmEvent() {
        if (this.projectNameConfirm !== this.project.name) {
          this.$message.error("项目名称与你输入的不匹配")
          return
        }
        this.confirmDefence();
      },
      projectScoreSubmitEvent(e) {
        e.preventDefault()
        // 检查数据
        console.log(this.projectScore)
        if (this.projectScore.codeQualityScore == null || this.projectScore.defenceScore == null) {
          this.projectScore.errorMsg = "分数不能为空，请检查后重新输入"
          return
        }
        if (this.projectScore.codeQualityScore < 0 || this.projectScore.codeQualityScore > 100) {
          this.projectScore.errorMsg = "代码质量分数需要在0至100之间"
          return
        }
        if (this.projectScore.defenceScore < 0 || this.projectScore.defenceScore > 100) {
          this.projectScore.errorMsg = "答辩得分需要在0至100之间"
          return
        }

        const submit = async () => {
          try {
            this.projectScore.submiting = true
            await this.$stHttp({
              method: 'post',
              url: `/project/${this.$route.query.id}/score`,
              data: {
                codeQualityScore: this.projectScore.codeQualityScore,
                defenceScore: this.projectScore.defenceScore
              }
            })
            // 刷新数据
            await this.getProjectDetails()
            await this.loadScoreData()
          } catch (e) {
            this.projectScore.errorMsg = e.message
          } finally {
            this.projectScore.submiting = false
          }
        }

        submit()
      }
    },
    created() {
      this.init()
    },
    mounted() {
      // 获取最小高度
      const getProjectDetailsContainerMinHeight = () => {
        this.getProjectDetailsContainerMinHeight()
      }
      window.onload = getProjectDetailsContainerMinHeight
      window.onresize = getProjectDetailsContainerMinHeight
      getProjectDetailsContainerMinHeight()
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .project-details-container {
    box-sizing: border-box;
    position: relative;
    background-color: #F3F4F7;
    padding-bottom: 60px;

    .title-container {
      padding-bottom: 50px;
      background-color: white;

      .page-title {
        .font(@size: 30px, @line: 42px, @color: black, @weight: bold);
        padding-top: 48px;
        padding-left: 64px;

        .status {
          .font(16px);

          .icon {
            margin-left: 5px;
            margin-right: 5px;
          }
        }

        .closed {
          color: #52C41A
        }

        .running {
          color: #1890FF;
        }
      }

      .enter-gitlab {
        .absolute();
        top: 54px;
        right: 64px;
      }
    }

    .details-container {
      padding: 32px 32px 0 32px;

      .item-card {
        margin-top: 24px;
      }

      .overview {

        .steps {
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .last-update {
          margin-top: 20px;
          text-align: right;
          opacity: 0.65;
        }

        .project-info-container {

          margin-top: 40px;
          padding: 0 25px;

          .list-item {
            line-height: 2.5em;

            span {
              display: inline-block;
            }
          }
        }

        .audit-container {
          margin-top: 25px;
          padding: 0 25px;
          display: flex;
        }

      }

      .rejected-info {

        .rejected-reason {
          margin-top: 24px;
        }

        .reapply {
          display: block;
          margin-top: 24px;
        }
      }

      .dev-panel {

        .discussion-list {
          margin-top: 32px;
        }

        .manage-button {
          margin-top: 22px;
        }

        .issue-list {
          margin-top: 22px;
        }

        .discuss-item-container {
          display: flex;
          width: 100%;

          .title {
            display: block;
            color: black;
            opacity: 0.65;
            flex: 1;
          }

          .project {
          }
        }
      }

      .download-container {
        margin-top: 47px;
        width: 425px;
        .margin-left-right(auto, auto);

        .select-container {
          display: flex;

          .title {
            .font(@size: 15px, @line: 32px, @opacity: 0.65)
          }

          .select {
            flex: 1;
          }
        }

        .button {
          margin-top: 24px;
          margin-bottom: 30px;
        }
      }
    }
  }

</style>
