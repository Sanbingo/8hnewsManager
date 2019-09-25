const rp = require('request-promise')
const qs = require('querystring')
const URL = 'https://fanyi.so.com/index/search';

const soApi = (content) => {
  const data = {
    eng: 1,
    ignore_trans: 0,
    query: content
  }
  return new Promise((resolve, reject) => {
    rp({
      uri: `${URL}?${qs.stringify(data)}`,
      method: 'POST',
    }).then(data => {
      resolve(JSON.parse(data))
    }).catch(err => {
      reject(JSON.parse(err))
    })
  })
}

module.exports = {
  soApi
}
