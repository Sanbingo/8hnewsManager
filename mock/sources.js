import request from 'request';
import { Mock, Constant, qs, randomAvatar } from './_utils'


const { ApiPrefix } = Constant

const reqFetch = (url, method="get", data) => {
  return new Promise((resolve, reject) => {
    request({
      url,
      method,
      data,
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

const bdPicFetch = (keyword, config={}) => {
  const url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' + keyword + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' + keyword + '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=30&rn=30';
  const obj = {
    url,
    method: 'get',
    headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
    }
  }
  return new Promise((resolve, reject) => {
    request(obj, (err, res, body) => {
      if (err) {
        console.log('err', err.message)
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar() {
        return randomAvatar()
      },
    },
  ],
})

let database = usersListData.data

module.exports = {
  [`GET ${ApiPrefix}/sources`](req, res) {
    // const { query } = req
    res.status(200).json({
      data: database,
      total: database.length,
    })
  },
  [`GET ${ApiPrefix}/search`](req, res) {
    const { query } = req
    let fetch = bdPicFetch(encodeURIComponent(query.keyword))
    fetch.then((data) => {
      res.send(data)
    }, (err) => {
      res.status(200).json({
        data: err,
        message: 'search failure'
      })
    })
    fetch = null
  },
  [`GET ${ApiPrefix}/base`](req, res) {

    let fetch = reqFetch('http://www.8hnews.com/wp-json/wp/v2/categories?per_page=100')
    fetch.then((data) => {
      res.send(data)
    }, (err) => {
      res.status(200).json({
        data: err,
        message: 'search failure'
      })
    })
    fetch = null
  },
  [`GET ${ApiPrefix}/sanbingo`](req, res) {
    console.log('sanbingo...')
    // let fetch = reqFetch('http://www.8hnews.com/wp-json/wp/v2/posts', 'post', {
    //     title: 'test',
    //     content: 'content',
    //     categories: [3, 12, 10]
    // })
    // console.log('fetching....', fetch)
    // fetch.then((data) => {
    //   console.log('create posts success...', data)
    //   res.send(data)
    // }, (err) => {
    //   console.log('err...', err)
    //   res.status(200).json({
    //     data: err,
    //     message: 'search failure'
    //   })
    // })
    // fetch = null
  },

}
