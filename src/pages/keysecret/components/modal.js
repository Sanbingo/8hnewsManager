import React, { Component } from 'react'
import { Form, Select, Radio, Button, Input, Modal } from 'antd'
import { createOptions, createRadios } from '../../common'
import { keysecret_STATUS } from './consts'

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
    const { onOk, form } = this.props
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
          <FormItem label="AppId">
            {getFieldDecorator('appId', {
              initialValue: item.appId,
              rules: [
                {
                  required: true,
                  message: '请输入AppId'
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="密钥">
            {getFieldDecorator('encrypt', {
              initialValue: item.encrypt,
              rules: [
                {
                  required: true,
                  message: '请输入密钥'
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('encryptStatus', {
              initialValue: item.encryptStatus,
              rules: [
                {
                  required: true,
                  message: '请选择敏感词状态'
                },
              ],
            })(createRadios(keysecret_STATUS))}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
