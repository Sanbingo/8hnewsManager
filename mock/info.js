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
    await ReqWithAuth(req, res, '/info/document/queryList', 'POST', { timeout: 10000 });
  },
  [`POST ${ApiPrefix}/infoDocumentDetail`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/document/detail');
  },
  [`POST ${ApiPrefix}/infoSpiderResultGroupList`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/result/groupList');
  },
  [`POST ${ApiPrefix}/infoSpiderResultDetailList`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/result/detailList');
  },
  [`POST ${ApiPrefix}/infoSpiderResultDetail`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/spider/result/detail');
  },
  [`POST ${ApiPrefix}/infoDocumentBatchMark`]: async (req, res) => {
    await ReqWithAuth(req, res, '/info/document/batch/mark');
  },
}