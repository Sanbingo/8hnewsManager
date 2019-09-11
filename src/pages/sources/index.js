import React from 'react'
import { Page } from 'components'
import { router } from 'utils'
import { stringify } from 'qs'
import { connect } from 'dva'
import { Pagination } from 'antd'
import Filter from './components/filter'
import Card from './components/card'
import List from './components/list'
import Modal from './components/modal'
import Spider from './components/spider'
import Columns from './components/columns'

@connect(({ sources, loading }) => ({ sources, loading }))
class SourcesComponent extends React.Component {
  handleRefresh = newQuery => {
    const { location } = this.props
    const { query, pathname } = location

    router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }
  get filterProps() {
    const { location, dispatch, sources } = this.props
    const { query } = location
    const { constant, searchForm } = sources

    return {
      constant,
      searchForm,
      filter: {
        ...query,
      },
      onChange: (payload) => {
        dispatch({
          type: 'sources/changeSearchForm',
          payload
        })
      },
      onSearch: value => {
        dispatch({
          type: 'sources/query',
          payload: value,
        })
      },
      onFilterChange: value => {
        dispatch({
          type: 'sources/filterChange',
          payload: value
        })
      },
      onAdd() {
        dispatch({
          type: 'sources/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
  }
  get listProps() {
    const { dispatch, sources, loading } = this.props
    const { list, constant, pagination, searchForm={} } = sources
    return {
      loading,
      list,
      constant,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'sources/pagination',
          payload: page
        })
        dispatch({
          type: 'sources/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem: id => {
        dispatch({
          type: 'sources/delete',
          payload: id,
        }).then(() => {
          this.handleRefresh()
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'sources/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      onColumnsItem(item) {
        dispatch({
          type: 'sources/columnsShowModal',
          payload: {
            columnsModalType: 'update',
            columnsCurrentItem: item,
          },
        })
      },
      onSpiderItem(item) {
        dispatch({
          type: 'sources/spiderShowModal',
          payload: {
            spiderModalType: 'update',
            spiderCurrentItem: item,
          },
        })
      },
      onPaginationChange(current) {
        dispatch({
          type: 'sources/query',
          pageNum: current,
          payload: filter
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, sources, loading } = this.props
    const { currentItem, modalVisible, modalType, constant } = sources

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      constant,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`sources/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `sources/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'sources/hideModal',
        })
      },
    }
  }
  get columnsProps() {
    const { dispatch, sources, loading } = this.props
    const { columnsModalVisible, columnsCurrentItem, columnsModalType, constant } = sources

    return {
      item: columnsModalType === 'create' ? {} : columnsCurrentItem,
      visible: columnsModalVisible,
      constant,
      width: 800,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`sources/${columnsModalType}`],
      title: `${columnsModalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: 'sources/addColumns',
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'sources/columnsHideModal',
        })
      },
    }
  }
  get spiderProps() {
    const { dispatch, sources, loading } = this.props
    const { spiderModalVisible, spiderCurrentItem, spiderModalType, constant } = sources

    return {
      item: spiderModalType === 'create' ? {} : spiderCurrentItem,
      visible: spiderModalVisible,
      constant,
      width: 800,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`sources/${spiderModalType}`],
      title: `${spiderModalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: 'sources/spiderConfig',
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'sources/spiderHideModal',
        })
      },
    }
  }
  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
        <Columns {...this.columnsProps} />
        <Spider {...this.spiderProps} />
      </Page>
    )
  }
}

export default SourcesComponent
