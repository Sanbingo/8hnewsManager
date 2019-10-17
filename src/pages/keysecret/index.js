import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';

@connect(({ keysecret, loading }) => ({ keysecret, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, keysecret } = this.props;
    const { searchForm={} } = keysecret
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'keysecret/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'keysecret/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'keysecret/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'keysecret/showModal',
          payload: {
            modalType: 'create'
          }
        })
      }
    }
  }
  get listProps() {
    const { dispatch, keysecret, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = keysecret
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'keysecret/pagination',
          payload: page
        })
        dispatch({
          type: 'keysecret/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'keysecret/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'keysecret/remove',
          payload: {
            entity: {
              id: payload
            }
          }
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, keysecret, loading } = this.props
    const { currentItem, modalVisible, modalType } = keysecret

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`keysecret/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `keysecret/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'keysecret/hideModal',
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
