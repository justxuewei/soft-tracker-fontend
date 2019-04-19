<template>
  <Page>
    <div class="page-title">重新申报</div>
    <a-form v-if="!initializing" class="form-container" :form="form">

      <a-alert
        message="申报表"
        description="申报提交后将交由相应导师审核，最终导师将接受或拒绝申报，请仔细核查申报书格式及其内容。"
        type="info"
        showIcon
      />

      <a-form-item label="项目名称" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 28px">
        <a-input v-decorator="['name', {rules: [{max: 50, message: '最大长度为50个字符'}]}]" placeholder="最大长度为50个字符"/>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申报类别">
        <a-radio-group v-decorator="['type']">
          <a-radio-button value="college">学院项目</a-radio-button>
          <a-radio-button value="enterprise">校企合作项目</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="指导教师" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 28px">
        <a-input v-decorator="['tutorName']" disabled/>
      </a-form-item>

      <a-form-item label="案例名称" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 28px">
        <a-input v-decorator="['caseTitle']" disabled/>
      </a-form-item>

      <a-form-item
        :label-col="labelCol" :wrapper-col="wrapperCol"
        label="添加成员"
      >
        <a-select
          v-decorator="['members']"
          mode="multiple"
          placeholder="请输入"
          @search="memberSearchEvent"
          @change="memberChangeEvent"
          :notFoundContent="searching ? undefined : null"
        >

          <a-spin v-if="searching" slot="notFoundContent" size="small"/>
          <a-select-option
            v-for="u in userSearchList" :key="u.optText" :data-id="u.id">
            {{u.optText}}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label-col="labelCol" :wrapper-col="wrapperCol"
        label="申报书"
        extra="支持拓展名：.doc、.docx、.pdf、.zip"
      >
        <a-upload
          v-decorator="['upload', {
          valuePropName: 'fileList',
          getValueFromEvent: normFile,
        }]"
          :action="uploadAction"
          :headers="uploadHeaders"
          list-type="text"
          :beforeUpload="beforeUpload"
        >
          <a-button style="margin-bottom: 5px">
            <a-icon :type="uploading ? 'loading' : 'upload'"/>
            上传文件
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{span: 24}">
        <div>
          <a-button class="submit-button" type="primary" html-type="submit" @click="submitEvent" :loading="loading">提交
          </a-button>
          <div class="clear"></div>
        </div>
      </a-form-item>
    </a-form>
  </Page>
</template>

<script>

  import Page from '@/components/Page'
  import constants from '@/utils/constants-utils'
  import debounce from 'lodash/debounce'

  export default {
    name: 'ProjectReapply',
    data() {
      this.memberSearchEvent = debounce(this.memberSearchEvent, 800)
      return {
        form: null,
        initializing: true,
        loading: false,
        uploading: false,
        searching: false,
        labelCol: {span: 5},
        wrapperCol: {span: 19},
        userSearchList: [],
        selectedMemberIds: [],
        originalData: {
          caseDetails: null,
          projectDetails: null,
          selectedMembersList: null
        }
      }
    },
    methods: {
      init: async (that) => {
        try {
          that.initializing = true
          let res = await that.$stHttp({
            url: `/case/details?caseId=${that.$route.query.cid}`
          })
          const caseDetails = res['data']
          that.originalData.caseDetails = caseDetails

          let initFields = {
            tutorName: that.$form.createFormField({
              value: caseDetails.author
            }),
            caseTitle: that.$form.createFormField({
              value: caseDetails.title
            })
          }

          res = await that.$stHttp({
            url: `/project/${that.$route.query.pid}`
          })
          const projectDetails = res['data']
          that.originalData.projectDetails = projectDetails

          initFields['name'] = that.$form.createFormField({
            value: projectDetails['name']
          })
          initFields['type'] = that.$form.createFormField({
            value: projectDetails['type']
          })

          let __members = []
          let __memberIdsAndDisplayText = {}
          for (let member of projectDetails['members']) {
            if (member['projectRole'] !== 'member') continue
            const __id = member['id']
            const __displayText = member['username'] + `(${member['realname']})`
            __memberIdsAndDisplayText[__displayText] = __id
            __members.push(__displayText)
            that.selectedMemberIds.push(__id)
          }
          that.originalData.selectedMembersList = __memberIdsAndDisplayText
          console.log('that.originalData.selectedMembersList: ', that.originalData.selectedMembersList)
          initFields['members'] = that.$form.createFormField({
            value: __members
          })

          that.form = that.$form.createForm(that, {
            mapPropsToFields: () => {
              return initFields
            }
          })
        } catch (e) {
          console.log(e)
          that.$message.error(e.message)
        } finally {
          that.initializing = false
        }
      },
      /**
       * 列出已经上传的文件
       */
      normFile(e) {
        let data = e.file
        console.log('normFile', data)

        this.uploading = data.status === undefined && data.status === 'uploading'

        if (data.status === undefined) {
          if (data.status === 'error') {
            this.$error({
              title: '上传失败',
              content: data.response.message
            })
          }
          return []
        }
        return [data]
      },
      /**
       * 在上传前检查文件的格式是否合法
       */
      beforeUpload(file) {
        console.log('file: ', file)
        const fileName = file.name
        // 获取后缀
        const index = fileName.lastIndexOf('.')
        const suffix = fileName.substr(index + 1)
        // 允许的后缀为
        const allowedSuffix = ['doc', 'docx', 'pdf', 'zip']
        if (allowedSuffix.indexOf(suffix) === -1) {
          this.$error({
            title: '上传失败',
            content: '文件类型不合法'
          })
          return false
        }
      },
      /**
       * 成员搜索
       */
      memberSearchEvent(v) {
        const search = async (v) => {
          try {
            this.userSearchList = []
            this.searching = true
            const res = await this.$stHttp({
              url: `/user/search_student?username=${v}`
            })
            this.userSearchList = res.data.map(user => ({
              id: user.id,
              text: user.username,
              optText: user.username + `(${user.realname})`
            }))
          } catch (e) {
            this.$message.error(e.message)
          } finally {
            this.searching = false
          }
        }

        search(v)
      },
      /**
       * 修改成员事件
       */
      memberChangeEvent(v, opts) {
        let __ids = []
        console.log('opts: ', opts)
        for (const index in opts) {
          let __key = opts[index].key
          if (this.originalData.selectedMembersList[__key] !== undefined) {
            __key = this.originalData.selectedMembersList[__key]
          } else {
            __key = opts[index].data.attrs['data-id']
          }
          __ids.push(__key)
        }
        this.selectedMemberIds = __ids
        console.log(this.selectedMemberIds)
      },
      /**
       * 提交修改
       */
      submitEvent(e) {
        e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          if (err) return

          // 删除案例标题和指导教师
          delete fieldsValue.caseTitle
          delete fieldsValue.tutorName

          // 检测题目是否改动
          if (fieldsValue['name'] === this.originalData['projectDetails']['name']) {
            delete fieldsValue['name']
          }

          // 检测类别是否改动
          if (fieldsValue['type'] === this.originalData['projectDetails']['type']) {
            delete fieldsValue['type']
          }

          // 检测成员是否改变
          let memberFlag = false
          console.log('fieldsValue[\'members\']: ', fieldsValue['members'])
          console.log('this.selectedMemberIds: ', this.selectedMemberIds)
          for (let optText of fieldsValue['members']) {
            if (this.originalData['selectedMembersList'][optText] === undefined) {
              memberFlag = true
            }
          }

          if (memberFlag) {
            console.log('成员列表更新', this.selectedMemberIds)
            fieldsValue['members'] = this.selectedMemberIds
          } else {
            console.log('成员未更新')
            delete fieldsValue.members
          }

          if (fieldsValue['upload'] !== undefined) {
            fieldsValue['saveName'] = fieldsValue.upload[0].response.data['saveName']
          }
          delete fieldsValue['upload']

          // 增加projectId
          fieldsValue['id'] = this.$route.query.pid

          console.log('fieldsValue', fieldsValue, 'originalData', this.originalData)

          // 提交数据
          const submit = async () => {
            try {
              this.loading = true
              await this.$stHttp({
                method: 'post',
                url: '/project/reapply',
                data: fieldsValue
              })
              this.$router.push({
                path: '/project/details',
                query: {
                  id: this.$route.query.pid
                }
              })
            } catch (e) {
              this.$error({
                title: '提交失败',
                content: e.message
              })
            } finally {
              this.loading = false
            }
          }

          submit()
        })
      }
    },
    computed: {
      uploadAction() {
        return constants.softTrackerHostPrefix() + '/project/application_upload'
      },
      uploadHeaders() {
        return {
          'Authorization': 'bearer' + localStorage.getItem('st_access_token')
        }
      }
    },
    mounted() {
      this.init(this)
    },
    components: {
      Page
    }
  }
</script>

<style lang="less">

  @import "../style/common";
  @import "../style/mixin";

  .form-container {
    margin-top: 53px;
    width: 30%;
    .horizontal-center;

    .submit-button {
      .float(right);
    }

  }

</style>
