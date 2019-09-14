import { Constant } from './_utils'

import { googleApi } from '../src/pages/common/trans';
import { jinshanApi } from '../src/pages/common/jinshan';

const { ApiPrefix } = Constant

module.exports = {
  // [`POST ${ApiPrefix}/translate/jinshan`](req, res) {
  //   // 金山翻译
  //   const { title, content } = req.body
  //   const titleReq = jinshanApi(title)
  //   const contentArr = content.split('\r\n');
  //   const contentArrReq = contentArr.filter(item => !!item).map(item => jinshanApi(item))
  //   Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
  //     res.status(200).json({
  //       data: {
  //         title: titleRes && titleRes.content && titleRes.content.out,
  //         content: contentRes && contentRes.map(item => item.content && item.content.out)
  //       }
  //     })
  //   }).catch((err) => {
  //     res.status(400).json({
  //       data: {
  //         error: err
  //       }
  //     })
  //   })
  // },
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
