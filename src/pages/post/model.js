import modelExtend from 'dva-model-extend'
import api from 'api'
import { pathMatchRegexp } from 'utils'
import md5 from 'md5'
import jsonp from 'jsonp'
import request from 'utils/request'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import {
  YOUDAO_URL,
  APP_KEY,
  APP_SECRET,
  MAX_CONTENT_LENGTH,
  ERROR_CODE
} from './consts'

const { queryPostList, searchKeyWord } = api

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

// const bdPicFetch = (keyword, config={}) => {
//   const url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' + keyword + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' + keyword + '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=30&rn=30';
//   const obj = {
//     url,
//     method: 'get'
//   }
//   return new Promise((resolve, reject) => {
//     request(obj, (err, res, body) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(JSON.parse(body))
//       }
//     })
//   })
// }

export default modelExtend(pageModel, {
  namespace: 'post',

  state: {
    currentItem: {},
    modalVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/post', location.pathname)) {
          dispatch({
            type: 'query',
            payload: {
              status: 2,
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {}, pageNum, pageSize }, { call, put }) {
      const data = yield request({
        url: 'http://139.196.86.217:8089/info/spider/result/groupList',
        method: 'post',
        data: {
          pageSize: pageSize || 200,
          pageNum: pageNum || 1,
          entity: {
            ...payload,
          }
        },
      })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 20,
              total: data.pageInfo.total,
            },
          },
        })
      }
    },
    *expanded({ payload = '' }, { call, put }) {
      const data = yield request({
        url: 'http://139.196.86.217:8089/info/spider/result/detailList',
        method: 'post',
        data: {
          pageSize: 20,
          pageNum: 1,
          entity: {
            downloadId: payload,
          }
        },
      })
      if (data) {
        yield put({
          type: 'expandedSuccess',
          payload: {
            [payload]: {
              list: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 20,
                total: data.pageInfo.total,
              },
            }
          },
        })
      }
    },
    *detail({payload}, { call, put }){
      if (payload) {
        const data = yield request({
          url: 'http://139.196.86.217:8089/info/spider/result/detail',
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
          // 翻译操作，暂时注释，误删
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
      const titleReq = jsonpFetch(payload.title);
      const contentReq = jsonpFetch(payload.content);
      const [titleRes, contentRes] = yield Promise.all([titleReq, contentReq])
      yield put({
        type: 'translateSuccess',
        payload: {
          'title': titleRes.errorCode === '0' ?
            titleRes && titleRes.translation && titleRes.translation[0] : `Error: ${ERROR_CODE[titleRes.errorCode]}`,
          'content': contentRes.errorCode === '0' ? contentRes && contentRes.translation && contentRes.translation[0] : `Error: ${ERROR_CODE[contentRes.errorCode]}`
        }
      })
    },
    *search({ payload }, { call, put}) {
      const keyword = payload.keyword || ''
      if (keyword) {
        // 前端请求会出现CORS，故采用node代理
        // const data = yield bdPicFetch(keyword)
        const data = yield call(searchKeyWord, payload)
        console.log('data', data)
        // console.log('search result: .....', data.data)
        // const result = eval("("+data.data+")")
        // console.log('result', result)
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
    expandedSuccess(state, { payload }) {
      return {
        ...state,
        expandData: {
          ...state.expandData,
          ...payload,
        }
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
    }
  }
})
