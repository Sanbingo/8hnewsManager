export const YOUDAO_URL = 'http://openapi.youdao.com/api'
export const APP_KEY = '52af186d5198e43e'
export const APP_SECRET = 'e1ZS2jAOEegKln2yxzWRGXFCGU2gPxZX'
export const MAX_CONTENT_LENGTH = 5000

export const YOUDAO_ERROR_CODE = {
  103: '翻译文本过长，不能超过5000个字符',
  108: 'appKey无效，请注册账号',
  111: '开发者账号无效',
  113: '查询参数不能为空',
  203: '访问IP地址不在可访问IP列表',
  206: '因为时间戳无效导致签名校验失败',
  301: '辞典查询失败',
  302: '翻译查询失败',
  401: '账户已经欠费停用',
  411: '访问频率受限,请稍后访问',
  412: '长请求过于频繁，请稍后访问'
}
