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
    key: 'userAcc',
    dataIndex: 'userAcc',
    title: '账号'
  }, {
    key: 'userPwd',
    dataIndex: 'userPwd',
    title: '密码',
    render: () => 123456
  }, {
    key: 'cooperateName',
    dataIndex: 'cooperateName',
    title: '公司'
  }, {
    key: 'cooperatePersonName',
    dataIndex: 'cooperatePersonName',
    title: '客户姓名'
  }, {
    key: 'cooperateContactInfo',
    dataIndex: 'cooperateContactInfo',
    title: '客户手机号'
  }, {
    key: 'remark',
    dataIndex: 'remark',
    title: '备注'
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    render: (text, record) => {
      return '-'
      // 暂不开放操作
      // return (
      //   <DropOption
      //     onMenuClick={e => this.handleMenuClick(record, e)}
      //     menuOptions={[
      //       { key: '1', name: '编辑' },
      //       { key: '2', name: '删除' },
      //     ]}
      //   />
      // )
    }
  }]
  render() {
    const { list=[], pagination, onHandlePagination, loading } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={list}
        rowKey="id"
        loading={loading.effects['administrator/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
