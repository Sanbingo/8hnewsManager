import { pathMatchRegexp } from 'utils'
import api from 'api'
const  {
  querykeysecretList, createkeysecret, updatekeysecret,
  queryKeySecret,
  createKeySecret,
  removeKeySecret,
  latestkeySecret,
} = api

export default {
  namespace: 'keysecret',
  state: {
    list: [],
    modalVisible: false,
    currentItem: {},
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
        if (pathMatchRegexp('/keysecret', location.pathname)) {
          const payload = location.query
          // dispatch({
          //   type: 'initial',
          //   payload: {},
          // })
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
    *query({ payload = {} }, { call, put, select }) {
      const { pagination } = yield select(_ => _.keysecret);
      const { current, pageSize } = pagination
      const { data, success } = yield call(queryKeySecret, {
        pageSize: 10,
        pageNum: current,
        entity: {},
      })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current,
              pageSize,
              total: data.pageInfo.total,
            },
          },
        })
      }
    },
    *create({ payload }, { call, put }) {
      const data = yield call(createKeySecret, {
        entity: {
          ...payload,
          encryptType: 0
        }
      })
      if (data.success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
    *remove({ payload }, { call, put, select }) {
      const data = yield call(removeKeySecret, payload)
      if (data.success) {
        yield put({ type: 'query' })
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
    changeSearchForm(state, { payload }) {
      return {
        ...state,
        searchForm: {
          ...state.searchForm,
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
  }
}
