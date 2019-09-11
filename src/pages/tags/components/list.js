import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
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
    key: 'categoryId',
    dataIndex: 'categoryId',
    title: 'ID'
  }, {
    key: 'categoryName',
    dataIndex: 'categoryName',
    title: '标签名称',
  }, {
    key: 'createTime',
    dataIndex: 'createTime',
    title: '创建时间'
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
            { key: '2', name: '删除' },
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
        rowKey="categoryId"
        loading={loading.effects['tags/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
