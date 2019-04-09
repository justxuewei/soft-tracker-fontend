import STHttp from './st-http'
import GitlabHttp from './gitlab-http'

const install = Vue => {
  if (install.installed)
    return;
  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    $stHttp: {
      get() {
        return STHttp
      }
    },
    $gitlabHttp: {
      get() {
        return GitlabHttp
      }
    }
  })
}

export default install
