import React from 'react'
import { Page } from 'components'
import { router } from 'utils'
import { stringify } from 'qs'
import { connect } from 'dva'
import { Pagination } from 'antd'
import Filter from './components/filter'
import Card from './components/card'
import Modal from './components/modal'

@connect(({ news, loading }) => ({ news, loading }))
class NewsComponent extends React.Component {
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
    const { location, dispatch, news } = this.props
    const { query } = location
    const { constant } = news

    return {
      constant,
      filter: {
        ...query,
      },
      onSearch: value => {
        dispatch({
          type: 'news/query',
          payload: value,
        })
      },
      onFilterChange: value => {
        dispatch({
          type: 'news/filterChange',
          payload: value
        })
      },
      onAdd() {
        dispatch({
          type: 'news/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
  }
  get cardProps() {
    const { dispatch, news, loading, location } = this.props
    const { list, constant,  pagination, filter } = news
    const { query } = location
    return {
      loading,
      filter,
      list,
      constant,
      pagination,
      onViewMessage(item) {
        router.push({
          pathname: '/zh/posts',
          search: stringify(
            {
              ...query,
              siteName: item.siteName
            },
            { arrayFormat: 'repeat' }
          ),
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'news/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      onDeleteItem(id){
        dispatch({
          type: 'news/delete',
          payload: id,
        })
      },
      onPaginationChange(current) {
        dispatch({
          type: 'news/query',
          pageNum: current,
          payload: filter
        })
      }
    }
  }
  get modalProps() {
    const { dispatch, news, loading } = this.props
    const { currentItem, modalVisible, modalType, constant } = news

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      constant,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`news/${modalType}`],
      title: `${modalType === 'create' ? '新建' : '编辑'}`,
      centered: true,
      onOk: data => {
        dispatch({
          type: `news/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'news/hideModal',
        })
      },
    }
  }
  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <Card {...this.cardProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

export default NewsComponent
