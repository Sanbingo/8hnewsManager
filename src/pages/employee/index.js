import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ employee, loading }) => ({ employee, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, employee } = this.props;
    const { searchForm={} } = employee
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'employee/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'employee/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'employee/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'employee/showModal',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, employee, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = employee
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'employee/pagination',
          payload: page
        })
        dispatch({
          type: 'employee/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'employee/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'employee/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, employee, loading } = this.props
    const { currentItem, modalVisible, modalType } = employee

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`employee/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `employee/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'employee/hideModal',
        })
      },
    }
  }

  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps}/>
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    );
  }
}

export default SiteComponent
