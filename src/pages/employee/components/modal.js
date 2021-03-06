import React, { Component } from 'react'
import { Form, Select, Radio, Button, Input, Modal } from 'antd'
import { createOptions, createRadios } from '../../common'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

@Form.create()
class SourcesModal extends Component {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props
    const { validateFields, getFieldsValue } = form
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal" {...formItemLayout}>
          <FormItem label="员工姓名">
            {getFieldDecorator('userRealName', {
              initialValue: item.userRealName,
              rules: [
                {
                  pattern: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/,
                  message: '只支持中英文名称',
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="员工手机">
            {getFieldDecorator('userPhoneNum', {
              initialValue: item.userPhoneNum,
              rules: [
                {
                  message: '请输入员工手机',
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="性别">
            {getFieldDecorator('userInfoGander', {
              initialValue: item.userInfoGander,
              rules: [
                {
                  message: '请选择性别',
                  required: true,
                },
              ],
            })(createRadios({1: '男', 0: '女'}))}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              initialValue: item.remark,
            })(<TextArea />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
