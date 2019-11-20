import { Constant, ReqWithAuth } from './_utils'
const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/cooperates`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/cooperate/queryList');
  },
  [`POST ${ApiPrefix}/cooperate`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/cooperate/add');
  },
}
