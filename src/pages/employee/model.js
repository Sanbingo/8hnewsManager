import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { queryEmployeeList, createEmployee, deleteEmployee } = api

export default {
  namespace: 'employee',
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
        if (pathMatchRegexp('/employee', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.employee);
      const { current, pageSize } = pagination
      const {data, success} = yield call(queryEmployeeList, {
        pageSize: 10,
        pageNum: current,
        // entity: {
        //   ...searchForm,
        // }
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
      const {data, success} = yield call(createEmployee, {
        entity: { ...payload }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
    *delete({ payload }, { call, put }) {
      const {data, success} = yield call(deleteEmployee, {
        entity: { ...payload }
      })
      if (success) {
        yield put({ type: 'query' })
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
