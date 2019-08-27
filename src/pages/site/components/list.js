import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { DropOption } from 'components'

export default class ListComponent extends PureComponent {
  columns = [{
    key: 'siteName',
    dataIndex: 'siteName',
    title: '站点名称'
  }, {
    key: 'siteUrl',
    dataIndex: 'siteUrl',
    title: '站点地址',
    render: (text) => {
      if (!text) return '-'
      return <a href={text} target="__blank">{text}</a>
    }
  }, {
    key: 'adminName',
    dataIndex: 'adminName',
    title: '管理者账号'
  }, {
    key: 'adminPassword',
    dataIndex: 'adminPassword',
    title: '管理者密码'
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
    const { list=[] } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={[{
          siteName: '8小时资讯网',
          siteUrl: 'http://www.8hnews.com',
          adminName: 'aquaman',
          adminPassword: 'Mima666'
        }, {
          siteName: '紫皮资讯网',
          siteUrl: 'http://www.zipppp.com',
          adminName: 'aquaman',
          adminPassword: 'Mima666'
        }]}
      />
    );
  }
}
