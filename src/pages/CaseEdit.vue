<template>
  <Page>
    <div class="page-title">编辑案例</div>
    <CaseForm ref="caseForm" v-if="renderForm" :form-data="editCaseForm" :loading="loading" @preview="preview" @submit="submit"></CaseForm>
  </Page>
</template>

<script>
  import Page from '@/components/Page'
  import CaseForm from '@/components/CaseForm'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'CaseEdit',
    data() {
      return {
        renderForm: false,
        isSubmitted: false,
        loading: false
      }
    },
    components: {
      Page, CaseForm
    },
    computed: {
      ...mapState(['editCaseForm', 'userInfo'])
    },
    methods: {
      ...mapActions(['getCaseDetails', 'getUserInfo']),
      preview() {
        this.$router.push({path: '/case/preview'})
      },
      submit(e) {
        e.preventDefault();
        const form = this.$refs.caseForm.form
        form.validateFields((err, fieldsValue) => {
          if (err) return
          this.loading = true
          /**
           * TODO: 可以根据原有数据做判断，有条件的传到后端
           */
          const submit = async () => {
            try {
              fieldsValue['id'] = this.$route.query.id
              await this.$stHttp({
                method: 'post',
                url: '/case/edit',
                data: fieldsValue
              })
              this.isSubmitted = true
              this.$store.commit('saveEditCaseForm', null)
              this.$router.push({
                path: '/case/view',
                query: {
                  id: this.$route.query.id
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
    watch: {
      editCaseForm(newValue, oldValue) {
        console.log(`Updating from ${oldValue} to ${newValue}`)
        if (newValue != null) {
          console.log('new value is not null')
          this.renderForm = true
        }
      }
    },
    mounted() {
      console.log('mounted')
      if (!this.editCaseForm) {
        console.log('>>> 无数据')
        this.getCaseDetails(this.$route.query.id)
      }

      if (!this.userInfo) {
        this.getUserInfo()
      }

      if (this.editCaseForm.author !== this.userInfo.username) {
        this.$router.push({
          path: '/error',
          query: {
            subTitle: '你无权编辑此页面'
          }
        })
      } else {
        this.renderForm = true
      }
    },
    beforeDestroy() {
      // 暂存结果
      if (this.isSubmitted) return
      console.log('暂存结果')
      const form = this.$refs.caseForm.form
      let editCaseForm = this.editCaseForm
      // 将form表单中修改过得信息重新存入editCaseForm
      const formData = form.getFieldsValue()
      for (let item in formData) {
        editCaseForm[item] = formData[item]
      }
      this.$store.commit('saveEditCaseForm', editCaseForm)
    }
  }
</script>
