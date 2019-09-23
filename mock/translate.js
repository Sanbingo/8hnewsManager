import { Constant } from './_utils'

import { googleApi } from '../src/pages/common/trans';
import { jinshanApi } from '../src/pages/common/jinshan';

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/translate/jinshan`](req, res) {
    // 金山翻译
    const { title, content } = req.body
    const titleReq = jinshanApi(title)
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
    const contentArrReq = contentArrTemp.map(item => jinshanApi(item))
    Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
      res.status(200).json({
        data: {
          title: titleRes && titleRes.content && titleRes.content.out,
          content: contentRes && contentRes.map(item => item.content && item.content.out)
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
  [`POST ${ApiPrefix}/translate/partial`](req, res) {
    const { list=[] } = req.body
    const listArrReq = list.filter(item => !!item.title).map(item => jinshanApi(item.title))
    Promise.all(listArrReq).then(results => {
      res.status(200).json({
        data: results && results.map(item => item.content && item.content.out)
      })
    })
  },
  [`POST ${ApiPrefix}/translate/google`](req, res) {
    // google 翻译API
    const { title, content } = req.body
    const titleReq = googleApi(title)
    const contentArr = content.split('\r\n');
    const contentArrReq = contentArr.filter(item => !!item).map(item => googleApi(item))
    Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
      res.status(200).json({
        data: {
          title: titleRes && titleRes.result && titleRes.result[0],
          content: contentRes && contentRes.map(item => item.result && item.result.join(''))
        }
      })
    }).catch((err) => {
      res.status(400).json({
        data: {
          error: err
        }
      })
    })
  }
}
