<template>
  <Page>
    <div class="page-title">项目申报</div>
    <a-form v-if="form != null" class="form-container" :form="form">

      <a-alert
        message="申报表"
        description="申报提交后将交由相应导师审核，最终导师将接受或拒绝申报，请仔细核查申报书格式及其内容。"
        type="info"
        showIcon
      />

      <a-form-item label="项目名称" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 28px">
        <a-input v-decorator="['name', {rules: [
        { required: true, message: '项目名称是必须的' },
        { max: 50, message: '最大长度为50个字符'}]}]" placeholder="最大长度为50个字符"/>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申报类别">
        <a-radio-group v-decorator="['type', {rules: [{required: true, message: '申报类别是必须的'}]}]">
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
          v-decorator="[
          'members',
          {rules: [{required: true, message: '至少要有一位成员'}]}
        ]"
          mode="multiple"
          placeholder="请输入"
          @search="memberSearchEvent"
          @change="memberChangeEvent"
          :notFoundContent="searching ? undefined : null"
        >

          <a-spin v-if="searching" slot="notFoundContent" size="small"/>
          <a-select-option
            v-for="u in userSearchList" :key="u.id" :value="u.text">
            {{u.text}}
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
          rules: [{ required: true, message: '申报书是必要的'}],
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
          <a-button class="submit-button" type="primary" html-type="submit" @click="submit" :loading="loading">提交
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
    name: 'ProjectApply',
    data() {
      this.memberSearchEvent = debounce(this.memberSearchEvent, 800)
      return {
        form: null,
        labelCol: {span: 5},
        wrapperCol: {span: 19},
        uploading: false,
        userSearchList: [],
        loading: false,
        searching: false,
        selectedMemberIds: []
      }
    },
    methods: {
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
              text: user.username
            }))
          } catch (e) {
            this.$message.error(e.message)
          } finally {
            this.searching = false
          }
        }

        search(v)
      },
      memberChangeEvent(v, opts) {
        let __ids = []
        for (const node in opts) {
          __ids.push(opts[node].key)
        }
        this.selectedMemberIds = __ids
        // console.log(this.selectedMemberIds)
      },
      submit(e) {
        e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return
          }
          // 更新上传文件信息
          const saveName = fieldsValue.upload[0].response.data['saveName']
          delete fieldsValue.upload
          fieldsValue.saveName = saveName
          // 更新成员信息
          fieldsValue.members = this.selectedMemberIds
          fieldsValue.caseId = this.$route.query.caseId
          // 删除案例标题和指导教师
          delete fieldsValue.caseTitle
          delete fieldsValue.tutorName
          console.log('fieldsValue: ', fieldsValue)

          const submit = async () => {
            try {
              this.loading = true
              await this.$stHttp({
                method: 'post',
                url: '/project',
                data: fieldsValue
              })
              this.$router.push({
                path: '/success',
                query: {
                  title: '提交成功',
                  subTitle: '项目已经提交成功，请耐心等待导师审核'
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
    components: {
      Page
    },
    created() {
      const getCaseDetails = async () => {
        try {
          const res = await this.$stHttp({
            url: `/case/details?caseId=${this.$route.query.caseId}`
          })
          const caseDetails = res['data']

          this.form = this.$form.createForm(this, {
            mapPropsToFields: () => {
              return {
                tutorName: this.$form.createFormField({
                  value: caseDetails.author
                }),
                caseTitle: this.$form.createFormField({
                  value: caseDetails.title
                })
              }
            }
          })
        } catch (e) {
          this.$message.error(e.message)
        }

      }

      getCaseDetails()
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
