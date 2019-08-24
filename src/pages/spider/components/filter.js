import React, { Component } from 'react';
import { Form, Button, DatePicker } from 'antd'
import { createOptions } from '../../common/index'

const FormItem = Form.Item;
const SITE_Data = {
  'www.itworldcanada.com': 'www.itworldcanada.com',
}
class FilterComponent extends Component {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { initData } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('siteDomain')(
            createOptions(SITE_Data, '新闻站点')
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('ymd')(<DatePicker />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('spiderInfoStatus')(
            createOptions(initData.spiderInfoStatus, '爬虫状态')
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>查询</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues) => {
    props.onChange(changedValues)
  }
})(FilterComponent);
