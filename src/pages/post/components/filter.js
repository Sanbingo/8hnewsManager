import React, { Component } from 'react';
import { Form, Button, DatePicker } from 'antd'
import moment from 'moment';
import { createOptions } from '../../common/index'

const FormItem = Form.Item;
const TestData = {
  'www.itworldcanada.com': 'www.itworldcanada.com',
  2: '腾讯',
  3: '搜狐',
  4: '新浪'
}
class FilterComponent extends Component {
  handleSubmit = () => {
    const { onSearch, form } = this.props
    const fields = form.getFieldsValue()
    if (fields.ymd) {
      fields.ymd = moment(fields.ymd).format('YYYY-MM-DD')
    }
    onSearch(fields)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('siteDomain')(
            createOptions(TestData, '新闻网站')
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('ymd')(<DatePicker />)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({

})(FilterComponent);
