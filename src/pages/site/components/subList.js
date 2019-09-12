import React, { PureComponent } from 'react';
import { Table } from 'antd';

export default class SubList extends PureComponent {
  columns = [{
    key: 'userId',
    dataIndex: 'userId',
    title: 'ID',
  }, {
    key: 'userRealName',
    dataIndex: 'userRealName',
    title: '员工姓名',
  }, {
    key: 'userAcc',
    dataIndex: 'userAcc',
    title: '员工账号',
  }, {
    key: 'operation',
    dataIndex: 'operation',
    title: '操作',
    render: () => "-"
  }]
  render() {
    const { data=[] } = this.props;
    return (
      <Table rowKey="id" columns={this.columns} dataSource={data} pagination={false} />
    );
  }
}
