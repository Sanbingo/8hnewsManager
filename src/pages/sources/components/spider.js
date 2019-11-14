import React, { Component } from 'react'
import { Form, Select, Radio, Button, Switch, Input, Modal } from 'antd'
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
  renderVerifyConfig() {
    const { form: { getFieldDecorator, getFieldValue }, item={} } = this.props
    const isVerify = getFieldValue('spiderConfigVerify')
    if (isVerify === 0) {
      return (
        <FormItem label="验证Xpath">
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
  renderSpiderCron() {
    const { form: { getFieldDecorator, getFieldValue }, item={} } = this.props
    const configType = getFieldValue('spiderConfigType')
    if (configType === 0) {
      return (
        <FormItem label="Cron计划">
          {getFieldDecorator('cron', {
            initialValue: item.cron
          })(<Input placeholder="自动分配，eg：0 20 0/10 * * ? *" />)}
        </FormItem>
      );
    }
  }
  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props
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
            })(<Input placeholder="带http协议开头" />)}
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
          <FormItem label="标题过滤">
            {getFieldDecorator('titleReplaceRegex', {
              initialValue: item.titleReplaceRegex,
            })(<Input placeholder="<.+?>" />)}
          </FormItem>
          <FormItem label="内容过滤">
            {getFieldDecorator('contentReplaceRegex', {
              initialValue: item.contentReplaceRegex,
            })(<Input placeholder="<.+?>" />)}
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
            })(createRadios({0: '正式', 1: '测试'}))}
          </FormItem>
          {this.renderSpiderCron()}
        </Form>
      </Modal>
    )
  }
}

export default SourcesModal
