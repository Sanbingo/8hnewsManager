import axios from 'axios'
import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { queryCooperateList, createCooperate } = api

export default {
  namespace: 'administrator',
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
        if (pathMatchRegexp('/administrator', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.administrator);
      const { current, pageSize } = pagination
      const data = yield call(queryCooperateList, {
        pageSize: 10,
        pageNum: current,
        entity: {
          ...searchForm,
        }
      })
      if (data) {
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
      console.log('pd', payload)
      const data = yield call(createCooperate, payload)
      // const data = yield axios({
      //   url: 'http://139.196.86.217:8088/info/cooperate/add',
      //   method: 'post',
      //   headers: { 'content-type': 'application/json' },
      //   data: JSON.stringify({
      //     entity: {
      //       ...payload,
      //     },
      //   }),
      // })
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
