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
            })(<Input />)}
          </FormItem>
          <FormItem label="网站地址">
            {getFieldDecorator('siteUrl', {
              initialValue: item.siteUrl,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="网站类型">
            {getFieldDecorator('categoryId', {
              initialValue: item.categoryId,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios(constant.categoryId))}
          </FormItem>
          <FormItem label="网站属性">
            {getFieldDecorator('siteType', {
              initialValue: item.siteType,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios(constant.siteType))}
          </FormItem>
          <FormItem label="网站归属">
            {getFieldDecorator('siteAbroad', {
              initialValue: item.siteAbroad,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios(constant.siteAbroad))}
          </FormItem>
          <FormItem label="是否翻墙">
            {getFieldDecorator('siteGfw', {
              initialValue: item.siteGfw,
              rules: [
                {
                  required: true,
                },
              ],
            })(createRadios(constant.siteGfw))}
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
