import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';
import Modal from './components/modal';
import Bind from './components/bind';

@connect(({ site, loading }) => ({ site, loading }))
class SiteComponent extends PureComponent {
  get filterProps() {
    const { dispatch, site } = this.props;
    const { searchForm={} } = site
    return {
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'site/changeSearchForm',
          payload
        })
      },
      onSearch: (payload) => {
        dispatch({
          type: 'site/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'site/query',
          payload
        })
      },
      onAddItem: (payload) => {
        dispatch({
          type: 'site/showModal',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, site, loading } = this.props;
    const { list=[], pagination={}, searchForm={} } = site
    return {
      list,
      loading,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'site/pagination',
          payload: page
        })
        dispatch({
          type: 'site/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onBindEmployee: (item) => {
        dispatch({
          type: 'site/bindShowModal',
          payload: {
            bindModalType: 'update',
            bindCurrentItem: item
          }
        })
        dispatch({
          type: 'site/employees',
          payload: {}
        })
      },
      onEditItem: (item) => {
        dispatch({
          type: 'site/showModal',
          payload: {
            modalType: 'update',
            currentItem: item
          }
        })
      },
      onDeleteItem: (payload) => {
        dispatch({
          type: 'site/delete',
          payload
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, site, loading } = this.props
    const { currentItem, modalVisible, modalType } = site

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`site/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        console.log('disptach ok', data);
        dispatch({
          type: `site/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'site/hideModal',
        })
      },
    }
  }
  get bindProps() {
    const { dispatch, site, loading } = this.props
    const { bindCurrentItem, bindModalVisible, bindModalType, employees } = site

    return {
      item: bindModalType === 'create' ? {} : bindCurrentItem,
      visible: bindModalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`site/${bindModalType}`],
      title: `${bindModalType === 'create' ? '新建' : '绑定员工'}`,
      centered: true,
      employees,
      onOk: data => {
        dispatch({
          type: `site/${bindModalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'site/bindHideModal',
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
        <Bind {...this.bindProps} />
      </Page>
    );
  }
}

export default SiteComponent
