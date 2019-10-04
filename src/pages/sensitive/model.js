import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { querySensitiveList, createSensitive, updateSensitive } = api

export default {
  namespace: 'sensitive',
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
        if (pathMatchRegexp('/sensitive', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.sensitive);
      const { current, pageSize } = pagination
      const { data, success } = yield call(querySensitiveList, {
        pageSize: 10,
        pageNum: current,
        entity: {
          sensitiveWordsStatus: searchForm.sensitiveWordsStatus,
        },
        queryKey: searchForm.queryKey
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
      const data = yield call(createSensitive, {
        entity: {
          ...payload
        }
      })
      if (data.success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
    *update({ payload }, { call, put, select }) {
      const { currentItem } = yield select(_ => _.sensitive)
      const data = yield call(updateSensitive, {
        entity: {
          id: currentItem.id,
          ...payload
        }
      })
      if (data.success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    }
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
