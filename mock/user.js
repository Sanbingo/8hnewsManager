import { Mock, Constant, qs, randomAvatar, reqFetch } from './_utils'
import rp from 'request-promise';

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
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
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
    username: 'zl',
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
    const user = adminUsers.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie(
        'token',
        JSON.stringify({ id: user[0].id, deadline: now.getTime() }),
        {
          maxAge: 900000,
          httpOnly: true,
        }
      )
      res.json({ success: true, message: 'Ok' })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${ApiPrefix}/user/logout`](req, res) {
    res.clearCookie('token')
    res.status(200).end()
  },

  [`GET ${ApiPrefix}/user`](req, res) {
    const cookie = req.headers.cookie || ''
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' })
    const response = {}
    let user = {}
    if (!cookies.token) {
      res.status(200).send({ message: 'Not Login' })
      return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.find(_ => _.id === token.id)
      if (userItem) {
        const { password, ...other } = userItem
        user = other
      }
    }
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

  [`POST ${ApiPrefix}/user`](req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.avatar =
      newData.avatar ||
      Mock.Random.image(
        '100x100',
        Mock.Random.color(),
        '#757575',
        'png',
        newData.nickName.substr(0, 1)
      )
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

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
