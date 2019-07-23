import React from 'react'
import { Page } from 'components'
import { router } from 'utils'
import { stringify } from 'qs'
import { connect } from 'dva'
import Filter from './components/filter'
import Card from './components/card'
import Modal from './components/modal'

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
    const { constant } = sources

    return {
      constant,
      filter: {
        ...query,
      },
      onSearch: value => {
        dispatch({
          type: 'sources/query',
          payload: value,
        })
      },
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
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
  get cardProps() {
    const { dispatch, sources, loading } = this.props
    const { list, constant } = sources
    return {
      list,
      constant,
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

export default SourcesComponent
