import { Constant, ReqWithAuth } from './_utils'

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/employees`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/user/queryList');
  },
  [`POST ${ApiPrefix}/employee`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/user/create');
  },
  [`POST ${ApiPrefix}/employeeDelete`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/user/remove');
  },
}
