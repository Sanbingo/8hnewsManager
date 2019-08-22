import { Mock, Constant, getCookieByName } from './_utils'
import rp from 'request-promise';

const { ApiPrefix } = Constant

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

module.exports = {
  [`POST ${ApiPrefix}/create`](req, res) {
    const { title, content, categories } = req.body
    const wptoken = getCookieByName(req.headers.cookie, 'wptoken')
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
