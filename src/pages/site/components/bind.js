import React, { Component } from 'react'
import { Table, message, Modal } from 'antd'

class SiteModal extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
  }
  columns = [{
    key: 'userRealName',
    dataIndex: 'userRealName',
    title: '姓名'
  }, {
    key: 'userInfoGander',
    dataIndex: 'userInfoGander',
    title: '性别',
    render: (text) => {
      if (text) return '男'
      return '女'
    }
  }, {
    key: 'userPhoneNum',
    dataIndex: 'userPhoneNum',
    title: '手机'
  }]
  handleOk = () => {
    const { onOk, employees } = this.props;
    const { selectedRowKeys=[] } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warning('请选择员工~')
    } else {
      const data = selectedRowKeys.map(item => ({ userId: employees[item] && employees[item].id}))
      onOk(data)
    }
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { onOk, employees=[], ...modalProps } = this.props
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Table rowSelection={rowSelection} columns={this.columns} dataSource={employees} />
      </Modal>
    )
  }
}

export default SiteModal
