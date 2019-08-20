import React, { PureComponent } from 'react'
import { Table, Tag } from 'antd'
import { withI18n } from '@lingui/react'
import SubList from './subList'
import styles from './List.less'

@withI18n()
class List extends PureComponent {
  columns = [
    {
      title: '日期',
      dataIndex: 'ymd',
    },
    {
      title: '新闻站点',
      dataIndex: 'siteDomain',
    },
    {
      title: '起止时间',
      dataIndex: 'startTime',
      render: (text, record) => {
        return (
          <div>
            {text.slice(11)}-{record.endTime.slice(11)}
          </div>
        );
      }
    },
    {
      title: '网页数量',
      dataIndex: 'count',
    },
    {
      title: '爬虫状态',
      dataIndex: 'spiderInfoStatus',
      render: (text) => {
        const {spiderInfoStatus} = this.props.initData
        return <Tag>{spiderInfoStatus[text]}</Tag> || '-'
      }
    },
  ]
  render() {
    const { i18n, ...tableProps } = this.props
    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        bordered
        onExpand={(expanded, record) => { expanded && tableProps.getExpandedRow(record.id)}}
        expandRowByClick={true}
        expandedRowRender={(record) => {
          let tempData = []
          let tempPagination = { current: 1}
          const { expandData, onTranslate, initData, onSubPagination } = tableProps
          if (expandData && expandData[record.id]) {
            tempData = expandData[record.id].list
            tempPagination = expandData[record.id].pagination
          }
          return <SubList data={tempData}  open={onTranslate} initData={initData} pagination={tempPagination} onChange={(val) => onSubPagination(val, record.id)} />
        }}
        className={styles.table}
        columns={this.columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

export default List
