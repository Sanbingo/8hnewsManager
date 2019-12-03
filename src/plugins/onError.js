import { message } from 'antd'

export default {
  onError(e, a) {
    e.preventDefault()
    if (e.message) {
      message.error(`看到这条错误请截图发给我：${e.stack} | ${e.message}`)
    } else {
      /* eslint-disable */
      console.error(e)
    }
  },
}
