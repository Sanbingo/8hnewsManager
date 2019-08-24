import { message } from 'antd'
import { youdaoTranslate } from '../common/youdao';

import {
  YOUDAO_ERROR_CODE
} from '../common/consts'

export default {
  namespace: 'setting',
  state: {
    appKey: '',
    appSecret: ''
  },
  effects: {
    *validate({ payload }, { call, put}) {
      // 测试账号密码是否有效
      const titleReq = youdaoTranslate('hello world!', payload.appKey, payload.appSecret);

      const [titleRes] = yield Promise.all([titleReq])

      if (titleRes.errorCode === '0') {
        message.success('**账号有效!**')
      } else {
        message.warning(`Error: ${YOUDAO_ERROR_CODE[titleRes.errorCode]}`)
      }
    },
  },
  reducers: {
    validateSuccess(state, { payload }) {
      return {
        ...state,
        validation: {
          ...payload
        }
      }
    }
  }
}
