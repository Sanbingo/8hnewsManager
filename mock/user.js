import { Mock, Constant, qs, randomAvatar } from './_utils'
import rp from 'request-promise';

const ROLE_TYPE = {
  SUPERADMIN: 0,
  ADMINISTRATOR: 1,
  EMPLOYEE: 2,
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
}

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

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'default',
  DEVELOPER: 'developer',
}

const userPermission = {
  [ROLE_TYPE.SUPERADMIN]: {
    // visit: ['1', '6', '8', '9', '91', '92', '93', '10', '101', '102', '103', '104'],
    visit: ['101', '102', '103', '104', '105'],
    role: ROLE_TYPE.SUPERADMIN,
  },
  [ROLE_TYPE.ADMINISTRATOR]: {
    visit: ['6', '8', '9', '91', '92', '94' ],
    role: ROLE_TYPE.ADMINISTRATOR,
  },
  [ROLE_TYPE.EMPLOYEE]: {
    visit: ['6', '8'],
    role: ROLE_TYPE.EMPLOYEE,
  },
  DEFAULT: {
    visit: ['6', '8'],
    role: EnumRoleType.DEFAULT,
  },
  MANAGER: {
    visit: ['1', '6', '8', '9', '91', '92', '93'],
    role: EnumRoleType.MANAGER,
  },
  ADMIN: {
    role: EnumRoleType.ADMIN,
  },
  DEVELOPER: {
    visit: ['1', '6', '8', '9', '91', '92', '93', '10', '101', '102', '103'],
    role: EnumRoleType.DEVELOPER,
  },
}

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
    avatar: randomAvatar(),
  },
  {
    id: 1,
    username: 'aquaman',
    password: 'Mima666',
    permissions: userPermission.DEVELOPER,
    avatar: randomAvatar(),
  },
  {
    id: 2,
    username: 'jiang',
    password: '87654312',
    permissions: userPermission.DEFAULT,
    avatar: randomAvatar(),
  },
  {
    id: 3,
    username: 'zhang',
    password: '87654312',
    permissions: userPermission.DEFAULT,
    avatar: randomAvatar(),
  },
  {
    id: 4,
    username: 'zhangSan',
    password: '123456',
    permissions: userPermission.MANAGER,
    avatar: randomAvatar(),
  },
]

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {
  [`POST ${ApiPrefix}/token`](req, res) {
    const { username, password } = req.body
    rp({
      uri: 'http://www.8hnews.com/wp-json/jwt-auth/v1/token',
      method: 'POST',
      body: {
        username,
        password
      },
      json: true
    }).then((data) => {
      res.cookie('wptoken', data.token, {
        maxAge: 365*24*60*60,
        httpOnly: true,
      })
      res.json({ success: true, message: 'Ok' })

    }).catch((err) => {
      res.status(400).end()
    })
    // let fetch = reqFetch('http://www.8hnews.com/wp-json/jwt-auth/v1/token', 'POST', {
    //   username,
    //   password
    // })
    // fetch.then((data) => {
    //   console.log('data...', data)
    //   res.send(data)
    // }, (err) => {
    //   console.log('err...', err)
    //   res.status(200).json({
    //     data: err,
    //     message: 'search failure'
    //   })
    // })
    // fetch = null
  },
  [`POST ${ApiPrefix}/user/login`](req, res) {
    const { username, password } = req.body
    rp({
      uri: 'http://139.196.86.217:8088/info/test/auth/login',
      method: 'POST',
      body: {
        userAcc: username,
        passWord: password
      },
      json: true,
      resolveWithFullResponse: true
    }).then(({headers, body}, other) => {
      const now = new Date()
      now.setDate(now.getDate() + 1)
        res.cookie(
          'token',
          JSON.stringify({ id: body.data.roles[0].roleType, deadline: now.getTime(), key: headers.authorization }),
          {
            maxAge: 365*24*60*60,
            httpOnly: true,
          }
        )
      res.json({ success: true, message: 'Ok', data: body.data })
    }).catch((err) => {
      console.log('err...', err)
      res.status(400).end()
    })
  },

  [`GET ${ApiPrefix}/user/logout`](req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`POST ${ApiPrefix}/user`](req, res) {
    const { username } = req.body
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    let user = {
      avatar: randomAvatar(),
      username
    }
    if (!cookies.token) {
      res.status(401).send({ message: 'token无效，请重新登录~' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token && token.deadline < new Date().getTime()) {
      res.status(401).send({ message: 'token无效，请重新登录~' })
      return
    }
    response.permissions = userPermission[token.id]
    response.user = user
    res.json(response)
  },

  [`GET ${ApiPrefix}/users`](req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter(item => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()

              if (start && end) {
                return now >= start && now <= end
              }
              return true
            }
            return (
              String(item[key])
                .trim()
                .indexOf(decodeURI(other[key]).trim()) > -1
            )
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
    })
  },

  [`POST ${ApiPrefix}/users/delete`](req, res) {
    const { ids=[] } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  // [`POST ${ApiPrefix}/user`](req, res) {
  //   const newData = req.body
  //   newData.createTime = Mock.mock('@now')
  //   newData.avatar =
  //     newData.avatar ||
  //     Mock.Random.image(
  //       '100x100',
  //       Mock.Random.color(),
  //       '#757575',
  //       'png',
  //       newData.nickName.substr(0, 1)
  //     )
  //   newData.id = Mock.mock('@id')
  //
  //   database.unshift(newData)
  //
  //   res.status(200).end()
  // },

  [`GET ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`DELETE ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },

  [`PATCH ${ApiPrefix}/user/:id`](req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map(item => {
      if (item.id === id) {
        isExist = true
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(200).json(NOTFOUND)
    }
  },
}
