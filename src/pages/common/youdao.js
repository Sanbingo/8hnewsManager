import md5 from 'md5'
import jsonp from 'jsonp'
import store from 'store'
import {
  MAX_CONTENT_LENGTH,
  YOUDAO_URL
} from './consts'

const serialize = (obj) => {
  return Object.keys(obj).reduce((a, k) => {
    a.push(`${k}=${encodeURIComponent(obj[k])}`)
    return a
  }, []).join('&')
}
export const youdaoTranslate = (value, appkey, appSecret) => {
  const APP_KEY = appkey || store.get('appId')
  const APP_SECRET = appSecret || store.get('secret')
  const salt = (new Date).getTime();
  const query = value.length > MAX_CONTENT_LENGTH ? value.slice(0, MAX_CONTENT_LENGTH): value
  const str = APP_KEY+query+salt+APP_SECRET
  const curTime = Math.round(new Date().getTime()/1000);
  const params = {
    q: query,
    appKey: APP_KEY,
    from: 'en',
    to: 'zh-CHS',
    sign: md5(str),
    salt,
    curTime,
  }
  const url = `${YOUDAO_URL}?${serialize(params)}`;
  return new Promise((resolve, reject) => {
    jsonp(url, null, (err, data) => err ? reject(err) : resolve(data))
  })
}
