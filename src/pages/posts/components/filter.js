import React, { Component } from 'react'
import { Form, Button, DatePicker, Input } from 'antd'
import moment from 'moment';
import { createOptions, arrayToMapObject } from '../../common/index'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const WORD_COUNT_MAP = {
  150: '150个字以上',
  250: '250个字以上',
  500: '500个字以上'
}

class FilterComponent extends Component {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { tags, initData, empower={} } = this.props
    const siteDomains = empower.siteDomains && empower.siteDomains.reduce((a, b) => {
      a[b] = b;
      return a;
    }, {})
    const categorymap = arrayToMapObject(empower.categories, 'categoryId', 'categoryName');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>{getFieldDecorator('ymd')(<RangePicker disabledDate={(date) => {
          return date < moment().subtract(30, "days")
        }} />)}</FormItem>
        <FormItem>
          {getFieldDecorator('siteDomain')(createOptions(siteDomains, '文章站点'))}
        </FormItem>
        <FormItem>
          {getFieldDecorator('wordCount')(createOptions(WORD_COUNT_MAP, '文章字数'))}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId')(createOptions(categorymap, '文章类型'))}
        </FormItem>
        <FormItem>
          {getFieldDecorator('spiderDetailBizStatus')(
            createOptions(initData.spiderDetailBizStatus, '文章状态')
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>
            查询
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create({
  onValuesChange: (props, changedValues) => {
    props.onChange(changedValues)
  },
  mapPropsToFields: props => {
    return {
      ymd: Form.createFormField({
        value: props.searchForm.ymd,
      }),
      spiderDetailBizStatus: Form.createFormField({
        value: props.searchForm.spiderDetailBizStatus,
      }),
      siteDomain: Form.createFormField({
        value: props.searchForm.siteDomain,
      }),
      wordCount: Form.createFormField({
        value: props.searchForm.wordCount,
      }),
      categoryId: Form.createFormField({
        value: props.searchForm.categoryId,
      }),
    }
  },
})(FilterComponent)
