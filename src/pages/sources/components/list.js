import React, { PureComponent } from 'react'
import { Table, Modal } from 'antd'
import { DropOption } from 'components'
import { isNil } from 'lodash'
import { arrayToMapObject } from '../../common'
import SubList from './subList'

const { confirm } = Modal

export default class ListComponent extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, onColumnsItem } = this.props

    if (e.key === '1') {
      onColumnsItem(record)
    } else if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: '确定删除',
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }
  columns = [{
    key: 'siteName',
    dataIndex: 'siteName',
    title: '网站名称'
  }, {
    key: 'siteUrl',
    dataIndex: 'siteUrl',
    title: '网站地址'
  }, {
    key: 'categoryIds',
    dataIndex: 'categoryIds',
    title: '网站类型',
    render: (text) => {
      const { constant={} } = this.props;
      return text && text.map(item => arrayToMapObject(constant, 'categoryId', 'categoryName')[item]).join('、')
    }
  }, {
    key: 'siteRemark',
    dataIndex: 'siteRemark',
    title: '网站备注'
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    render: (text, record) => {
      return (
        <DropOption
          onMenuClick={e => this.handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: '添加栏目' },
            { key: '2', name: '编辑' },
            { key: '3', name: '删除' },
          ]}
        />
      )
    }
  }]
  render() {
    const { list=[], pagination, onHandlePagination, loading, constant, onSpiderItem, onDeleteSpiderItem } = this.props;
    const categoryMap = arrayToMapObject(constant, 'categoryId', 'categoryName')
    return (
      <Table
        columns={this.columns}
        dataSource={list}
        expandedRowRender={(record) => {
          return <SubList original={record} data={record.sourceList} map={categoryMap || {}} onSpiderItem={onSpiderItem} onDeleteSpiderItem={onDeleteSpiderItem} />
        }}
        rowKey="id"
        loading={loading.effects['sources/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    )
  }
}
