import { Mock, Constant, getCookieByName, reqFetch, ReqWithAuth } from './_utils'
import rp from 'request-promise';
import { isNil } from 'lodash';
import { googleApi } from '../src/pages/common/trans';
import { jinshanApi } from '../src/pages/common/jinshan';

const { ApiPrefix } = Constant


module.exports = {
  [`POST ${ApiPrefix}/create`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sync/publish');
  },
  [`POST ${ApiPrefix}/createWp`](req, res) {
    const { title, content, categories } = req.body
    const wptoken = getCookieByName(req.headers.cookie, 'wptoken')
    if (isNil(wptoken)) {
      res.status(201).end()
    }
    rp({
      uri: 'http://www.8hnews.com/wp-json/wp/v2/posts',
      method: 'POST',
      body: {
        title,
        content,
        categories
      },
      headers: {
        'Authorization': `Bearer ${wptoken}`
      },
      json: true
    }).then((data) => {
      res.status(200).end()
    }).catch((err) => {
      res.status(400).end()
    })
  },
  [`POST ${ApiPrefix}/translate`](req, res) {
    // 金山翻译
    const { title, content } = req.body
    const titleReq = jinshanApi(title)
    const contentArr = content.split('\r\n');
    const contentArrReq = contentArr.filter(item => !!item).map(item => jinshanApi(item))
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
    // google 翻译API
    // const { title, content } = req.body
    // const titleReq = googleApi(title)
    // const contentArr = content.split('\r\n');
    // const contentArrReq = contentArr.filter(item => !!item).map(item => googleApi(item))
    // Promise.all([titleReq, ...contentArrReq]).then(([titleRes, ...contentRes]) => {
    //   res.status(200).json({
    //     data: {
    //       title: titleRes && titleRes.result && titleRes.result[0],
    //       content: contentRes && contentRes.map(item => item.result && item.result.join(''))
    //     }
    //   })
    // }).catch((err) => {
    //   res.status(400).json({
    //     data: {
    //       error: err
    //     }
    //   })
    // })
  },
}
