<template>
  <Page>
    <div class="page-title">新建案例</div>

    <CaseForm ref="caseForm" :form-data="caseForm" :loading="false" @preview="preview" @submit="submit" />
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import CaseForm from '@/components/CaseForm'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        isSubmitted: false,
        loading: false
      }
    },
    components: {
      Page,
      CaseForm
    },
    computed: {
      ...mapState(['caseForm'])
    },
    methods: {
      preview() {
        this.$router.push({path: '/case/preview'})
      },
      submit(e) {
        e.preventDefault()
        const form = this.$refs.caseForm.form
        form.validateFields((err, fieldsValue) => {
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
              this.$message.error(e.message)
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
      const form = this.$refs.caseForm.form
      let caseForm = form.getFieldsValue()
      this.$store.commit('saveCaseForm', caseForm)
      console.log(caseForm)
    }
  }
</script>
