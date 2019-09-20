import React, { PureComponent } from 'react'
import { Table, Divider, Popconfirm, Icon } from 'antd'

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
    render: (text, record, index) => {
      return (
        <span>
          <a href="#" onClick={() => this.props.onSpiderItem(record)}>配置</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定执行这个操作"
            onConfirm={() => {
               this.props.onDeleteSpiderItem({
                 index,
                 original: this.props.original
               })
            }}
            okText="确定"
            cancelText="取消"
          >
            <a><Icon type="delete" key="delete" />删除</a>
          </Popconfirm>
        </span>
      );
    }
  }]
  render() {
    const { data=[] } = this.props;
    return (
      <Table
        rowKey="id"
        columns={this.columns}
        dataSource={data}
        pagination={false}
      />
    );
  }
}
