import React, { Component } from 'react'
import { Form, Select, Radio, Button, Input, Modal } from 'antd'
import { createOptions, createRadios } from '../../common'
import { SENSITIVE_STATUS } from './consts'

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
          <FormItem label="敏感词">
            {getFieldDecorator('sensitiveWord', {
              initialValue: item.sensitiveWord,
              rules: [
                {
                  required: true,
                  message: '请输入敏感词'
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('sensitiveWordsStatus', {
              initialValue: item.sensitiveWordsStatus,
              rules: [
                {
                  required: true,
                  message: '请选择敏感词状态'
                },
              ],
            })(createRadios(SENSITIVE_STATUS))}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
