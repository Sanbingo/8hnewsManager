import React, { PureComponent } from 'react';
import { Table, Modal } from 'antd';
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'

const { confirm } = Modal

@withI18n()
class ListComponent extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: i18n.t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }
  columns = [{
    key: 'adminName',
    dataIndex: 'adminName',
    title: '账号'
  }, {
    key: 'adminPassword',
    dataIndex: 'adminPassword',
    title: '密码',
  }, {
    key: 'company',
    dataIndex: 'company',
    title: '公司'
  }, {
    key: 'customer',
    dataIndex: 'customer',
    title: '客户姓名'
  }, {
    key: 'mobile',
    dataIndex: 'mobile',
    title: '客户手机号'
  }, {
    key: 'remark',
    dataIndex: 'remark',
    title: '备注'
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
          adminName: 'zhangSan',
          adminPassword: '123456',
          company: 'xx网络科技有限公司',
          customer: '张三',
          mobile: '13980809090',
          remark: '星级客户',
        }, {
          adminName: 'zhangSan',
          adminPassword: '123456',
          company: 'xx网络科技有限公司',
          customer: '张三',
          mobile: '13980809090',
          remark: '星级客户',
        }]}
      />
    );
  }
}

export default ListComponent;
