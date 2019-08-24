import React from 'react'
import { Popconfirm, Select, Radio, Input } from 'antd'
import { forEach, isArray } from 'lodash'

const { Option } = Select

export const TipBtn = props => {
  return (
    <Popconfirm
      title="确定执行这个操作"
      onConfirm={props.onOk}
      okText="确定"
      cancelText="取消"
    >
      <a>{props.children}</a>
    </Popconfirm>
  )
}

export const createOptions = (obj, msg) => {
  if (!obj) {
    return <Input />
  }
  const ret = []
  forEach(obj, (value, key) =>
    ret.push(
      <Option key={key} value={key}>
        {value}
      </Option>
    )
  )
  return (
    <Select style={{ width: '200px' }} placeholder={msg} allowClear={true} showSearch={true} optionFilterProp="children" dropdownMatchSelectWidth={false}>
      {ret}
    </Select>
  )
}

export const createRadios = obj => {
  if (!obj) {
    return <Input />
  }
  const ret = []
  forEach(obj, (value, key) =>
    ret.push(
      <Radio key={key} value={parseInt(key, 10)}>
        {value}
      </Radio>
    )
  )
  return <Radio.Group>{ret}</Radio.Group>
}

export const arrayToMapObject = (arr, k, v) => {
  if (isArray(arr)) {
    return arr.reduce((p, c) => {
      p[c[k]] = c[v]
      return p
    }, {})
  }
  return {}
}
