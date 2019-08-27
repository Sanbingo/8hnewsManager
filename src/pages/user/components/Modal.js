import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Select, DatePicker } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import city from 'utils/city'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
@withI18n()
@Form.create()
class UserModal extends PureComponent {
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
      data.address = data.address.join(' ')
      onOk(data)
    })
  }

  render() {
    const { item = {}, onOk, form, i18n, ...modalProps } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal" {...formItemLayout}>
          <FormItem label="姓名">
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="账号">
            {getFieldDecorator('userName', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="密码">
            {getFieldDecorator('password', {
              initialValue: item.nickName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Gender`}>
            {getFieldDecorator('isMale', {
              initialValue: item.isMale,
              rules: [
                {
                  required: true,
                  type: 'boolean',
                },
              ],
            })(
              <Radio.Group>
                <Radio value>
                  <Trans>男</Trans>
                </Radio>
                <Radio value={false}>
                  <Trans>女</Trans>
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="出生日期">
            {getFieldDecorator('age', {
              initialValue: item.age,
              rules: [
                {
                  required: true,
                  type: 'number',
                },
              ],
            })(<DatePicker />)}
          </FormItem>
          <FormItem label={i18n.t`Phone`}>
            {getFieldDecorator('phone', {
              initialValue: item.phone,
              rules: [
                {
                  required: true,
                  pattern: /^1[34578]\d{9}$/,
                  message: i18n.t`The input is not valid phone!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n.t`Email`}>
            {getFieldDecorator('email', {
              initialValue: item.email,
              rules: [
                {
                  // required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: i18n.t`The input is not valid E-mail!`,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="分配站点">
            {getFieldDecorator('address', {
              initialValue: item.address && item.address.split(' '),
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select mode="multiple" style={{ width: '100%' }} placeholder="搜索站点" allowClear={true}>
                <Option key="0" value="0">全选</Option>
                <Option key="1" value="1">www.baidu.com</Option>
                <Option key="2" value="2">www.qq.com</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
