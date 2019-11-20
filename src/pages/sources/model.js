import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { pageModel } from 'utils/model'
import { isNil } from 'lodash'
import axios from 'axios'
import api from 'api'

const { querySourcesList, sourceUpdate, getAllTags, addSpiderConfig, createSources, sourceDelete } = api;

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
      const id = yield select(({ sources }) => sources.currentItem)
      const postData = { ...payload, ...id }
      console.log('postData', postData)
      const data = yield call(sourceUpdate, {
        entity: postData
      })
      // const data = yield call(updateUser, newUser)
      if (data.success) {
        yield put({ type: 'query' })
        yield put({ type: 'hideModal' })
      } else {
        throw data.message
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
    *addColumns({ payload }, {call, put, select}) {
      const { columnsCurrentItem } = yield select(_ => _.sources);
      const {
        id,
        siteName,
        siteUrl,
        siteRemark,
        siteRank,
        siteNotifyStatus,
        sourceList
      } = columnsCurrentItem
      const { success, message } = yield call(sourceUpdate, {
        entity: {
          id,
          siteName,
          siteUrl,
          siteRemark,
          siteRank,
          siteNotifyStatus,
          sourceList: payload ? (sourceList ? [...sourceList, ...payload] : payload) : sourceList
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
    },
    *deleteSpiderItem({payload}, { call, put, select}) {
      const { index, original } = payload;
      const {
        id,
        siteName,
        siteUrl,
        siteRemark,
        siteRank,
        siteNotifyStatus,
        sourceList=[]
      } = original
      if (!isNil(index)){
        sourceList.splice(index, 1)
      }
      const { success, message } = yield call(sourceUpdate, {
        entity: {
          id,
          siteName,
          siteUrl,
          siteRemark,
          siteRank,
          siteNotifyStatus,
          sourceList
        }
      })

      if ( success ) {
        yield put({ type: 'query' })
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
