import { youdao, baidu, google } from 'translation.js'

export const youdaoApi = (value) => {
  return new Promise((resolve, reject) => {
    youdao.translate(value).then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}

export const baiduApi = (value) => {
  return new Promise((resolve, reject) => {
    baidu.translate(value).then(result => {
      resolve(result)
    }).catch(err => {
      reject(err)
    })
  })
}

export const googleApi = (value) => {
  return new Promise((resolve, reject) => {
    google.translate(value).then(result => {
      console.log('result', result)
      resolve(result)
    }).catch(err => {
      console.log('err', err)
      reject(err)
    })
  })
}
