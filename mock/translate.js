import qs from 'querystring'
import md5 from 'md5'
import nodeJsonp from 'node-jsonp';
import { Constant, getCookieByName } from './_utils'
import { jinshanApi } from '../src/pages/common/jinshan';
import { soApi } from '../src/pages/common/so';
import log4js from 'log4js'

const YOUDAO_URL = 'http://openapi.youdao.com/api'
const YOUDAO_ERROR_CODE = {
  103: '翻译文本过长，不能超过5000个字符',
  105: '不支持的签名类型',
  108: 'appKey无效，请注册账号',
  110: '无相关服务的有效实例',
  111: '开发者账号无效',
  113: '查询参数不能为空',
  202: '签名检验失败',
  203: '访问IP地址不在可访问IP列表',
  206: '因为时间戳无效导致签名校验失败',
  301: '辞典查询失败',
  302: '翻译查询失败',
  303: '服务端的其它异常',
  401: '账户已经欠费停用',
  411: '访问频率受限,请稍后访问',
  412: '长请求过于频繁，请稍后访问',
  1411: '访问频率受限',
}

const logger = log4js.getLogger('jinshan')

const { ApiPrefix } = Constant

const contentPreSplit = (content) => {
  const contentArr = content.split('\r\n');
  const contentArrTemp = []
  const MAX_LIMIT_LENGTH = 4900;
  contentArr.filter(item => !!item).forEach(item => {
    // 针对单个段落超过5000个字符长度的处理
    if(item.length < MAX_LIMIT_LENGTH) {
      contentArrTemp.push(item)
    } else {
      for (let i = 0, l = item.length; i < l/MAX_LIMIT_LENGTH; i++) {
        let a = item.slice(MAX_LIMIT_LENGTH*i, MAX_LIMIT_LENGTH*(i+1));
        contentArrTemp.push(a);
      }
    }
  })
  return contentArrTemp
}

module.exports = {
  [`POST ${ApiPrefix}/translate/jinshan`](req, res) {
    const username = getCookieByName(req.headers.cookie, 'username')
    const userId = getCookieByName(req.headers.cookie, 'userId')
    const cooperateId = getCookieByName(req.headers.cookie, 'cooperateId')
    // 金山翻译
    const { title, content } = req.body
    const contentArrTemp = contentPreSplit(content);
    const titleReq = jinshanApi(title)
    const contentArrReq = contentArrTemp.map(item => jinshanApi(item))
    const startTime = new Date().getTime();
    Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
      const totalTime = new Date().getTime() - startTime;
      logger.info(`Success: [${username}(${cooperateId}-${userId})] [${totalTime}] ms`)
      res.status(200).json({
        data: {
          title: titleRes && titleRes.content && titleRes.content.out,
          content: contentRes && contentRes.map(item => item.content && item.content.out)
        }
      })
    }).catch((err) => {
      const totalTime = new Date().getTime() - startTime;
      logger.error(`Failure: [${username}(${cooperateId}-${userId})] [${totalTime}] ms`)
      logger.error(`Message: ${err && err.message}`)
      // 金山API异常情况，返回空值，激活兜底策略。
      res.status(200).json({
        data: {
          title: '',
          content: []
        }
      })
    })
  },
  [`POST ${ApiPrefix}/translate/partial`](req, res) {
    const { list=[] } = req.body
    const listArrReq = list.filter(item => !!item.title).map(item => jinshanApi(item.title))
    Promise.all(listArrReq).then(results => {
      res.status(200).json({
        data: results && results.map(item => item.content && item.content.out)
      })
    })
  },
  [`POST ${ApiPrefix}/translate/so`](req, res) {
    // 360翻译
    const { title, content } = req.body
    const contentArrTemp = contentPreSplit(content);
    const titleReq = soApi(title)
    const contentArrReq = contentArrTemp.map(item => soApi(item))
    Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
      res.status(200).json({
        data: {
          title: titleRes && titleRes.data && titleRes.data.fanyi,
          content: contentRes && contentRes.map(item => item.data && item.data.fanyi)
        }
      })
    }).catch((err) => {
      res.status(400).json({
        data: {
          error: err
        }
      })
    })
  },
  [`POST ${ApiPrefix}/youdaopay/test`](req, res) {
    const { appId, encrypt } = req.body
    const APP_KEY = appId
    const APP_SECRET = encrypt 
    const salt = (new Date).getTime();
    const curTime = Math.round(new Date().getTime()/1000);
    const query = 'hello'
    const str = APP_KEY+query+salt+APP_SECRET
    
    const params = {
      q: query,
      appKey: APP_KEY,
      from: 'en',
      to: 'zh-CHS',
      sign: md5(str),
      salt,
      curTime,
    }
    const url = `${YOUDAO_URL}?${qs.stringify(params)}`;
    nodeJsonp(url, null, (data) => {
      if (data.errorCode === '0') {
        res.status(200).json({
          message: '密钥可用~',
          success: true
        })
      } else {
        res.status(200).json({
          message: YOUDAO_ERROR_CODE[data.errorCode] || '密钥不可用',
          success: false
        })
      }
    })
  }
}
