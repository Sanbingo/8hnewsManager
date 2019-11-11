import request from 'request';
import { Mock, Constant, ReqWithAuth } from './_utils'

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

const bdPicFetch = (keyword, pageNum=1) => {
  const url = 'https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=' + keyword + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=' + keyword + '&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn='+pageNum+'&rn=48';
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
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}


module.exports = {
  // 查询
  [`POST ${ApiPrefix}/sources`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/queryList')
  },
  // 获取所有新闻源
  [`POST ${ApiPrefix}/allsources`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/all')
  },
  // 新建
  [`POST ${ApiPrefix}/source`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/add')
  },
  // 删除
  [`POST ${ApiPrefix}/sourceDelete`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/hardRemove')
  },
  // 添加栏目
  [`POST ${ApiPrefix}/sourceUpdate`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/update')
  },
  // 添加爬虫配置
  [`POST ${ApiPrefix}/addspiderconfig`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/config/add')
  },
  // 更新爬虫配置
  [`POST ${ApiPrefix}/updatespiderconfig`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/config/update')
  },
  [`POST ${ApiPrefix}/search`](req, res) {
    const { keyword, pageNum } = req.body
    let fetch = bdPicFetch(encodeURIComponent(keyword), pageNum)
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
}
