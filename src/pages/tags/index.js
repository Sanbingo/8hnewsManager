import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ tags, loading }) => ({ tags, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, tags } = this.props;
    const { searchForm={} } = tags
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'tags/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'tags/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'tags/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'tags/showModal',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, tags, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = tags
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'tags/pagination',
          payload: page
        })
        dispatch({
          type: 'tags/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'tags/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'tags/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, tags, loading } = this.props
    const { currentItem, modalVisible, modalType } = tags

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`tags/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        console.log('disptach ok', data);
        dispatch({
          type: `tags/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'tags/hideModal',
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
