import api from 'api'
import { pathMatchRegexp } from 'utils'
import request from 'utils/request'
import { message } from 'antd'
import { isNil, isEmpty } from 'lodash'
import moment from 'moment'
// import { youdaoTranslate } from '../common/youdao';
// import { YOUDAO_ERROR_CODE } from '../common/consts'

const { queryBaseData, searchKeyWord, createPosts, transApi, transJinShan, translatePartial } = api

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
        let listTemp = data.data;
        const results = yield call(translatePartial, { list: data.data })
        if (results.success) {
          listTemp = listTemp.map((item, index) => ({
            ...item,
            translate: results.data && results.data[index]
          }))
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: listTemp,
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
    *create({ payload = {}}, { call, put, select}) {
      const { translation={} } = yield select(_ => _.posts)
      const { title, content, categories } = translation
      if (isNil(title)) {
        message.warning('标题不能为空')
        return;
      } else if (isNil(content)) {
        message.warning('内容不能为空')
        return;
      } else if (isEmpty(categories)) {
        message.warning('请选择栏目~')
        return
      }
      const data = yield call(createPosts, {
        ...translation,
        status: payload.status || 'publish'
      })
      if (data.statusCode === 200) {
        message.success('创建成功')
        yield put({
          type: 'posts/hideModal',
        })
        yield put({
          type: 'posts/query'
        })
      } else {
        message.warning('登录信息已过期，请重新登录')
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
          // yield put({
          //   type: 'translate',
          //   payload: data.data
          // })
        }
      }
    },
    *translate({ payload }, { call, put}) {
      // 方法一：使用免费的谷歌API
      // const {data, statusCode} = yield call(transApi, payload)
      // if (statusCode === 200) {
      //   const { title, content} = data
      //   yield put({
      //     type: 'translateSuccess',
      //     payload: {
      //       title,
      //       'content': content.join('<br /><br />')
      //     }
      //   })
      // }

      // 方法二：使用免费的金山词霸
      console.log('payload', payload)
      const {data, statusCode} = yield call(transJinShan, payload)
      if (statusCode === 200) {
        const { title, content} = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            'content': content.join('<br /><br />')
          }
        })
      }

      // 方法三：使用付费的有道API
      /*
      // 标题翻译
      const titleReq = youdaoTranslate(payload.title);
      // 正文翻译，由于正文篇幅过长，分段翻译
      const contentArr = payload.content.split('\r\n');
      const contentArrReq = contentArr.filter(item => !!item).map(item => youdaoTranslate(item));
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
      */
    },
    *search({ payload }, { call, put}) {
      const keyword = payload.keyword || ''
      if (keyword) {
        // 前端请求会出现CORS，故采用node代理
        const { data } = yield call(searchKeyWord, payload)
        const results = Array.isArray(data) ? data : eval('(' + data + ')').data
        yield put({
          type: 'searchSuccess',
          payload: {
            search: results
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
