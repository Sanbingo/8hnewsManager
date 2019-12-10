import React, { PureComponent } from 'react'
import { Table, Tag, Button } from 'antd'
import { isNil, get } from 'lodash'
import store from 'store'

export default class ListComponent extends PureComponent {
  state={
    selectedRowKeys: []
  }
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
      const isViewMode = get(store.get('userconfig'), 'cooperateId') === '10002'
      return (
        <a onClick={() => {
          this.props.onHandleTranslate(id)
        }}>{isViewMode ? '查看' : '翻译'}</a>
      );
    }
  }]
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }
  handleIgnore = () => {
    const { selectedRowKeys } = this.state;
    const { list, onHandleIgnore } = this.props;
    
    const postData = selectedRowKeys.map(item => ({
      id: list[item].id,
      spiderDetailBizStatus: 3,
    }))
    onHandleIgnore(postData || [])
    this.setState({
      selectedRowKeys:[]
    })
  }
  render() {
    const { list, pagination, onHandlePagination, loading } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        {
          hasSelected && <Button type="primary" style={{ marginBottom: '5px' }} onClick={this.handleIgnore} disabled={!hasSelected}>
          忽略
        </Button>
        }
        
        <Table
          loading={loading.effects['posts/query']}
          onChange={onHandlePagination}
          pagination={pagination}
          columns={this.columns}
          dataSource={list}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}
