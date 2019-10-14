import { Constant, ReqWithAuth } from './_utils'

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/sensitives`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sensitive/queryList');
  },
  [`POST ${ApiPrefix}/sensitive`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sensitive/add');
  },
  [`POST ${ApiPrefix}/updateSensitive`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sensitive/update');
  },
  [`POST ${ApiPrefix}/sensitiveVerify`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sensitive/verify');
  },
}
