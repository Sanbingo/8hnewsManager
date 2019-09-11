import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import request from 'utils/request'
import axios from 'axios'
import api from 'api'

const { querySourcesList, addColumnsData, getAllTags, addSpiderConfig } = api;

export default modelExtend(pageModel, {
  namespace: 'sources',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    columnsModalvisible: false,
    columnsCurrentItem: {},
    columnsModalType: 'create',
    spiderModalvisible: false,
    spiderCurrentItem: {},
    spiderModalType: 'create',
    searchForm: {},
    pagination: {
      current: 1,
      pageSize: 10
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/sources', location.pathname)) {
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
    *query({ payload = {}}, { call, put, select }) {
      const { searchForm, pagination } = yield select(_ => _.sources);
      const { current, pageSize } = pagination
      const {data, success } = yield call(querySourcesList, {
        pageSize: 10,
        pageNum: current,
        entity: {
          ...searchForm
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
      // const postData = []
      // postData.push(payload)
      const data = yield axios({
        url: 'http://139.196.86.217:8088/info/site/add',
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify({
          entity: {
            ...payload,
          },

        }),
      })
      if (data.status === 200) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ sources }) => sources.currentItem.id)
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
    *addColumns({ payload }, {call, put, select}) {
      const { columnsCurrentItem } = yield select(_ => _.sources);
      const {
        id,
        siteName,
        siteUrl,
        siteRemark,
        siteRank,
        siteNotifyStatus
      } = columnsCurrentItem
      const { success, message } = yield call(addColumnsData, {
        entity: {
          id,
          siteName,
          siteUrl,
          siteRemark,
          siteRank,
          siteNotifyStatus: 1,
          ...payload
        }
      })

      if ( success ) {
        yield put({ type: 'query' })
        yield put({ type: 'columnsHideModal' })
      } else {
        console.log('err', message)
      }
    },
    *spiderConfig({payload}, {call, put, select}) {
      const { spiderCurrentItem } = yield select( _ => _.sources)
      const { siteId, siteSourceId } = spiderCurrentItem
      const { success, message} = yield call(addSpiderConfig, {
        entity: {
          siteId,
          siteSourceId,
          ...payload
        }
      })
      if (success) {
        yield put({ type: 'query' })
        yield put({ type: 'spiderHideModal' })
      } else {
        console.log('err', message)
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
    columnsShowModal(state, { payload }) {
      return { ...state, ...payload, columnsModalVisible: true }
    },
    columnsHideModal(state) {
      return { ...state, columnsModalVisible: false }
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
    changeSearchForm(state, { payload }) {
      return {
        ...state,
        searchForm: {
          ...state.searchForm,
          ...payload
        }
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
