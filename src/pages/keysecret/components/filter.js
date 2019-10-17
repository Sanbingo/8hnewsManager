import React, { PureComponent } from 'react';
import { Form, Tooltip, Button, Icon } from 'antd';
import { createOptions } from '../../common/index'
import { keysecret_STATUS } from './consts'

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
          <Button type="primary" onClick={this.handleSubmit}>查询</Button>
          <Button style={{ marginLeft: '10px', marginRight: '10px' }} onClick={() => onAddItem()}>新建</Button>
          <Tooltip title="仅支持有道云密钥">
            <Icon type="exclamation-circle" />
          </Tooltip>
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
      keysecretWordsStatus: Form.createFormField({
        value: props.searchForm.keysecretWordsStatus
      }),
    }
  }
})(FilterComponent)
