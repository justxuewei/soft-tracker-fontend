import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import CaseCreate from '@/pages/CaseCreate'
import CaseMDPreview from '@/pages/CaseMDPreview'
import Success from '@/pages/Success'
import MyCase from '@/pages/MyCase'
import CaseView from '@/pages/CaseView'
import CaseEdit from '@/pages/CaseEdit'
import Case from '@/pages/Case'
import Error from '@/pages/Error'

import constants from '@/utils/constants-utils'
import CaseAll from '@/pages/CaseAll'
import Project from '@/pages/Project'
import ProjectCreation from '@/pages/ProjectCreation'
import RunningProjectList from '@/components/RunningProjectList'
import DiscussList from '@/components/DiscussList'
import ClosedProjectList from '@/components/ClosedProjectList'
import ProjectDetails from '@/pages/ProjectDetails'
import ProjectReapply from '@/pages/ProjectReapply'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'running',
          alias: '',
          component: RunningProjectList,
          meta: {
            title: '面板'
          },
        },
        {
          path: 'discuss',
          component: DiscussList,
          meta: {
            title: '面板'
          }
        },
        {
          path: 'closed',
          component: ClosedProjectList,
          meta: {
            title: '面板'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/success',
      name: 'Success',
      component: Success,
      meta: {
        title: '成功'
      }
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        title: '失败'
      }
    },
    {
      path: '/case',
      name: 'Case',
      component: Case,
      children: [
        {
          path: 'my',
          component: MyCase,
          name: 'MyCase',
          meta: {
            title: '我的案例',
            roles: [constants.role.TUTOR]
          }
        },
        {
          path: 'edit',
          name: 'CaseEdit',
          component: CaseEdit,
          meta: {
            title: '编辑案例',
            roles: [constants.role.TUTOR]
          }
        },
        {
          path: 'view',
          name: 'CaseView',
          component: CaseView,
          meta: {
            title: '案例浏览',
            roles: [constants.role.TUTOR, constants.role.STUDENT]
          }
        },
        {
          path: 'preview',
          name: 'CasePreview',
          component: CaseMDPreview,
          meta: {
            title: '案例正文预览',
            roles: [constants.role.TUTOR]
          }
        },
        {
          path: 'create',
          name: 'CaseCreate',
          component: CaseCreate,
          meta: {
            title: '创建教师案例',
            roles: [constants.role.TUTOR]
          }
        },
        {
          path: 'all',
          name: 'CaseAll',
          component: CaseAll,
          meta: {
            title: '全部案例',
            roles: [constants.role.STUDENT]
          }
        }
      ]
    }, {
      path: '/project',
      name: 'Project',
      component: Project,
      children: [{
        path: 'creation',
        name: 'ProjectCreation',
        component: ProjectCreation,
        meta: {
          title: '项目申报',
          roles: [constants.role.STUDENT]
        }
      }, {
        path: 'details',
        name: 'ProjectDetails',
        component: ProjectDetails,
        meta: {
          title: '项目详情',
        }
      }, {
        path: 'reapply',
        name: 'ProjectReapply',
        component: ProjectReapply,
        meta: {
          title: '项目重新申报',
          roles: [constants.role.STUDENT]
        }
      }
      ]
    }
  ]
})
