import { Constant, ReqWithAuth } from './_utils'

const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/tags`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/category/queryList');
  },
  [`POST ${ApiPrefix}/tag`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/category/add');
  },
  [`POST ${ApiPrefix}/all-tags`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/category/all');
  },
}
