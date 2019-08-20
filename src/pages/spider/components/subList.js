import React from 'react';
import { Table } from 'antd';

export default class SubList extends React.Component {
  columns = [{
    key: 'id',
    dataIndex: 'id',
    title: 'ID'
  }, {
    key: 'title',
    dataIndex: 'title',
    title: '标题',
    render: (text, record) => {
      return <a href={record.downloadUrl} target="__blank">{text || record.downloadUrl}</a>
    }
  }, {
    key: 'spiderDetailStatus',
    dataIndex: 'spiderDetailStatus',
    title: '文章状态',
    render: (text, record) => {
      const { spiderDetailStatus } = this.props.initData
      return spiderDetailStatus[text] || '-';
    }
  }, {
    key: 'action',
    dataIndex: 'action',
    title: '操作',
    render: (text, { id, spiderDetailStatus }) => {
      if (spiderDetailStatus === 0 ) {
        return (<a onClick={() => this.props.open(id)}>查看</a>)
      }
      return '-'
    }
  }]
  render() {
    const { data = [], ...tableProps } = this.props;
    return (
      <Table
        onChange={tableProps.onChange}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => `总共 ${total} 条记录`,
        }}
        columns={this.columns}
        dataSource={data}
      />
    );
  }
}
