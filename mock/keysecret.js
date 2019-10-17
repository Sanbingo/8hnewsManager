import { Constant, ReqWithAuth } from './_utils'

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/keysecrets`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/encrypt/queryList');
  },
  [`POST ${ApiPrefix}/keysecret`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/encrypt/add');
  },
  [`POST ${ApiPrefix}/removekeysecret`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/encrypt/remove');
  },
  [`POST ${ApiPrefix}/keysecretlatest`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/encrypt/latest');
  },
}
