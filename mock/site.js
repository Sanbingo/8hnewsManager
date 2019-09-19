import { Constant, ReqWithAuth } from './_utils'
const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/sites`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/queryList');
  },
  [`POST ${ApiPrefix}/site`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/add');
  },
  [`POST ${ApiPrefix}/siteUpdate`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/update');
  },
  [`POST ${ApiPrefix}/allSites`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/all');
  },
}
