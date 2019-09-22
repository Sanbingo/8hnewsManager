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
    key: 'categoryId',
    dataIndex: 'categoryId',
    title: '栏目ID'
  }, {
    key: 'siteDomain',
    dataIndex: 'siteDomain',
    title: '爬虫站点',
    width: 300,
  }, {
    key: 'siteUrl',
    dataIndex: 'siteUrl',
    title: '爬虫URL',
  },
  {
    key: 'validReqLimitSize',
    dataIndex: 'validReqLimitSize',
    title: '有效请求阈值'
  },
  {
    key: 'errorReqLimitSize',
    dataIndex: 'errorReqLimitSize',
    title: '错误请求阈值'
  },
  {
    key: 'spiderConfigStatus',
    dataIndex: 'spiderConfigStatus',
    title: '爬虫状态',
    render: (text) => {
      return text ? <Tag color="#9e9e9e">停用</Tag> : <Tag color="#87d068">启用</Tag>
    }
  }, {
    key: 'updateTime',
    dataIndex: 'updateTime',
    title: '操作时间'
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    render: (text, record) => {
      return (
        <DropOption
          onMenuClick={e => this.handleMenuClick(record, e)}
          menuOptions={[
            { key: '1', name: '编辑' }
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
        loading={loading.effects['spidercfg/query']}
        onChange={onHandlePagination}
        pagination={pagination}
      />
    );
  }
}

export default ListComponent;
