import React, { Component } from 'react'
import { Table, message, Modal } from 'antd'

class SiteModal extends Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
  }
  columns = [{
    key: "id",
    dataIndex: "id",
    title: "ID"
  }, {
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
    const { onOk, employees, selectKeys=[] } = this.props;
    // const { selectedRowKeys=[] } = this.state;
    const data = selectKeys.map(item => ({ userId: employees[item] && employees[item].id}))
    console.log('data', data)
    onOk(data)
  }
  onSelectChange = selectKeys => {
    // this.setState({ selectedRowKeys });
    this.props.onSelectKeys(selectKeys)
  };

  render() {
    const { onOk, employees=[], selectKeys=[], ...modalProps } = this.props
    // const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Table size="small" rowSelection={rowSelection} columns={this.columns} dataSource={employees} pagination={false} />
      </Modal>
    )
  }
}

export default SiteModal
