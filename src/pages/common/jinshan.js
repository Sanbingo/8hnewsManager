const rp = require('request-promise')
const JINSHAN_URL = 'http://fy.iciba.com/ajax.php?a=fy'

export const jinshanApi = (content) => {
  return new Promise((resolve, reject) => {
    rp({
      uri: JINSHAN_URL,
      method: 'POST',
      form: {
        f: 'en',
        t: 'zh',
        w: content
      },
      timeout: 3000,
    }).then(data => {
      resolve(JSON.parse(data))
    }).catch(err => { 
      reject(err)
    })
  })
}
