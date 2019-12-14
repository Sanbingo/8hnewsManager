import api from 'api'
import { pathMatchRegexp } from 'utils'
import { message } from 'antd'
import { isNil, isEmpty, get, trim } from 'lodash'
import moment from 'moment'
import store from 'store';
import { searchToObject } from '../common'
import { youdaoTranslate } from '../common/youdao'
import { YOUDAO_ERROR_CODE } from '../common/consts'
import { getTranslateType } from './consts';

const TITLE_MAX_LENGTH = 150
const KEYWORD_MAX_LENGTH = 40
const {
  queryBaseData,
  searchKeyWord,
  createPosts,
  transJinShan,
  transSo,
  sensitiveVerify,
  infoConstantMap,
  infoEmpowerMy,
  infoDocumentQueryList,
  infoDocumentDetail,
  infoDocumentBatchMark
} = api

const processResultsByYoudaopay = (res=[]) => {
  const results = res.map(item => {
    if (item.errorCode === '0') {
      return item && item.translation && item.translation[0]
    } else if (item.errorCode === '401') {
      return 'Service Unavailable'
    } else {
      return `#####Error: ${YOUDAO_ERROR_CODE[item.errorCode]}#####\r\n`
    }
  })
  return results
}

export default {
  namespace: 'posts',

  state: {
    currentItem: {},
    modalVisible: false,
    translation: {},
    searchForm: {
      ymd: moment().subtract(1, 'days'),
      spiderDetailBizStatus: '0',
      wordCount: '150'
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
    translateType: 'youdaopay',
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
      const constMap = yield call(infoConstantMap, { entity: payload })
      const empower = yield call(infoEmpowerMy, {})
      if (constMap.success && empower.success) {
        yield put({
          type: 'initSuccess',
          payload: {
            initData: constMap.data && constMap.data.data,
            empower: empower.data && empower.data.data,
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
      const { ymd } = searchForm;
      if (isNil(ymd)) {
        message.warning('请先选择日期再查询~');
        return;
      }
      const { current, pageSize } = pagination
      const result = yield call(infoDocumentQueryList, {
        pageSize,
          pageNum: current,
          entity: {
            ...searchForm,
            ymd: searchForm.ymd && moment(searchForm.ymd).format('YYYY-MM-DD'),
          },
      })
      const { success, data }  = result
      if (success) {
        let listTemp = data.data;
        let newIndex = [];
        // 判断是否有缓存
        const checkListCache = listTemp.map(item => {
            if (sessionStorage.getItem(item.id)) {
              return ({
                ...item,
                translate: sessionStorage.getItem(item.id)
              })
            }
            return item
          })
        // 如果有新值，即在sessionStorage中没有找到缓存的
        if (checkListCache.some(item => !item.translate)) {
          const unTranslateList = checkListCache.filter((item, index) => {
            if (!item.translate) {
              newIndex.push(index);
              return true
            }
            return false
          })
          // 使用有道云翻译
          const listArrReq = unTranslateList.filter(item => !!trim(item.title)).map(item => youdaoTranslate(item.title))
          const [...listArrRes] = yield Promise.all([...listArrReq])

          // 有道云返回结果通用逻辑        
          const results = processResultsByYoudaopay(listArrRes)
          // 如果翻译出错，或有道云有问题，则提示
          if (results.some(item => item === 'Service Unavailable')) {
            message.warning('有道云翻译已欠费，为了不影响使用请提醒管理员注意续费~')
            yield put({
              type: 'app/latestkeysecret',
              payload: {
                entity: {
                  id,
                  encryptType : 0
                }
              }
            })
          } else {
          // 否则把翻译结果拼接会列表
          if (newIndex && newIndex.length) {
            newIndex.forEach((cur, idx) => {
              checkListCache[cur].translate = results[idx]
              // 把结果同时缓存到sessionStorage中
              sessionStorage.setItem(checkListCache[cur].id, results[idx]);
            }) 
          } 
            // listTemp = listTemp.map((item, index) => ({
            //   ...item,
            //   translate: results[index]
            // }))
          }
        }

        yield put({
          type: 'querySuccess',
          payload: {
            list: checkListCache,
            pagination: {
              showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              current,
              pageSize,
              total: data.pageInfo.total,
            },
          },
        })
      } else {
        message.warning(result.message)
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
      const { translation = {}, detailId } = yield select(_ => _.posts)
      const { dstInfo={}, dstCategory=[] } = yield select(_ => _.app)
      const { title, content, categories, keywords, description } = translation
      const { abstractDefaultContent, publishType } = payload
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
      } else if (title && title.length > TITLE_MAX_LENGTH) {
        message.warning(`标题长度不能超过${TITLE_MAX_LENGTH}个字符`)
        return
      } else if (keywords && keywords.length > KEYWORD_MAX_LENGTH) {
        message.warning(`关键字不能超过${KEYWORD_MAX_LENGTH}个字符`)
        return
      }
      // 排版：图片居中对齐
      const formatContent = content.replace(/<img.*?(?:>|\/>)/gi, (match) => `<p align='center' style="display: 'flex'; justify-content: 'center'">${match}</p>`)
      const postData = {
        entity: {
          dstSiteId: dstInfo.value,
          dstCategoryId: categories,
          dstCategoryName: dstCategory.find(item => item.dstCategoryId === categories) && dstCategory.find(item => item.dstCategoryId === categories).dstCategoryName,
          keywords,
          title,
          content: formatContent,
          description: description || abstractDefaultContent,
          detailId,
          publishType
        }
      }
      const verifyResult = yield call(sensitiveVerify, postData)
      const verify = get(verifyResult, 'data.data.verify');
      if (verifyResult.success && !verify) {
        const sensitiveWordhits = get(verifyResult, 'data.data.sensitiveWordhits', [])
        const sensitiveWords = sensitiveWordhits.join(',')
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
        }
      } else {
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
      }
    },
    *detail({ payload }, { call, put, select }) {
      const { translateType } = yield select(_ => _.posts);
      const isViewMode = get(store.get('userconfig'), 'cooperateId') === '10002'
      if (payload) {
        const { success, data } = yield call(infoDocumentDetail, {
          entity: {
            ...payload,
          },
        })
        if (success) {
          const { title='', content= '', downloadUrl } = data.data; 
          yield put({
            type: 'detailSuccess',
            payload: {
              detail: {
                title,
                content: content.replace(/&nbsp;/g, ''),
                downloadUrl
              },
            },
          })
          // 查看模式不执行翻译
          if (!isViewMode) {
            yield put({
              type: getTranslateType(translateType),
              payload: {},
            })
          }
        }
      }
    },
    *translate({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)
      // 默认：使用免费的金山词霸
      const result = yield call(transJinShan, detail)
      const { data, statusCode } = result
      if (statusCode === 200) {
        const { title, content } = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            content: content.join('<br />'),
          },
        })
      } else {
        message.warning(result.message)
      }
    },
    *translateBySo({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)

      // 默认：使用免费的360翻译
      const result = yield call(transSo, detail)
      const { data, statusCode } = result
      if (statusCode === 200) {
        const { title, content } = data
        yield put({
          type: 'translateSuccess',
          payload: {
            title,
            content: content.join('<br />'),
          },
        })
      } else {
        message.warning(result.message)
      }
    },
    *translateByYoudao({ payload }, { call, put, select }) {
      const { detail } = yield select(_ => _.posts)
      const { keysecret={} } = yield select(_ => _.app)
      const { appId, encrypt, id } = keysecret
      if (isNil(appId) || isNil(encrypt)) {
        message.warning('有道云秘钥没有配置，请联系网站管理员~')
        return;
      }

      // 标题翻译，使用付费的有道API
      const titleReq = youdaoTranslate(detail.title, appId, encrypt )
      const [titleRes] = yield Promise.all([titleReq])

      // 正文内容默认：先使用免费的金山词霸，翻译出错则使用有道云
      const response = yield call(transJinShan, detail)
      const { data, statusCode } = response
      
      // 针对标题：有道云返回结果通用逻辑   
      const results = processResultsByYoudaopay([titleRes])
      if (results.some(item => item === 'Service Unavailable')) {
        message.warning('有道云翻译已欠费，为了不影响使用请提醒管理员注意续费~')
        yield put({
          type: 'app/latestkeysecret',
          payload: {
            entity: {
              id,
              encryptType : 0
            }
          }
        })
      }
      let title = ''
      if (titleRes.errorCode === '0') {
        title = titleRes && titleRes.translation && titleRes.translation[0]
      } else if (statusCode === 200) {
        title = data.title
      } else {
        title = `Error: ${YOUDAO_ERROR_CODE[titleRes.errorCode]}`
      }

      let content = []
      // 如果翻译成功，且翻译返回内容不为空，则使用金山
      if (statusCode === 200 && data.content && data.content.filter(item => item).length !== 0) {
        content = data.content
      } else {
        // 正文翻译，由于正文篇幅过长，分段翻译
        const contentArr = detail.content.split('\r\n')
        const contentArrReq = contentArr
          .filter(item => !!trim(item))
          .map(item => youdaoTranslate(item, appId, encrypt))
        const [...contentRes] = yield Promise.all([...contentArrReq])
        // 针对正文内容：有道云返回结果通用逻辑   
        const results = processResultsByYoudaopay(contentRes)
        if (results.some(item => item === 'Service Unavailable')) {
          message.warning('有道云翻译已欠费，为了不影响使用请提醒管理员注意续费~')
          yield put({
            type: 'app/latestkeysecret',
            payload: {
              entity: {
                id,
                encryptType : 0
              }
            }
          })
        }
        content = results;
      }
      
      yield put({
        type: 'translateSuccess',
        payload: {
          title,
          content: content.join('<br />'),
        },
      })
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
    *ignore({ payload }, {call, put}) {
      console.log('pd', payload)
      const { data, success } = yield call(infoDocumentBatchMark, {
        entities: payload
      })
      if (success) {
        message.success('操作成功~')
        yield put({
          type: 'posts/query',
        })
      }
    }
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    // 关闭发布对话框
    hideModal(state) {
      return {
        ...state,
        position: 0, // 重置编辑器光标位置
        translation: {}, // 重置翻译内容为空
        modalVisible: false,
      }
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
        position: 0,
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
    translateType(state, {payload}) {
      return {
        ...state,
        translateType: payload
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
