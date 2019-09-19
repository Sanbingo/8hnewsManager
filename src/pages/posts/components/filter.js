import React, { Component } from 'react';
import { Form, Button, DatePicker, Input } from 'antd'
import { createOptions, arrayToMapObject } from '../../common/index'

const FormItem = Form.Item;

class FilterComponent extends Component {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { siteDomains, initData } = this.props;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('ymd')(<DatePicker />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('siteDomain')(<Input />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('spiderDetailBizStatus')(
            createOptions(initData.spiderDetailBizStatus, '文章状态')
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId')(
            createOptions(initData.categoryId, '文章类型')
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
  },
  mapPropsToFields: (props) => {
    return {
      ymd: Form.createFormField({
        value: props.searchForm.ymd
      }),
      spiderDetailBizStatus: Form.createFormField({
        value: props.searchForm.spiderDetailBizStatus
      }),
      siteDomain: Form.createFormField({
        value: props.searchForm.siteDomain
      }),
      categoryId: Form.createFormField({
        value: props.searchForm.categoryId
      }),

    }
  }
})(FilterComponent);
