import api from 'api'
import { pathMatchRegexp } from 'utils'
import request from 'utils/request'
import { message } from 'antd'
import { isNil, isEmpty } from 'lodash'
import moment from 'moment'
import { searchToObject } from '../common'
import { youdaoTranslate } from '../common/youdao'
import { YOUDAO_ERROR_CODE } from '../common/consts'

const {
  queryBaseData,
  searchKeyWord,
  createPosts,
  translatePartial,
  transJinShan,
  transSo,
  transGoogle,
  sensitiveVerify
} = api

export default {
  namespace: 'posts',

  state: {
    currentItem: {},
    modalVisible: false,
    translation: {},
    searchForm: {
      ymd: moment().subtract(1, 'days'),
      spiderDetailBizStatus: '0',
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/posts', location.pathname)) {
          dispatch({
            type: 'init',
            payload: {},
          })
          dispatch({
            type: 'base',
            payload: {},
          })
          dispatch({
            type: 'changeSearchForm',
            payload: {
              ...searchToObject(),
            },
          })
        }
      })
    },
  },

  effects: {
    *init({ payload = {} }, { call, put }) {
      const constMap = yield request({
        url: 'http://139.196.86.217:8088/info/constant/map',
        method: 'post',
        data: { entity: payload },
      })
      const empower = yield request({
        url: 'http://139.196.86.217:8088/info/empower/my',
        method: 'post',
        data: {},
      })
      if (constMap && empower) {
        yield put({
          type: 'initSuccess',
          payload: {
            initData: constMap.data,
            empower: empower.data,
          },
        })
        yield put({
          type: 'query',
          payload: {},
        })
      }
    },
    *query(payload, { call, put, select }) {
      const { searchForm, pagination } = yield select(_ => _.posts)
      const { current, pageSize } = pagination
      const data = yield request({
        url: 'http://139.196.86.217:8088/info/document/queryList',
        method: 'post',
        data: {
          pageSize,
          pageNum: current,
          entity: {
            ...searchForm,
            ymd: searchForm.ymd && moment(searchForm.ymd).format('YYYY-MM-DD'),
          },
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
    *base({ payload = {} }, { call, put }) {
      const data = yield call(queryBaseData, payload)
      if (data.statusCode === 200) {
        yield put({
          type: 'baseSuccess',
          payload: {
            categories: data.list,
          },
        })
      }
    },
    *create({ payload = {} }, { call, put, select }) {
      const { translation = {} } = yield select(_ => _.posts)
      const { dstInfo={} } = yield select(_ => _.app)
      const { title, content, categories, keywords, description } = translation
      if (isNil(title)) {
        message.warning('标题不能为空')
        return
      } else if (isNil(content)) {
        message.warning('内容不能为空')
        return
      } else if (isEmpty(dstInfo)) {
        message.warning('请先选择发布的目标站点~')
        return
      } else if (isEmpty(categories)) {
        message.warning('请选择栏目~')
        return
      }
      const postData = {
        entity: {
          dstSiteId: dstInfo.value,
          dstCategoryId: categories,
          dstCategoryName: dstInfo.children,
          keywords,
          title,
          content,
          description
        }
      }
      const verifyResult = yield call(sensitiveVerify, postData)
      if (verifyResult.success && !verifyResult.data.data.verify) {
        const sensitiveWords = verifyResult.data.data.sensitiveWordhits.join(',')
        const confirm = window.confirm(`存在敏感词：${sensitiveWords}, 是否继续发布？`)
        if (confirm) {
          const { data, success } = yield call(createPosts, postData)
          if (success) {
            message.success('发布成功')
            yield put({
              type: 'posts/hideModal',
            })
            yield put({
              type: 'posts/query',
            })
          } else {
            message.warning('发布失败')
          }
        } else {
            return;
        }

      }

    },
    *detail({ payload }, { call, put }) {
      if (payload) {
        const data = yield request({
          url: 'http://139.196.86.217:8088/info/document/detail',
          method: 'post',
          data: {
            entity: {
              ...payload,
            },
          },
        })
        if (data) {
          yield put({
            type: 'detailSuccess',
            payload: {
              detail: data.data,
            },
          })
          // 翻译操作，暂时注释，勿删
          yield put({
            type: 'translate',
            payload: {},
          })
        }
      }
    },
    *translate({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)

      // 默认：使用免费的金山词霸
      const { data, statusCode } = yield call(transJinShan, detail)
      if (statusCode === 200) {
        const { title, content } = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            content: content.join('<br />'),
          },
        })
      }
    },
    *translateBySo({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)

      // 默认：使用免费的360翻译
      const { data, statusCode } = yield call(transSo, detail)
      if (statusCode === 200) {
        const { title, content } = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            content: content.join('<br />'),
          },
        })
      }
    },
    *translateByYoudao({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)
      // 使用付费的有道API
      // 标题翻译
      const titleReq = youdaoTranslate(detail.title)
      // 正文翻译，由于正文篇幅过长，分段翻译
      const contentArr = detail.content.split('\r\n')
      const contentArrReq = contentArr
        .filter(item => !!item)
        .map(item => youdaoTranslate(item))
      const [titleRes, ...contentRes] = yield Promise.all([
        titleReq,
        ...contentArrReq,
      ])
      const results = contentRes.map(item => {
        if (item.errorCode === '0') {
          return item && item.translation && item.translation[0]
        } else {
          return `#####Error: ${YOUDAO_ERROR_CODE[item.errorCode]}#####\r\n${
            item.query
          }`
        }
      })
      yield put({
        type: 'translateSuccess',
        payload: {
          title:
            titleRes.errorCode === '0'
              ? titleRes && titleRes.translation && titleRes.translation[0]
              : `Error: ${YOUDAO_ERROR_CODE[titleRes.errorCode]}`,
          content: results.content.join('<br />'),
        },
      })
    },
    *translateByGoogle({ payload }, { call, put }) {
      // 使用免费的谷歌API
      const { data, statusCode } = yield call(transGoogle, payload)
      if (statusCode === 200) {
        const { title, content } = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            content: content.content.join('<br />'),
          },
        })
      }
    },
    *search({ payload }, { call, put }) {
      const keyword = payload.keyword || ''
      if (keyword) {
        // 前端请求会出现CORS，故采用node代理
        const { data } = yield call(searchKeyWord, payload)
        let results = [];
        if (Array.isArray(data)) {
          results = data
        } else {
          results = eval('(' + data + ')').data
        }
        yield put({
          type: 'searchSuccess',
          payload: {
            search: results,
          },
        })
      } else {
        message.warning('关键字不能为空！')
      }
    },
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
          ...payload,
        },
      }
    },
    formChange(state, { payload }) {
      return {
        ...state,
        translation: {
          ...state.translation,
          ...payload,
        },
      }
    },
    openUpload(state, { payload }) {
      return {
        ...state,
        ...payload,
        uploadVisible: true,
      }
    },
    closeUpload(state, { payload }) {
      return {
        ...state,
        ...payload,
        uploadVisible: false,
      }
    },
    pagination(state, { payload }) {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...payload,
        },
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
    detailSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    translateSuccess(state, { payload }) {
      return {
        ...state,
        translation: {
          ...payload,
        },
      }
    },
    searchSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    baseSuccess(state, { payload }) {
      return {
        ...state,
        base: {
          ...payload,
        },
      }
    },
    initSuccess(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
