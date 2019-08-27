import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class FilterComponent extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" style={{ marginBottom: "10px" }}>
        <FormItem>
          {getFieldDecorator('siteDomain')(
            <Input placeholder="站点名称" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary">查询</Button>
          <Button style={{ marginLeft: '10px' }}>新建</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({})(FilterComponent)
