import { Constant, ReqWithAuth } from './_utils'

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/spiders`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/config/queryList');
  },
  [`POST ${ApiPrefix}/spider`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/config/update');
  },
}
