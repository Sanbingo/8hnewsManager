import { Constant, ReqWithAuth } from './_utils'
const { ApiPrefix } = Constant


module.exports = {
  [`POST ${ApiPrefix}/infoConstantMap`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/constant/map');
  },
  [`POST ${ApiPrefix}/infoEmpowerMy`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/empower/my');
  },
  [`POST ${ApiPrefix}/infoDocumentQueryList`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/document/queryList');
  },
  [`POST ${ApiPrefix}/infoDocumentDetail`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/document/detail');
  },
}