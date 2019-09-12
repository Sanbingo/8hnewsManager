import { pathMatchRegexp } from 'utils'
import api from 'api'
const  { querySiteList, createSite, updateSite, queryEmployeeList } = api

export default {
  namespace: 'site',
  state: {
    list: [],
    modalVisible: false,
    currentItem: {},
    modalType: 'create',
    bindModalVisible: false,
    bindCurrentItem: {},
    bindModalType: 'create',
    searchForm: {},
    pagination: {
      current: 1,
      pageSize: 10
    },
    employPagination: {
      current: 1,
      pageSize: 10
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/site', location.pathname)) {
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
      const { searchForm, pagination } = yield select(_ => _.site);
      const { current, pageSize } = pagination
      const {data, success} = yield call(querySiteList, {
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
    *create({ payload }, { call, put }) {
      const {data, success} = yield call(createSite, {
        entity: { ...payload }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
    *update({ payload }, { call, put, select}) {
      const { bindCurrentItem } = yield select(_ => _.site);
      const {
        id,
        dstSiteUrl,
        dstSiteName,
        dstSiteRootAcc,
        dstSiteRootPwd,
        users,
      } = bindCurrentItem
      const { success, message } = yield call(updateSite, {
        entity: {
          id,
          dstSiteUrl,
          dstSiteName,
          dstSiteRootAcc,
          dstSiteRootPwd,
          users: payload ? (users ? [...users, ...payload] : payload) : users
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'bindHideModal' })
      } else {
        throw message
      }
    },
    *employees({payload}, { call, put, select}) {
      const { employPagination } = yield select(_ => _.site);
      const { current, pageSize } = employPagination
      const { data, success } = yield call(queryEmployeeList, {
        pageSize: 10,
        pageNum: current || 1,
      })
      if (success) {
        yield put({
          type: 'employeeSuccess',
          payload: {
            employees: data.data,
            pagination: {
              current,
              pageSize,
              total: data.pageInfo.total,
            },
          },
        })
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
    bindShowModal(state, { payload }) {
      return { ...state, ...payload, bindModalVisible: true }
    },
    bindHideModal(state) {
      return { ...state, bindModalVisible: false }
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
    employeeSuccess(state, { payload }) {
      const { employees, EmployeePagination } = payload
      return {
        ...state,
        employees,
        EmployeePagination  : {
          ...state.pagination,
          ...EmployeePagination,
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
