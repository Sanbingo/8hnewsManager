import { router, pathMatchRegexp } from 'utils'
import api from 'api'

const { loginUser, getWPToken } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(loginUser, payload)

      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        // 初始化数据
        yield put({
          type: 'app/query',
          payload: {
            ...payload,
            roles: data.data.roles
          }
        })
        // 获取用户的目标站点
        yield put({ type: 'app/allDstDomains' })
        // 获取翻译密钥
        yield put({
          type: 'app/latestkeysecret',
          payload: { entity: { encryptType : 0 } }
        })
        // 获取wp的token
        // yield call(getWPToken, payload)
        if (!pathMatchRegexp('/login', from)) {
          if (['', '/'].includes(from)) router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw data
      }
    },
  },
}
