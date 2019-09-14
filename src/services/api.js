export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',

  sourceUpdate: 'POST /sourceUpdate',
  sourceDelete: 'POST /sourceDelete',
  addSpiderConfig: 'POST /addspiderconfig',
  querySourcesList: 'POST /sources',
  querySources: '/sources/:id',
  createSources: 'POST /source',
  removeSources: 'DELETE /sources/:id',
  updateSources: 'Patch /sources/:id',
  searchKeyWord: '/search',
  queryBaseData: '/base',
  createPosts: 'POST /create',
  getWPToken: 'POST /token',
  transApi: 'POST /translate',
  transJinShan: 'POST /translate/jinshan',
}
