import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Input } from 'antd'
import { createOptions } from '../../common/index'
import styles from './filter.less'

const { Search } = Input
const FormItem = Form.Item

class FilterComponent extends Component {
  handleSubmit = () => {
    const { onSearch, form } = this.props
    const { getFieldsValue } = form
    const fields = getFieldsValue()
    onSearch(fields)
  }

  render() {
    const { form, filter, onAdd, constant = {}, tags, } = this.props
    const { getFieldDecorator } = form
    const { type, categoryId, siteName } = filter || {}

    return (
      <Form layout="inline" className={styles.mb15}>
        <FormItem>
          {getFieldDecorator('siteName')(<Search placeholder="网站名称" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId')(
            createOptions(tags, '网站类型')
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            onClick={this.handleSubmit}
            className={styles.mr15}
          >
            查询
          </Button>
          <Button type="default" onClick={onAdd}>
            新建
          </Button>
        </FormItem>
      </Form>
    )
  }
}

FilterComponent.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create({
  onValuesChange: (props, changedValues) => {
    props.onChange(changedValues)
  },
  mapPropsToFields: (props) => {
    return {
      siteName: Form.createFormField({
        value: props.searchForm.siteName
      }),
      categoryId: Form.createFormField({
        value: props.searchForm.categoryId
      }),
    }
  }
})(FilterComponent)
