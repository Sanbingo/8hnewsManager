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
        key: item.key,
      }
      onOk(data)
    })
  }
  render() {
    const { item = {}, onOk, form, constant = {}, ...modalProps } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal" {...formItemLayout}>
        <FormItem label="网站名称">
          {getFieldDecorator('siteName', {
            initialValue: item.siteName,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="不用带http协议" />)}
        </FormItem>
        <FormItem label="网站地址">
          {getFieldDecorator('siteUrl', {
            initialValue: item.siteUrl,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="不用带http协议" />)}
        </FormItem>
        <FormItem label="网站备注">
          {getFieldDecorator('siteRemark', {
            initialValue: item.siteRemark,
          })(<TextArea />)}
        </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
