import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { createOptions } from '../../common/index'
import { SENSITIVE_STATUS } from './consts'

const FormItem = Form.Item;

class FilterComponent extends PureComponent {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { onAddItem } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: "10px" }}>
        <FormItem>
          {getFieldDecorator('queryKey')(
            <Input placeholder="敏感词" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('sensitiveWordsStatus')(
            createOptions(SENSITIVE_STATUS, '敏感词状态')
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>查询</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => onAddItem()}>新建</Button>
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
      queryKey: Form.createFormField({
        value: props.searchForm.queryKey
      }),
      sensitiveWordsStatus: Form.createFormField({
        value: props.searchForm.sensitiveWordsStatus
      }),
    }
  }
})(FilterComponent)
