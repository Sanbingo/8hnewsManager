import { pathMatchRegexp } from 'utils'
import api from 'api'
import { message } from 'antd'
const  { querySiteList, createSite, updateSite, deleteSite, queryEmployeeList, verifyConnect } = api

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
    *verify({ payload }, { call, put }) {
      const ret = yield call(verifyConnect, {
        entity: { id: payload }
      })
      const { success, status } = ret;

      if (success) {
        message.success('连接成功~')
      } else {
        message.warning('连接失败~')
      }
    },
    *bindUpdate({ payload }, { call, put, select}) {
      const { bindCurrentItem } = yield select(_ => _.site);
      const {
        id,
        dstSiteUrl,
        dstSiteName,
        dstSiteRootAcc,
        dstSiteRootPwd,
        dstSiteSyncType,
        dstSiteSyncHost,
        dbUser,
        dbPwd,
        dbAddress,
        dbPort,
        dbName,
        dbPrefix,
      } = bindCurrentItem
      const { success, message } = yield call(updateSite, {
        entity: {
          id,
          dstSiteUrl,
          dstSiteName,
          dstSiteRootAcc,
          dstSiteRootPwd,
          dstSiteSyncType,
          dstSiteSyncHost,
          dbUser,
          dbPwd,
          dbAddress,
          dbPort,
          dbName,
          dbPrefix,
          users: payload
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'bindHideModal' })
      } else {
        throw message
      }
    },
    *update({ payload }, { call, put, select}) {
      const { currentItem } = yield select(_ => _.site);
      const {
        id,
        users,
      } = currentItem
      const {
        dstSiteUrl,
        dstSiteName,
        dstSiteRootAcc,
        dstSiteRootPwd,
        dstSiteSyncType,
        dstSiteSyncHost,
        dbUser,
        dbPwd,
        dbAddress,
        dbPort,
        dbName,
        dbPrefix,
      } = payload

      const { success, message } = yield call(updateSite, {
        entity: {
          id,
          users: users ? users : [],
          dstSiteUrl,
          dstSiteName,
          dstSiteRootAcc,
          dstSiteRootPwd,
          dstSiteSyncType,
          dstSiteSyncHost,
          dbUser,
          dbPwd,
          dbAddress,
          dbPort,
          dbName,
          dbPrefix
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw message
      }
    },
    *delete({ payload }, { call, put}) {
      const { success, message } = yield call(deleteSite, {
        entity: {
          id: payload
        }
      })
      if (success) {
        yield put({ type: 'query' })
        message.success('删除成功~')
      } else {
        message.warning('删除失败~')
      }
    },
    *employees({payload}, { call, put, select}) {
      const { employPagination, bindCurrentItem } = yield select(_ => _.site);
      const { current, pageSize } = employPagination
      const { data, success } = yield call(queryEmployeeList, {
        pageSize: 100,
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
        // 映射站点与用户关系
        const employees = data.data;
        const usersArr = (bindCurrentItem && bindCurrentItem.users) || []
        const selectKeys = []
        employees.forEach((item, index) => {
          if (usersArr.some(user => user.userId === item.id)) {
            selectKeys.push(index)
          }
        })
        yield put({
          type: 'site/selectKeys',
          payload: selectKeys
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
      return {
        ...state,
        bindModalVisible: false,
        selectKeys: []
      }
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
    selectKeys(state, { payload }) {
      return {
        ...state,
        selectKeys: payload
      }
    }
  }
}
