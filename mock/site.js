import { Constant, ReqWithAuth } from './_utils'
const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/sites`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/queryList');
  },
  [`POST ${ApiPrefix}/site`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/add');
  },
}
