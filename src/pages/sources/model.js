import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import request from 'utils/request'
import axios from 'axios'

export default modelExtend(pageModel, {
  namespace: 'sources',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/sources', location.pathname)) {
          const payload = location.query
          dispatch({
            type: 'initial',
            payload: {},
          })
          dispatch({
            type: 'query',
            payload: {
              pageNum: 1,
              pageSize: 10,
              ...payload,
            },
          })
        }
      })
    },
  },

  effects: {
    *initial({ payload = {} }, { call, put }) {
      const data = yield request({
        url: 'http://139.196.86.217:8089/info/constant/map',
        method: 'post',
        data: payload,
      })
      if (data) {
        yield put({
          type: 'initialSuccess',
          payload: {
            constant: data.data,
          },
        })
      }
    },
    *query({ payload = {} }, { call, put }) {
      // const data = yield call(querySourcesList, payload)
      const data = yield request({
        url: 'http://139.196.86.217:8089/info/site/queryList',
        method: 'post',
        data: {
          pageSize: 10,
          pageNum: 1,
          ...payload,
        },
      })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
    *create({ payload }, { call, put }) {
      const postData = []
      postData.push(payload)
      const data = yield axios({
        url: 'http://139.196.86.217:8089/info/site/batch/insert',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({
          entities: postData,
        }),
      })
      if (data.status === 200) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ sources }) => sources.currentItem.id)
      const newUser = { ...payload, id }
      // const data = yield call(updateUser, newUser)
      const data = yield axios({
        url: 'http://139.196.86.217:8089/info/site/update',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({
          entity: newUser,
        }),
      })
      if (data.status === 200) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
    *delete({ payload }, { call, put, select }) {
      // const data = yield call(removeUser, { id: payload })

      const data = yield axios({
        url: 'http://139.196.86.217:8089/info/site/batch/hardRemove',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({
          longIds: [payload],
        }),
      })
      if (data.status === 200) {
        yield put({
          type: 'query',
          payload: {},
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
    initialSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
