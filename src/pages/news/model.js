import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import request from 'utils/request'
import axios from 'axios'
import api from 'api'

const { querySourcesList, createSources } = api

export default modelExtend(pageModel, {
  namespace: 'news',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    searchForm: {},
    pagination: {
      current: 1,
      pageSize: 10
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/news', location.pathname)) {
          const payload = location.query
          dispatch({
            type: 'initial',
            payload: {},
          })
          dispatch({
            type: 'query',
            payload: {
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
        url: 'http://139.196.86.217:8088/info/constant/map',
        method: 'post',
        data: { entity: payload },
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
    *query({ payload = {}, pageNum, pageSize }, { call, put }) {
      const {data, success } = yield call(querySourcesList, {
        pageSize: 20,
        pageNum: 1,
        entity: {
          ...payload
        }
      })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 20,
              total: data.pageInfo.total,
            },
          },
        })
      }
    },
    *create({ payload }, { call, put }) {
      // const postData = []
      // postData.push(payload)
      const { success, data } = yield call(createSources, {
        entity: {
          ...payload
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ news }) => news.currentItem.id)
      const newUser = { ...payload, id }
      // const data = yield call(updateUser, newUser)
      const data = yield axios({
        url: 'http://139.196.86.217:8088/info/site/update',
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
        url: 'http://139.196.86.217:8088/info/site/hardRemove',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({
          entity:{
            id: payload
          }
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
    spiderShowModal(state, { payload }) {
      return { ...state, ...payload, spiderModalVisible: true }
    },
    spiderHideModal(state) {
      return { ...state, spiderModalVisible: false }
    },
    initialSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    filterChange(state, { payload }) {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...payload
        }
      }
    }
  },
})
