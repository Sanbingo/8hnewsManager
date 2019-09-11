import rp from 'request-promise'
import { Constant } from './_utils'
const { ApiPrefix } = Constant

module.exports = {
  [`POST ${ApiPrefix}/cooperates`](req, res) {
    rp({
      uri: 'http://139.196.86.217:8088/info/cooperate/queryList',
      method: 'POST',
      body: req.body,
      json: true,
    }).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(200).json({
        status: 1002,
        message: err
      })
    })
  },
  [`POST ${ApiPrefix}/cooperate`](req, res) {
    rp({
      uri: 'http://139.196.86.217:8088/info/cooperate/add',
      method: 'POST',
      body: {
        entity: {
          ...req.body
        }
      },
      json: true
    }).then((data) => {
      res.status(200).json(data)
    }).catch((err) => {
      res.status(200).json({
        status: 1002,
        message: err
      })
    })
  },
}
