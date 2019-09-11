import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';

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
          {getFieldDecorator('dstSiteName')(
            <Input placeholder="站点名称" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('dstSiteUrl')(
            <Input placeholder="站点URL" />
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
      dstSiteName: Form.createFormField({
        value: props.searchForm.dstSiteName
      }),
      dstSiteUrl: Form.createFormField({
        value: props.searchForm.dstSiteUrl
      }),
    }
  }
})(FilterComponent)
