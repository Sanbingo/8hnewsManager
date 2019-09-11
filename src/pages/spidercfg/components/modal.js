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
    console.log('handle ok', this.props)
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      console.log('formdata', data)
      onOk(data)
    })
  }
  renderVerifyConfig() {
    const { form: { getFieldDecorator, getFieldValue }, item={} } = this.props
    const isVerify = getFieldValue('spiderConfigVerify')
    if (isVerify === 0) {
      return (
        <FormItem label="登陆Xpath">
          {getFieldDecorator('verifyXpath', {
            initialValue: item.verifyXpath,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
      );
    }
  }
  render() {
    const { item = {}, onOk, form, constant = {}, ...modalProps } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal" {...formItemLayout}>
          <FormItem label="链接正则">
            {getFieldDecorator('linksRegex', {
              initialValue: item.linksRegex,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="标题XPath">
            {getFieldDecorator('titleXpath', {
              initialValue: item.titleXpath,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="内容XPath">
            {getFieldDecorator('contentXpath', {
              initialValue: item.contentXpath,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="验证">
            {getFieldDecorator('spiderConfigVerify', {
              initialValue: item.spiderConfigVerify,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios({0: '开启', 1: '关闭'}))}
          </FormItem>
          {this.renderVerifyConfig()}
          <FormItem label="环境">
            {getFieldDecorator('spiderConfigType', {
              initialValue: item.spiderConfigType,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios({0: '线上', 1: '测试'}))}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
