import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item;

class PasswordComponent extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2},
      wrapperCol: { span: 8}
    }
    return (
      <Form {...formItemLayout} >
        <FormItem
          label="旧密码"
        >
          {getFieldDecorator('oldpwd', {
            rules: [{ required: true }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="新密码"
        >
          {getFieldDecorator('newpwd', {
            rules: [{ required: true }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          label="确认密码"
        >
          {getFieldDecorator('confirmpwd', {
            rules: [{ required: true }]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem>
          <Button style={{ marginRight: '5px' }}>重置</Button>
          <Button type="primary">确定</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({})(PasswordComponent)
