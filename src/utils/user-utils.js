import store from '@/store/index'
import crypto from 'crypto'
import constants from './constants-utils'

export default {
  getRole() {
    const userInfo = store.state.userInfo
    if (userInfo == null || userInfo['roles'] === undefined) {
      return ''
    }
    const role = userInfo['roles'][0]
    switch (role) {
      case 'student':
        return constants.role.STUDENT
      case 'tutor':
        return constants.role.TUTOR
    }
  },
  getAvatar() {
    const userInfo = store.state.userInfo
    if (userInfo == null || userInfo['email'] === undefined) {
      return ''
    }
    const email = userInfo['email']
    const md5 = crypto.createHash('md5')

    const emailMd5 = md5.update(email).digest('hex')
    return `https://secure.gravatar.com/avatar/${emailMd5}?s=400&default=identicon&rating=g`
  }
}
