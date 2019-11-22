import request from 'request';
import rp from 'request-promise'
import { trim, isNil } from 'lodash';
import log4js from 'log4js';

log4js.configure({
  appenders: {
    cheese: {
      type: 'dateFile',
      filename: './logs/access.log',
      pattern: '.yyyy-MM-dd',
      maxLogSize: 10*1024*1024,
      compress: true,
      backups: 5
    }
  },
  categories: {
    default: {
      appenders: ['cheese'],
      level: 'debug'
    }
  }
})

const logger = log4js.getLogger('http');

/**
 * Query objects that specify keys and values in an array where all values are objects.
 * @param   {array}         array   An array where all values are objects, like [{key:1},{key:2}].
 * @param   {string}        key     The key of the object that needs to be queried.
 * @param   {string}        value   The value of the object that needs to be queried.
 * @return  {object|undefined}   Return frist object when query success.
 */
export function queryArray(array, key, value) {
  if (!Array.isArray(array)) {
    return
  }
  return array.filter(_ => _[key] === value)
}

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomAvatar() {
  const avatarList = [
    'photo-1549492864-2ec7d66ffb04.jpeg',
    'photo-1480535339474-e083439a320d.jpeg',
    'photo-1523419409543-a5e549c1faa8.jpeg',
    'photo-1519648023493-d82b5f8d7b8a.jpeg',
    'photo-1523307730650-594bc63f9d67.jpeg',
    'photo-1522962506050-a2f0267e4895.jpeg',
    'photo-1489779162738-f81aed9b0a25.jpeg',
    'photo-1534308143481-c55f00be8bd7.jpeg',
    'photo-1519336555923-59661f41bb45.jpeg',
    'photo-1551438632-e8c7d9a5d1b7.jpeg',
    'photo-1525879000488-bff3b1c387cf.jpeg',
    'photo-1487412720507-e7ab37603c6f.jpeg',
    'photo-1510227272981-87123e259b17.jpeg'
  ]
  return `//image.zuiidea.com/${avatarList[randomNumber(0, avatarList.length - 1)]}?imageView2/1/w/200/h/200/format/webp/q/75|imageslim`
}

export const Constant = {
  ApiPrefix: '/api/v1',
  NotFound: {
    message: 'Not Found',
    documentation_url: '',
  },
  Color: {
    green: '#64ea91',
    blue: '#8fc9fb',
    purple: '#d897eb',
    red: '#f69899',
    yellow: '#f8c82e',
    peach: '#f797d6',
    borderBase: '#e5e5e5',
    borderSplit: '#f4f4f4',
    grass: '#d6fbb5',
    sky: '#c1e0fc',
  },
}

export Mock from 'mockjs'
export qs from 'qs'

export const reqFetch = (url, method="get", data) => {
  return new Promise((resolve, reject) => {
    request({
      url,
      method,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

export const getCookieByName = (cookie, name) => {
  const arr = cookie ? cookie.split(';') : []
  const objArr = arr.map(item => {
    return {
      name: trim(item.split('=')[0]),
      value: trim(item.split('=')[1])
    }
  })
  const result = objArr.find(item => item.name === name)
  if (isNil(result)){
    return undefined;
  }
  return result.value
}

const PROD_PORT = 8089;
const TEST_PORT = 8088;
const env = 'test' ; // prod or test
const Apis = {
  prod: url => `http://139.196.86.217:${PROD_PORT}${url}`,
  test: url => `http://139.196.86.217:${TEST_PORT}${url}`
}

export const ReqWithAuth = (req, res, url, method='POST', options={}) => {
  const token = getCookieByName(req.headers.cookie, 'token')
  const username = getCookieByName(req.headers.cookie, 'username')
  const userId = getCookieByName(req.headers.cookie, 'userId')
  const cooperateId = getCookieByName(req.headers.cookie, 'cooperateId')
  const MakeApifix = Apis[env]
  const uri = MakeApifix(url)
  let authorization = ''
  if (!token){
    return res.status(401).json({
      status: 401,
      message: '登录信息已过期，请重新登录',
      data: null
    })
  } else {
    const tokenInfo = JSON.parse(decodeURIComponent(token))
    const now = new Date().getTime()
    if (now > tokenInfo.deadline) {
      return res.status(200).json({
        status: 401,
        message: '登录信息已过期，请重新登录',
        data: null
      })
    } else {
      authorization = tokenInfo && tokenInfo.key
    }
  }
  const startTime = new Date().getTime();
  logger.info(`Request: [${username}(${cooperateId}-${userId})] URL: ${uri}`)
  rp({
    uri,
    method,
    body: req.body,
    json: true,
    timeout: options.timeout,
    headers: {
      'Authorization': authorization
    }
  }).then((data) => {
    const totalTime = new Date().getTime() - startTime;
    if (data && data.meta && data.meta.success) {
      logger.info(`Success: [${username}(${cooperateId}-${userId})] [${totalTime}ms] URL: ${uri}`)
      res.status(200).json({
        status: 0,
        data: data,
        message: 'ok',
        success: true
      })
    } else {
      const message = data && data.meta && data.meta.message;
      logger.error(`Failure: [${username}(${cooperateId}-${userId})] [${totalTime}ms] URL: ${uri}`)
      logger.error(`Message: ${message}`)
      res.status(200).json({
        status: 1002,
        data: null,
        message,
        success: false
      })
    }
  }).catch((err) => {
    const totalTime = new Date().getTime() - startTime;
    const message = err && err.message;
    logger.error(`Failure: [${username}(${cooperateId}-${userId})] [${totalTime}ms] URL: ${uri}`)
    logger.error(`Message: ${message}`)
    res.status(200).json({
      status: 1002,
      message,
      data: null,
      success: false
    })
  })
}
