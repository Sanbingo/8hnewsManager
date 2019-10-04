import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ sensitive, loading }) => ({ sensitive, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, sensitive } = this.props;
    const { searchForm={} } = sensitive
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'sensitive/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'sensitive/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'sensitive/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'sensitive/showModal',
          payload: {
            modalType: 'create'
          }
        })
      }
    }
  }
  get listProps() {
    const { dispatch, sensitive, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = sensitive
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'sensitive/pagination',
          payload: page
        })
        dispatch({
          type: 'sensitive/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'sensitive/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'sensitive/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, sensitive, loading } = this.props
    const { currentItem, modalVisible, modalType } = sensitive

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`sensitive/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `sensitive/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'sensitive/hideModal',
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
