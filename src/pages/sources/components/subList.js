import React, { PureComponent } from 'react'
import { Table } from 'antd'

export default class SubList extends PureComponent {
  columns = [{
    key: 'number',
    dataIndex: 'number',
    title: '序号',
    render: (text, record, index) => {
      return index + 1;
    }
  }, {
    key: 'siteUrl',
    dataIndex: 'siteUrl',
    title: '栏目入口'
  }, {
    key: 'categoryId',
    dataIndex: 'categoryId',
    title: '类型',
    render: (text) => {
      const { map } = this.props;
      return map[text]
    }
  }, {
    key: 'operation',
    dataIndex: 'operation',
    title: '操作',
    render: (text, record) => {
      return (
        <span>
          <a href="#" onClick={() => this.props.onSpiderItem(record)}>配置</a>
        </span>
      );
    }
  }]
  render() {
    const { data=[] } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={data}
        pagination={false}
      />
    );
  }
}
