import { Constant, ReqWithAuth } from './_utils'
const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/dstCategory`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/sync/category');
  },
}
