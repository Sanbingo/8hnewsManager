import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ administrator, loading }) => ({ administrator, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, administrator } = this.props;
    const { searchForm={} } = administrator
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'administrator/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'administrator/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'administrator/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'administrator/showModal',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, administrator, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = administrator
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'administrator/pagination',
          payload: page
        })
        dispatch({
          type: 'administrator/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'administrator/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'administrator/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, administrator, loading } = this.props
    const { currentItem, modalVisible, modalType } = administrator

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`administrator/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `administrator/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'administrator/hideModal',
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
