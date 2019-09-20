import React, { Component } from 'react';
import { Form, Button, DatePicker } from 'antd'
import { createOptions, arrayToMapObject } from '../../common/index'

const FormItem = Form.Item;

class FilterComponent extends Component {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { initData, allSources } = this.props;
    const { getFieldDecorator } = this.props.form;
    const sourcesMap = arrayToMapObject(allSources, 'siteDomain', 'siteDomain');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('siteDomain')(
            createOptions(sourcesMap, '新闻站点')
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
