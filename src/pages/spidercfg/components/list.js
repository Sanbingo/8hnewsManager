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
    key: 'siteSourceId',
    dataIndex: 'siteSourceId',
    title: '源站点ID'
  }, {
    key: 'linksRegex',
    dataIndex: 'linksRegex',
    title: '链接正则',
    width: 300,
    render: (text, record) => (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
        {text}
      </div>
    ),
  }, {
    key: 'titleXpath',
    dataIndex: 'titleXpath',
    title: '标题Xpath',
  }, {
    key: 'contentXpath',
    dataIndex: 'contentXpath',
    title: '内容Xpath'
  }, {
    key: 'spiderConfigVerify',
    dataIndex: 'spiderConfigVerify',
    title: '验证',
    render: (text) => {
      return text ? '关闭' : '开启'
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
