export default {
  queryRouteList: '/routes',

  queryUserInfo: 'POST /user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  // createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  sourceUpdate: 'POST /sourceUpdate',
  sourceDelete: 'POST /sourceDelete',
  addSpiderConfig: 'POST /addspiderconfig',
  updateSpiderCfg: 'POST /updatespiderconfig',
  querySourcesList: 'POST /sources',
  allSourcesList: 'POST /allsources',
  querySources: '/sources/:id',
  createSources: 'POST /source',
  removeSources: 'DELETE /sources/:id',
  updateSources: 'Patch /sources/:id',
  searchKeyWord: 'POST /search',
  queryBaseData: '/base',
  createPosts: 'POST /create',
  getWPToken: 'POST /token',
  transApi: 'POST /translate',
  transJinShan: 'POST /translate/jinshan',
  transSo: 'POST /translate/so',
  transGoogle: 'POST /translate/google',
  translatePartial: 'POST /translate/partial',
  youdaopayTest: 'POST /youdaopay/test',
  queryCooperateList: 'POST /cooperates',
  createCooperate: 'POST /cooperate',
  querySensitiveList: 'POST /sensitives',
  createSensitive: 'POST /sensitive',
  updateSensitive: 'POST /updateSensitive',
  querySpiderCfgList: 'POST /spiders',
  createSpiderCfg: 'POST /spider',
  queryEmployeeList: 'POST /employees',
  createEmployee: 'POST /employee',
  querySiteList: 'POST /sites',
  mySiteList: 'POST /mySites',
  createSite: 'POST /site',
  updateSite: 'POST /siteUpdate',
  deleteSite: 'POST /siteDelete',
  verifyConnect: 'POST /verify',
  queryTagsList: 'POST /tags',
  getAllTags: 'POST /all-tags',
  createTags: 'POST /tag',
  removeTags: 'POST /tagremove',
  getDstCategory: 'POST /dstCategory',
  sensitiveVerify: 'POST /sensitiveVerify',
  queryKeySecret: 'POST /keysecrets',
  createKeySecret: 'POST /keysecret',
  removeKeySecret: 'POST /removekeysecret',
  latestkeySecret: 'POST /keysecretlatest',
  infoConstantMap: 'POST /infoConstantMap',
  infoEmpowerMy: 'POST /infoEmpowerMy',
  infoDocumentQueryList: 'POST /infoDocumentQueryList',
  infoDocumentDetail: 'POST /infoDocumentDetail',
  infoSpiderResultGroupList: 'POST /infoSpiderResultGroupList',
  infoSpiderResultDetailList: 'POST /infoSpiderResultDetailList',
  infoSpiderResultDetail: 'POST /infoSpiderResultDetail',
}
