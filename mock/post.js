import { Mock, Constant, getCookieByName } from './_utils'
import rp from 'request-promise';
import { isNil } from 'lodash';
import { googleApi } from '../src/pages/common/trans';
import { jinshanApi } from '../src/pages/common/jinshan'

const { ApiPrefix } = Constant
const SITE_DOMAIN = 'www.8hnews.com';
const BAIDU_SPIDER_PUSH_TOKEN = 'IhZTmyTPGMq0Nm18';

let postId = 0
const database = Mock.mock({
  'data|100': [
    {
      id() {
        postId += 1
        return postId + 10000
      },
      'status|1-2': 1,
      title: '@title',
      author: '@last',
      sources: '@word',
      categories: '@word',
      tags: '@word',
      'views|10-200': 1,
      'comments|10-200': 1,
      visibility: () => {
        return Mock.mock(
          '@pick(["Public",' + '"Password protected", ' + '"Private"])'
        )
      },
      date: '@dateTime',
      image() {
        return Mock.Random.image(
          '100x100',
          Mock.Random.color(),
          '#757575',
          'png',
          this.author.substr(0, 1)
        )
      },
    },
  ],
}).data

const pushBaiduSpider = (url) => {
  rp({
    uri: `http://data.zz.baidu.com/urls?site=${SITE_DOMAIN}&token=${BAIDU_SPIDER_PUSH_TOKEN}`,
    method: 'POST',
    headers: {
      'Content-type': 'text/plain'
    },
    body: url,
    }).then((data) => {
      console.log('百度推送成功~')
    }).catch((err) => {
      console.log('百度推送失败', err)
    })
}

module.exports = {
  [`POST ${ApiPrefix}/translate/partial`](req, res) {
    const { list=[] } = req.body
    const listArrReq = list.filter(item => !!item.title).map(item => jinshanApi(item.title))
    Promise.all(listArrReq).then(results => {
      res.status(200).json({
        data: results && results.map(item => item.content && item.content.out)
      })
    })
  },
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
  [`POST ${ApiPrefix}/create`](req, res) {
    const { title, content, categories, status } = req.body
    const wptoken = getCookieByName(req.headers.cookie, 'wptoken')
    if (isNil(wptoken)) {
      res.status(201).end()
    }
    rp({
      uri: 'http://www.8hnews.com/wp-json/wp/v2/posts',
      method: 'POST',
      body: {
        status,
        title,
        content,
        categories
      },
      headers: {
        'Authorization': `Bearer ${wptoken}`
      },
      json: true
    }).then((data) => {
      // 添加百度推送
      pushBaiduSpider(data && data.guid && data.guid.raw)
      res.status(200).end()
    }).catch((err) => {
      res.status(400).end()
    })
  },
  [`POST ${ApiPrefix}/translate`](req, res) {
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

  },
  [`GET ${ApiPrefix}/posts`](req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter(item => {
          if ({}.hasOwnProperty.call(item, key)) {
            return (
              String(item[key])
                .trim()
                .indexOf(decodeURI(other[key]).trim()) > -1
            )
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },
}
