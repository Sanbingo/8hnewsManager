import React, { PureComponent } from 'react'
import { Table, Avatar } from 'antd'
import { withI18n } from '@lingui/react'
import { Ellipsis } from 'ant-design-pro'
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
      title: '站点',
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
      dataIndex: 'status',
      render: (text) => {
        if (text === 1) {
          return '正常'
        }
        return '异常'
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
          const { expandData, onTranslate } = tableProps
          if (expandData && expandData[record.id]) {
            tempData = expandData[record.id].list
          }
          return <SubList data={tempData}  open={onTranslate}/>
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
