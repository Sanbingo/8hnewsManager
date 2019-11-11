import { Constant, getCookieByName } from './_utils'
import { jinshanApi } from '../src/pages/common/jinshan';
import { soApi } from '../src/pages/common/so';
import log4js from 'log4js'

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
    // 金山翻译
    const { title, content } = req.body
    const contentArrTemp = contentPreSplit(content);
    const titleReq = jinshanApi(title)
    const contentArrReq = contentArrTemp.map(item => jinshanApi(item))
    const startTime = new Date().getTime();
    Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
      const totalTime = new Date().getTime() - startTime;
      logger.info(`Success: [${username}] [${totalTime}] ms`)
      res.status(200).json({
        data: {
          title: titleRes && titleRes.content && titleRes.content.out,
          content: contentRes && contentRes.map(item => item.content && item.content.out)
        }
      })
    }).catch((err) => {
      const totalTime = new Date().getTime() - startTime;
      logger.error(`Failure: [${username}] [${totalTime}] ms`)
      logger.error(`Message: ${err && err.message}`)
      res.status(400).json({
        data: {
          error: err
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
    // 金山翻译
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
}
