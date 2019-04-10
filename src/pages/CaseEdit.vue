<template>
  <Page>
    <div v-if="error" style="padding-top: 100px">
      <a-alert style="width: 60%; margin: auto"
        message="出错啦"
        :description="errorMsg"
        type="error"
        showIcon
      />
    </div>
    <div v-else>
      <div class="page-title">编辑案例</div>
      <CaseForm v-if="renderForm" :form-data="editCaseForm" :loading="false"></CaseForm>
    </div>
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
        error: false,
        errorMsg: '',
        renderForm: false
      }
    },
    components: {
      Page, CaseForm
    },
    computed: {
      ...mapState(['editCaseForm', 'userInfo'])
    },
    methods: {
      ...mapActions(['getCaseDetails', 'getUserInfo'])
    },
    watch: {
      editCaseForm(newValue, oldValue) {
        console.log(`Updating from ${oldValue} to ${newValue}`);
        if (newValue != null) {
          this.renderForm = true
        }
      }
    },
    created() {
      if (!this.editCaseForm) {
        console.log(">>> 无数据")
        this.getCaseDetails(this.$route.query.id)
      }

      if (!this.userInfo) {
        this.getUserInfo()
      }

      if (this.editCaseForm.author !== this.userInfo.username) {
        this.error = true
        this.errorMsg = '你无权编辑该案例'
        return false
      }
    }
  }
</script>

<style lang="less">
  @import "../style/common";
  @import "../style/mixin";

</style>
