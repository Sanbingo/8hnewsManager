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

  querySourcesList: '/sources',
  querySources: '/sources/:id',
  createSources: 'POST /sources',
  removeSources: 'DELETE /sources/:id',
  updateSources: 'Patch /sources/:id',
}
