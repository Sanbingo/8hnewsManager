import api from 'api'
import { pathMatchRegexp } from 'utils'
import md5 from 'md5'
import jsonp from 'jsonp'
import request from 'utils/request'
import moment from 'moment'
import { message } from 'antd'
import {
  APP_KEY,
  APP_SECRET,
  MAX_CONTENT_LENGTH,
  YOUDAO_ERROR_CODE
} from './consts'

const { queryBaseData, searchKeyWord, createWordPressPosts, allSourcesList, infoConstantMap,
  infoSpiderResultGroupList,
  infoSpiderResultDetailList,
  infoSpiderResultDetail,
} = api

const serialize = (obj) => {
  return Object.keys(obj).reduce((a, k) => {
    a.push(`${k}=${encodeURIComponent(obj[k])}`)
    return a
  }, []).join('&')
}
const jsonpFetch = (value, options=null) => {
  const salt = (new Date).getTime();
  const query = value.length > MAX_CONTENT_LENGTH ? value.slice(0, MAX_CONTENT_LENGTH): value
  const str = APP_KEY+query+salt+APP_SECRET
  const params = {
    q: query,
    appKey: APP_KEY,
    from: 'en',
    to: 'zh-CHS',
    sign: md5(str),
    salt,
  }
  const url = `http://openapi.youdao.com/api?${serialize(params)}`;
  return new Promise((resolve, reject) => {
    jsonp(url, options, (err, data) => err ? reject(err) : resolve(data))
  })
}

export default {
  namespace: 'spider',

  state: {
    currentItem: {},
    modalVisible: false,
    searchForm: {
      spiderDetailStatus: '0'
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/spider', location.pathname)) {
          dispatch({
            type: 'init',
            payload: {}
          })
          dispatch({
            type: 'allSources',
            payload: {}
          })
        }
      })
    },
  },

  effects: {
    *init({ payload = {}}, { call, put}) {
      const { success, data } = yield call(infoConstantMap, { entity: payload})
      if (success) {
        yield put({
          type: 'initSuccess',
          payload: {
            initData: data.data
          }
        })
        yield put({
          type: 'query',
          payload: {}
        })
      }
    },
    *allSources({payload}, { call, put}) {
      const { data, success, message } = yield call(allSourcesList, {
        entity: {}
      })
      if (success) {
        yield put({
          type: "allSourcesSuccess",
          payload: data.data
        })
      } else {
        console.log('get all sources error', message)
        throw message;
      }
    },
    *query({ payload = {}, pageNum, pageSize }, { call, put }) {
      const result = yield call(infoSpiderResultGroupList, {
        pageSize: pageSize || 10,
        pageNum: pageNum || 1,
        entity: {
          ...payload,
          ymd: payload.ymd && moment(payload.ymd).format('YYYY-MM-DD')
        }
      })
      if (result.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: result.data.data,
            pagination: {
              current: pageNum || 1,
              pageSize: pageSize || 10,
              total: result.data.pageInfo.total,
            },
          },
        })
      }
    },
    *base({ payload = {}}, { call, put}) {
      const data = yield call(queryBaseData, payload)
      if (data.statusCode === 200) {
        yield put({
          type: 'baseSuccess',
          payload: {
            categories: data.list
          }
        })
      }

    },
    *create({ payload = {}}, { call, put}) {
      console.log('create posts....')
      const data = yield call(createWordPressPosts, {})
      console.log('posts data', data)
      if (data.statusCode === 200) {

      }
    },
    *expanded({ payload = '', pageNum, pageSize }, { call, put, select }) {
      const { searchForm: { spiderDetailStatus } } = yield select(_ => _.spider)
      const result = yield call(infoSpiderResultDetailList, {
        pageSize: pageSize || 10,
        pageNum: pageNum || 1,
        entity: {
          downloadId: payload,
          spiderDetailStatus
        }
      })
      if (result.success) {
        yield put({
          type: 'expandedSuccess',
          payload: {
            [payload]: {
              list: result.data.data,
              pagination: {
                total: result.data.pageInfo.total,
              },
            }
          },
        })
      }
    },
    *detail({payload}, { call, put }){
      if (payload) {
        const result = yield call(infoSpiderResultDetail, {
          entity: {
            ...payload,
          }
        });
        if (result.success) {
          yield put({
            type: 'detailSuccess',
            payload: {
              detail: result.data
            }
          })
          // 翻译操作，暂时注释，勿删
          // yield put({
          //   type: 'translate',
          //   payload: data.data
          // })
        }
      }
    },
    *translate({ payload }, { call, put}) {
      // const salt = (new Date).getTime();
      // const query = payload.value
      // const str = APP_KEY+query+salt+APP_SECRET
      // const params = {
      //   q: query,
      //   appKey: APP_KEY,
      //   from: 'en',
      //   to: 'zh-CHS',
      //   sign: md5(str),
      //   salt,
      // }
      // const url = `http://openapi.youdao.com/api?${serialize(params)}`;
      // 标题翻译
      const titleReq = jsonpFetch(payload.title);
      // 正文翻译，由于正文篇幅过长，分段翻译
      const contentArr = payload.content.split('\r\n');
      const contentArrReq = contentArr.filter(item => !!item).map(item => jsonpFetch(item));
      const [titleRes, ...contentRes] = yield Promise.all([titleReq, ...contentArrReq])
      const results = contentRes.map(item => {
        if (item.errorCode === '0') {
          return item && item.translation && item.translation[0];
        } else {
          return `#####Error: ${YOUDAO_ERROR_CODE[item.errorCode]}#####\r\n${item.query}`
        }
      })
      yield put({
        type: 'translateSuccess',
        payload: {
          'title': titleRes.errorCode === '0' ?
            titleRes && titleRes.translation && titleRes.translation[0] : `Error: ${YOUDAO_ERROR_CODE[titleRes.errorCode]}`,
          'content': results.join('<br /><br />')
        }
      })
    },
    *search({ payload }, { call, put}) {
      const keyword = payload.keyword || ''
      if (keyword) {
        // 前端请求会出现CORS，故采用node代理
        // const data = yield bdPicFetch(keyword)
        const data = yield call(searchKeyWord, payload)
        yield put({
          type: 'searchSuccess',
          payload: {
            search: data.data
          }
        })
      } else {
        message.warning('关键字不能为空！')
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
    searchChange(state, { payload }) {
      return {
        ...state,
        searchForm: {
          ...state.searchForm,
          ...payload
        }
      }
    },
    formChange(state, { payload }) {
      return {
        ...state,
        translation: {
          ...state.translation,
          ...payload
        }
      }
    },
    openUpload(state, {payload}) {
      return {
        ...state,
        ...payload,
        uploadVisible: true
      }
    },
    closeUpload(state, { payload }) {
      return {
        ...state,
        ...payload,
        uploadVisible: false
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
    expandedSuccess(state, { payload }) {
      return {
        ...state,
        expandData: {
          ...state.expandData,
          ...payload,
        }
      }
    },
    subPaginationChange(state, {payload}) {
      return {
        ...state,

      }
    },
    detailSuccess(state, { payload}) {
      return {
        ...state,
        ...payload
      }
    },
    translateSuccess(state, { payload }) {
      return {
        ...state,
        translation: {
          ...payload
        }
      }
    },
    searchSuccess(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    baseSuccess(state, { payload }) {
      return {
        ...state,
        base: {
          ...payload
        }
      }
    },
    initSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    allSourcesSuccess(state, { payload = []}) {
      return {
        ...state,
        allSources: payload
      }
    }
  }
}
