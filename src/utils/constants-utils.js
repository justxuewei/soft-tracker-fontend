export default {
  /**
   * soft tracker域名前缀
   * @returns {string}
   */
  softTrackerHostPrefix() {
    if (process.env.NODE_ENV === 'production') {
      return ''
    } else {
      return 'http://localhost:8080'
    }
  },
  /**
   * softTracker的OAuth Headers需要携带的Authorization
   * @returns {string}
   */
  softTrackerOAuthAuthorization() {
    if (process.env.NODE_ENV === 'production') {
      return ''
    } else {
      return 'Basic NTExNzA2ODk3NTIzMjU0MTc0NzgzOkI5N1J5OXE2Q2Nld0YzMTI='
    }
  },
  /**
   * gitlab api域名前缀
   * @returns {string}
   */
  gitlabAPIPrefix() {
    return `${this.gitlabHostPrefix()}/api/v4`
  },
  gitlabHostPrefix() {
    if (process.env.NODE_ENV === 'production') {
      return ''
    } else {
      return 'http://192.168.56.101';
    }
  },
  role: {
    TUTOR: '导师',
    STUDENT: '学生'
  },
  projectRole: {
    member: '成员',
    master: '组长',
    tutor: '导师'
  },
  projectStatus: {
    applying: '审核中',
    rejected: '已驳回',
    developing: '开发中',
    defending: '答辩中',
    closed: '已结题'
  }
}
