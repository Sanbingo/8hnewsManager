import { message } from 'antd'
import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { queryTagsList, createTags } = api

export default {
  namespace: 'tags',
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
        if (pathMatchRegexp('/tags', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.tags);
      const { current, pageSize } = pagination
      const { data, success } = yield call(queryTagsList, {
        pageSize: 10,
        pageNum: current,
        entity: {
          ...searchForm,
        }
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
      } else {
        message.error(data.message)
      }
    },
    *create({ payload }, { call, put }) {
      const { success, message } = yield call(createTags, { entity: { ...payload }})
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
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        message.error(message)
        // throw data
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
