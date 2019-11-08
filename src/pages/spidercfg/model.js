import axios from 'axios'
import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { querySpiderCfgList, updateSpiderCfg } = api

export default {
  namespace: 'spidercfg',
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
        if (pathMatchRegexp('/spidercfg', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.spidercfg);
      const { current, pageSize } = pagination
      const { data, success } = yield call(querySpiderCfgList, {
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
      }
    },
    *update({ payload }, { call, put, select }) {
      const { currentItem } = yield select( _ => _.spidercfg)
      const { siteId, siteSourceId, id } = currentItem
      const { data, success, message } = yield call(updateSpiderCfg, {
        entity: {
          id,
          siteId,
          siteSourceId,
          ...payload
        }
      })

      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        console.log('err', message)
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
