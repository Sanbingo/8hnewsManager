import { Mock, Constant, qs, randomAvatar } from './_utils'

const { ApiPrefix } = Constant

let usersListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar() {
        return randomAvatar()
      },
    },
  ],
})

let database = usersListData.data

module.exports = {
  [`GET ${ApiPrefix}/sources`](req, res) {
    // const { query } = req
    res.status(200).json({
      data: database,
      total: database.length,
    })
  }
}
