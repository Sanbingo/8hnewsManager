import React, { Component } from 'react'
import { Form, Row, Col, Button, Input, Modal } from 'antd'
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
class SiteModal extends Component {
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
        <Row>
          <Col span="12">
          <FormItem label="站点名称">
            {getFieldDecorator('dstSiteName', {
              initialValue: item.dstSiteName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="站点地址">
            {getFieldDecorator('dstSiteUrl', {
              initialValue: item.dstSiteUrl,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="管理员账号">
            {getFieldDecorator('dstSiteRootAcc', {
              initialValue: item.dstSiteRootAcc,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="管理员密码">
            {getFieldDecorator('dstSiteRootPwd', {
              initialValue: item.dstSiteRootPwd,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          </Col>
          <Col span={12}>
          <FormItem label="数据库用户名">
            {getFieldDecorator('dbUser', {
              initialValue: item.dbUser,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据库密码">
            {getFieldDecorator('dbPwd', {
              initialValue: item.dbPwd,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据库地址">
            {getFieldDecorator('dbAddress', {
              initialValue: item.dbAddress,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据库端口">
            {getFieldDecorator('dbPort', {
              initialValue: item.dbPort,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据库名称">
            {getFieldDecorator('dbName', {
              initialValue: item.dbName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="数据库前缀">
            {getFieldDecorator('dbPrefix', {
              initialValue: item.dbPrefix,
            })(<Input />)}
          </FormItem>
          </Col>
        </Row>


        </Form>
      </Modal>
    )
  }
}

export default SiteModal
