import React, { PureComponent } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class FilterComponent extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { onAddItem } = this.props;
    return (
      <Form layout="inline" style={{ marginBottom: "10px" }}>
        <FormItem>
          {getFieldDecorator('contacts')(
            <Input placeholder="客户姓名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile')(
            <Input placeholder="客户手机号" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary">查询</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => onAddItem()}>新建</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({})(FilterComponent)
