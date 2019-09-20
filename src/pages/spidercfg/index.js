import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ spidercfg, loading, app }) => ({ spidercfg, loading, app }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, spidercfg, app } = this.props;
    const { searchForm={} } = spidercfg
    const tags = app.tags || {}
    return {
      tags,
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'spidercfg/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'spidercfg/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'spidercfg/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'spidercfg/showModal',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, spidercfg, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = spidercfg
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'spidercfg/pagination',
          payload: page
        })
        dispatch({
          type: 'spidercfg/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'spidercfg/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'spidercfg/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, spidercfg, loading } = this.props
    const { currentItem, modalVisible, modalType } = spidercfg

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`spidercfg/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `spidercfg/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'spidercfg/hideModal',
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
