import React, { PureComponent } from 'react';
import { Table, Modal, Tag } from 'antd';
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'

const { confirm } = Modal

@withI18n()
class ListComponent extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onCheckKeysecret, i18n } = this.props

    if (e.key === '1') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    } else if (e.key === '2') {
      onCheckKeysecret(record)
    }
  }
  columns = [{
    key: 'appId',
    dataIndex: 'appId',
    title: '应用ID'
  }, {
    key: 'encrypt',
    dataIndex: 'encrypt',
    title: '密钥'
  }, {
    key: 'encryptStatus',
    dataIndex: 'encryptStatus',
    title: '状态',
    render: (text) => {
      if (text === 0) {
        return <Tag color="#87d068">启用</Tag>
      }
      return <Tag color="#9e9e9e">禁用</Tag>
    }
  }, {
    key: 'updateTime',
    dataIndex: 'updateTime',
    title: '时间'
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    render: (text, record) => {
      return (
        <DropOption
          onMenuClick={e => this.handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: '删除' },
            { key: '2', name: '密钥校验'}
          ]}
        />
      )
    }
  }]
  render() {
    const { list=[], pagination, onHandlePagination, loading } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={list}
        rowKey="id"
        loading={loading.effects['keysecret/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
