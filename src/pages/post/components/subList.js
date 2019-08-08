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
      return <a href={record.downloadUrl} target="__blank">{text}</a>
    }
  }, {
    key: 'creator',
    dataIndex: 'creator',
    title: '作者'
  }, {
    key: 'action',
    dataIndex: 'action',
    title: '操作',
    render: (text, { id }) => {
      return (<a onClick={() => this.props.open(id)}>翻译</a>)
    }
  }]
  render() {
    const { data = [] } = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={data}
        pagination={false}
      />
    );
  }
}
