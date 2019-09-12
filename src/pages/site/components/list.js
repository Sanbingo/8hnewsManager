import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import { isNil } from 'lodash';
import { DropOption } from 'components'
import { withI18n } from '@lingui/react'
import SubList from './subList'

const { confirm } = Modal

@withI18n()
class ListComponent extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onBindEmployee, onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onBindEmployee(record)
    } else if (e.key === '2') {
      onEditItem(record)
    } else if (e.key === '3') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }
  columns = [{
    key: 'dstSiteName',
    dataIndex: 'dstSiteName',
    title: '站点名称'
  }, {
    key: 'dstSiteUrl',
    dataIndex: 'dstSiteUrl',
    title: '站点URL',
  }, {
    key: 'dstSiteRootAcc',
    dataIndex: 'dstSiteRootAcc',
    title: '管理员账号'
  }, {
    key: 'dstSiteRootPwd',
    dataIndex: 'dstSiteRootPwd',
    title: '管理员密码'
  }, {
    key: 'dstSiteAccPrefix',
    dataIndex: 'dstSiteAccPrefix',
    title: '站点前缀'
  }, {
    key: 'remark',
    dataIndex: 'remark',
    title: '备注',
    render: (text) => {
      if (isNil(text)) return '-'
      return text
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
            { key: '1', name: '添加员工' },
            { key: '2', name: '编辑' },
            { key: '3', name: '删除' },
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
        expandedRowRender={(record) => {
          return <SubList data={record.users || []} />
        }}
        loading={loading.effects['site/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
