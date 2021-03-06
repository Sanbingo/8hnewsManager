import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import request from 'utils/request'
import axios from 'axios'
import api from 'api'

const { querySourcesList, createSources, sourceUpdate, getAllTags, sourceDelete } = api

export default modelExtend(pageModel, {
  namespace: 'news',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    filter: {},
    pagination: {
      current: 1,
      pageSize: 200
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
      const { data, success } = yield call(getAllTags, {});
      if (success) {
        yield put({
          type: 'initialSuccess',
          payload: {
            constant: data.data,
          },
        })
      }
    },
    *query({ payload = {} }, { call, put, select }) {
      const { filter, pagination } = yield select(_ => _.news);
      const { current, pageSize } = pagination
      const {data, success} = yield call(querySourcesList, {
        pageSize: pageSize ||20,
        pageNum: current || 1,
        entity: {
          ...filter
        }
      })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: data.pageInfo.pageNum,
              pageSize: data.pageInfo.pageSize,
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
      const { currentItem } = yield select(_ => _.news);
      const {
        id,
        siteRank,
        siteNotifyStatus,
        sourceList,
      } = currentItem
      const { success, message } = yield call(sourceUpdate, {
        entity: {
          id,
          siteName: payload.siteName,
          siteUrl: payload.siteUrl,
          siteRemark: payload.siteRemark,
          siteRank,
          siteNotifyStatus,
          sourceList
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw message
      }
    },
    *delete({ payload }, { call, put, select }) {
      const {data, success } = yield call(sourceDelete, {
        entity: {
          id: payload
        }
      })
      if (success) {
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
    },
    querySuccess(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    pagination(state, { payload }) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...payload
        }
      }
    },
  },
})
