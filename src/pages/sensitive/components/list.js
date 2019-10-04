import React, { PureComponent } from 'react';
import { Table, Modal, Tag } from 'antd';
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'

const { confirm } = Modal

@withI18n()
class ListComponent extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }
  columns = [{
    key: 'sensitiveWord',
    dataIndex: 'sensitiveWord',
    title: '敏感词'
  }, {
    key: 'sensitiveWordsStatus',
    dataIndex: 'sensitiveWordsStatus',
    title: '状态',
    render: (text) => {
      if (text === 0) {
        return <Tag color="#87d068">启用</Tag>
      }
      return <Tag color="#9e9e9e">禁用</Tag>
    }
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    render: (text, record) => {
      return (
        <DropOption
          onMenuClick={e => this.handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: '编辑' },
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
        loading={loading.effects['sensitive/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
