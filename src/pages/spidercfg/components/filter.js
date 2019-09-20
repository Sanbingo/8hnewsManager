import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';
import { createOptions } from '../../common/index'

const FormItem = Form.Item;

class FilterComponent extends PureComponent {
  handleSubmit = () => {
    this.props.onSearch()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tags } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: "10px" }}>
        <FormItem>
          {getFieldDecorator('siteSourceId')(
            <Input placeholder="源站点ID" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId')(
            createOptions(tags, '栏目类型')
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
      siteSourceId: Form.createFormField({
        value: props.searchForm.siteSourceId
      }),
      categoryId: Form.createFormField({
        value: props.searchForm.categoryId
      }),
    }
  }
})(FilterComponent)
