/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
import config from 'config'
import request from 'utils/request'

const { queryRouteList, logoutUser, queryUserInfo } = api

export default {
  namespace: 'app',
  state: {
    routeList: [
      // {
      //   id: '1',
      //   icon: 'laptop',
      //   name: 'Dashboard',
      //   zhName: '仪表盘',
      //   router: '/dashboard',
      // },
    ],
    locationPathname: '',
    locationQuery: {},
    base: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      // {
      //   title: 'New User is registered.',
      //   date: new Date(Date.now() - 10000000),
      // },
      // {
      //   title: 'Application has been approved.',
      //   date: new Date(Date.now() - 50000000),
      // },
    ],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
      dispatch({ type: 'base' })
    },
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const isInit = store.get('isInit')
      if (isInit) {
        return
      }

      const { locationPathname } = yield select(_ => _.app)

      const userInfo = yield call(queryUserInfo, {
        ...payload,
      })

      const { success, user, permissions} = userInfo;

      if (success) {

        const { list } = yield call(queryRouteList)
        let routeList = list
        if (permissions.role === ROLE_TYPE.ADMIN) {
          permissions.visit = list.map(item => item.id)
        } else {
          routeList = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        store.set('routeList', routeList)
        store.set('permissions', permissions)
        store.set('user', user)
        store.set('isInit', true)
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/dashboard',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },
    *base({ payload }, { call, put}) {
      const constMap = yield request({
        url: 'http://139.196.86.217:8088/info/constant/map',
        method: 'post',
        data: payload || { entity: {}}
      })
      if (constMap) {
        store.set('appkey', '52af186d5198e43e')
        store.set('appSecret', 'e1ZS2jAOEegKln2yxzWRGXFCGU2gPxZX')
          yield put({
            type: 'baseSuccess',
            payload: constMap.data
          })
      }
    },
    *signOut({ payload }, { call, put, select }) {
      const data = yield call(logoutUser)
      if (data.success) {
        store.set('routeList', [])
        store.set('permissions', { visit: [] })
        store.set('user', {})
        store.set('isInit', false)
        // yield put({ type: 'query' })
        const { locationPathname } = yield select(_ => _.app)
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
    baseSuccess(state, { payload }) {
      return {
        ...state,
        base: {
          ...payload
        }
      }
    }
  },
}
