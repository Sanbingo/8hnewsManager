import React, { PureComponent } from 'react'
import { Table, Tag } from 'antd'
import { isNil } from 'lodash'

export default class ListComponent extends PureComponent {
  columns = [{
    key: 'ymd',
    dataIndex: 'ymd',
    title: '日期',
    width: 150
  }, {
    key: 'title',
    dataIndex: 'title',
    title: '标题',
    width: '400px',
    render: (text, record) => {
      return (
        <div>
          <div style={{ maxWidth: '400px', wordBreak: 'break-all'}}>{record.translate}</div>
          <div>
            <a href={record.downloadUrl} target="__blank">{text}</a>
          </div>
        </div>
      );
    }
  }, {
    key: 'wordCount',
    dataIndex: 'wordCount',
    title: '字数统计'
  }, {
    key: 'siteDomain',
    dataIndex: 'siteDomain',
    title: '文章站点'
  }, {
    key: 'categoryId',
    dataIndex: 'categoryId',
    title: '类型',
    render: (text) => {
      return this.props.tags[text] || '-'
    }
  }, {
    key: 'spiderDetailBizStatus',
    dataIndex: 'spiderDetailBizStatus',
    title: '状态',
    render: (text) => {
      const { spiderDetailBizStatus={} } = this.props.initData
      if (isNil(text)) {
        return '-'
      }
      return <Tag>{spiderDetailBizStatus[text]}</Tag>
    }
  }, {
    key: 'operator',
    dataIndex: 'operator',
    title: '操作',
    width: 100,
    render: (text, {id}) => {
      return (
        <a onClick={() => {
          this.props.onHandleTranslate(id)
        }}>翻译</a>
      );
    }
  }]
  render() {
    const { list, pagination, onHandlePagination, loading } = this.props;
    return (
      <Table
        rowKey="id"
        loading={loading.effects['posts/query']}
        onChange={onHandlePagination}
        pagination={pagination}
        columns={this.columns}
        dataSource={list}
      />
    );
  }
}
