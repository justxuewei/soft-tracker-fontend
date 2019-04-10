<template>
  <Page>
    <div class="page-title">新建案例</div>

    <a-form class="form-container" :form="form">
      <a-form-item label="案例标题" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input v-decorator="['title', {rules: [
        { required: true, message: '案例标题是必须的' },
        { max: 50, message: '最大长度为50个字符'}]}]" placeholder="最大长度为50个字符"/>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
        案例简介&nbsp;
        <a-tooltip title="案例简介将展示在案例列表中，请填入案例的特色以及简要介绍。">
          <a-icon type="question-circle-o"/>
        </a-tooltip>
      </span>
        <a-input type="textarea" v-decorator="['briefIntro', {rules: [{required: true, message: '案例简介是必须的'},
        {max: 300, message: '最大长度为300个字符'}]}]" placeholder="最大长度为300个字符" :autosize="{ minRows: 3 }"/>
      </a-form-item>

      <a-form-item label="案例正文" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input type="textarea" v-decorator="['content', {rules: [{required: true, message: '案例正文是必须的'}]}]"
                 placeholder="支持Markdown语法" :autosize="{ minRows: 14}"/>
        <div>
          <a-button class="preview-button" @click="mdPreview">Markdown预览</a-button>
          <div class="clear"></div>
        </div>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="演示地址">
        <a-input v-decorator="['demoUrl', {rules: [{max: 200, message: '最大长度为200个字符'}]}]" placeholder="最大长度为200个字符"/>
      </a-form-item>

      <a-form-item label="案例标签" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select v-decorator="['tags']" mode="tags" placeholder="请使用回车或者英文句号分割" :tokenSeparators="[',']" />
      </a-form-item>

      <a-form-item :wrapper-col="{span: 21}">
        <div>
          <a-button class="submit-button" type="primary" html-type="submit" @click="submit" :loading="loading">提交</a-button>
          <div class="clear"></div>
        </div>
      </a-form-item>

    </a-form>
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import AFormItem from 'ant-design-vue/es/form/FormItem'

  export default {
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, {
          mapPropsToFields: () => {
            const caseForm = this.$store.state.caseForm
            if (caseForm == null) return
            return {
              title: this.$form.createFormField({
                value: caseForm['title']
              }),
              tags: this.$form.createFormField({
                value: caseForm['tags']
              }),
              briefIntro: this.$form.createFormField({
                value: caseForm['briefIntro']
              }),
              content: this.$form.createFormField({
                value: caseForm['content']
              }),
              demoUrl: this.$form.createFormField({
                value: caseForm['demoUrl']
              })
            }
          }
        }),
        labelCol: {span: 5},
        wrapperCol: {span: 16},
        isSubmitted: false,
        loading: false
      }
    },
    components: {
      AFormItem,
      Page
    },
    methods: {
      mdPreview() {
        this.$router.push({path: '/case/preview'})
      },
      submit(e) {
        e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return
          }
          this.loading = true
          const submit = async () => {
            try {
              await this.$stHttp({
                method: 'post',
                url: '/case',
                data: fieldsValue
              })
              // 不需要暂存结果，参见beforeDestroy()
              this.isSubmitted = true
              this.$router.push({
                path: '/success',
                query: {
                  pageTitle: '新建案例',
                  title: '提交成功',
                  subTitle: '案例已经成功提交',
                  buttonTitle: '返回案例列表',
                  redirectPath: '/case/my'
                }
              })
            } catch (e) {
              this.$message.error(e)
            } finally {
              this.loading = false
            }
          }

          submit()
        })
      }
    },
    beforeDestroy() {
      // 暂存结果
      if (this.isSubmitted) return
      console.log('>>> 暂存结果')
      let caseForm = this.form.getFieldsValue()
      this.$store.commit('saveCaseForm', caseForm)
      console.log(caseForm)
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

  .form-container {
    margin-top: 53px;
    width: 60%;
    .horizontal-center;

    .preview-button {
      .float(right);
      margin-top: 16px;
    }

    .submit-button {
      .float(right);
    }

  }
</style>
