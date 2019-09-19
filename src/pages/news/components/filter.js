import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Row, Col, Input } from 'antd'
import { arrayToMapObject, createOptions } from '../../common/index'
import styles from './filter.less'

const { Option } = Select
const { Search } = Input
const FormItem = Form.Item

class FilterComponent extends Component {
  handleSubmit = () => {
    // const { onSearch, form } = this.props
    // const { getFieldsValue } = form
    // const fields = getFieldsValue()
    this.props.onSearch()
  }

  render() {
    const { form, filter, onAdd, constant = {} } = this.props
    const { getFieldDecorator } = form
    const { type, categoryId, siteName } = filter || {}

    return (
      <Form layout="inline" className={styles.mb15}>
        <FormItem>
          {getFieldDecorator('siteName')(<Search placeholder="网站名称" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId')(
            createOptions(arrayToMapObject(constant, 'categoryId', 'categoryName'), '网站类型')
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
  onValuesChange: (props, changedValues ) => { props.onFilterChange(changedValues)},
  mapPropsToFields: (props) => {
    return {
      siteName: Form.createFormField({
        value: props.filter.siteName
      }),
      categoryId: Form.createFormField({
        value: props.filter.categoryId
      }),
    }
  }
})(FilterComponent)
