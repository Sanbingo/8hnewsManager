import api from 'api'
import { pathMatchRegexp } from 'utils'
import md5 from 'md5'
import jsonp from 'jsonp'
import request from 'utils/request'
import { message } from 'antd'
import moment from 'moment'
import {
  APP_KEY,
  APP_SECRET,
  MAX_CONTENT_LENGTH,
  YOUDAO_ERROR_CODE
} from './consts'

const { queryBaseData, searchKeyWord, createWordPressPosts } = api

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
  namespace: 'posts',

  state: {
    currentItem: {},
    modalVisible: false,
    translation: {},
    searchForm: {
      ymd: moment().subtract(1, 'days'),
      spiderDetailBizStatus: '0'
    },
    pagination: {
      current: 1,
      pageSize: 10
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/posts', location.pathname)) {
          dispatch({
            type: 'init',
            payload: {}
          })
          dispatch({
            type: 'base',
            payload: {}
          })
        }
      })
    },
  },

  effects: {
    *init({ payload = {}}, { call, put}) {
      const constMap = yield request({
        url: 'http://139.196.86.217:8089/info/constant/map',
        method: 'post',
        data: payload
      })
      const siteDomains = yield request({
        url: 'http://139.196.86.217:8089/info/site/queryList',
        method: 'post',
        data: { pageNum: 1, pageSize: 100, entity: {}}
      })
      if (constMap && siteDomains) {
        yield put({
          type: 'initSuccess',
          payload: {
            initData: constMap.data,
            siteDomains: siteDomains.data
          }
        })
        yield put({
          type: 'query',
          payload: {}
        })
      }
    },
    *query(payload, { call, put, select }) {
      const { searchForm, pagination } = yield select(_ => _.posts);
      const { current, pageSize } = pagination
      const data = yield request({
        url: 'http://139.196.86.217:8089/info/document/queryList',
        method: 'post',
        data: {
          pageSize,
          pageNum: current,
          entity: {
            ...searchForm,
            ymd: searchForm.ymd && moment(searchForm.ymd).format('YYYY-MM-DD')
          }
        },
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

      const data = yield call(createWordPressPosts, {})
      if (data.statusCode === 200) {

      }
    },
    *detail({payload}, { call, put }){
      if (payload) {
        const data = yield request({
          url: 'http://139.196.86.217:8089/info/document/detail',
          method: 'post',
          data: {
            entity: {
              ...payload,
            }
          },
        });
        if (data) {
          yield put({
            type: 'detailSuccess',
            payload: {
              detail: data.data
            }
          })
          // 翻译操作，暂时注释，勿删
          yield put({
            type: 'translate',
            payload: data.data
          })
        }
      }
    },
    *translate({ payload }, { call, put}) {
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
      return { ...state, modalVisible: true }
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
    }
  }
}
