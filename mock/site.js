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
  [`POST ${ApiPrefix}/siteDelete`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/remove');
  },
  [`POST ${ApiPrefix}/allSites`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/all');
  },
  [`POST ${ApiPrefix}/mySites`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/site/dst/my');
  },
  [`POST ${ApiPrefix}/verify`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/datasource/config/test');
  },
}
