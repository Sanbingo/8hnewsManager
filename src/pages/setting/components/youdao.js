import React, { PureComponent } from 'react'
import { Form, Input, Button, Alert } from 'antd'

const FormItem = Form.Item;

class Youdao extends PureComponent {
  onSetting = () => {
    const { getFieldsValue, validateFields } = this.props.form
    validateFields((err) => {
      if (err) return err;
      const value = getFieldsValue()
      this.props.handleSetting(value)
    })
  }
  onValidate = () => {
    const { getFieldsValue, validateFields } = this.props.form
    validateFields((err) => {
      if (err) return err;
      const value = getFieldsValue()
      this.props.handleValidate(value)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { validation={} } = this.props;
    const { isValid, text } = validation;

    const formItemLayout = {
     labelCol: {
       xs: { span: 24 },
       sm: { span: 2 },
     },
     wrapperCol: {
       xs: { span: 24 },
       sm: { span: 10 },
     },
   };
    return (
      <Form {...formItemLayout}>
        <FormItem
          label="AppKey"
        >
          {getFieldDecorator('appKey', {
            rules: [{ required: true }]
          })(<Input />)}
        </FormItem>
        <FormItem
          label="AppSecret"
        >
          {getFieldDecorator('appSecret', {
            rules: [{ required: true }]
          })(<Input />)}
        </FormItem>
        <FormItem
          offset={2}
        >
          <Button style={{ marginRight: '10px' }} onClick={this.onValidate}>验证</Button>
          <Button type="primary" onClick={this.onSetting}>设置</Button>
        </FormItem>
        <FormItem>
          { text && <Alert message={text} type={isValid ? 'success' : 'error'} closable /> }
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({

})(Youdao)
