import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { router } from 'utils'
import { stringify } from 'qs'
import { Page } from 'components'
import List from './components/List'
import Filter from './components/filter'
import Modal from './components/modal'

@connect(({ spider, loading }) => ({ spider, loading }))
class Spider extends PureComponent {

  get filterProps() {
    const { dispatch, spider } = this.props
    const { initData={}, searchForm } = spider
    return {
      initData,
      onChange: (value) => {
        dispatch({
          type: 'spider/searchChange',
          payload: value
        })
      },
      onSearch: value => {
        dispatch({
          type: 'spider/query',
          payload: searchForm,
          pageNum: 1,
        })
      },
    }
  }

  get listProps() {
    const { spider, loading, dispatch } = this.props
    const { list, pagination, expandData, initData, searchForm } = spider


    return {
      pagination,
      dataSource: list,
      expandData,
      initData,
      loading: loading.effects['spider/query'],
      getExpandedRow: value => {
        dispatch({
          type: 'spider/expanded',
          payload: value
        })
      },
      onTranslate(payload) {
        dispatch({
          type: 'spider/showModal',
          payload: {
            id: payload
          },
        })
        dispatch({
          type: 'spider/detail',
          payload: {
            id: payload
          }
        })
      },
      onChange(page) {
        dispatch({
          type: 'spider/pagination',
          payload: page
        })
        dispatch({
          type: 'spider/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onSubPagination(page, id) {
        dispatch({
          type: 'spider/expanded',
          payload: id,
          pageNum: page.current
        })
      }
    }
  }

  get modalProps() {
    console.log('porps...', this.props)
    const { dispatch, spider } = this.props;
    const { modalVisible, detail, translation, base } = spider
    return {
      ...this.props,
      detail,
      base,
      translation,
      title: '查看',
      width: 600,
      visible: modalVisible,
      onOk: (data) => {
        // dispatch({
        //   type: 'spider/create',
        //   payload: {},
        // })
        dispatch({
          type: 'spider/hideModal',
        })
      },
      onCancel() {
        dispatch({
          type: 'spider/hideModal',
        })
      },
      onOpenUpload(){
        dispatch({
          type: 'spider/openUpload'
        })
      },
      onFormChange(payload) {
        dispatch({
          type: 'spider/formChange',
          payload
        })
      }
    }
  }
  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} style={{ marginTop: '10px' }} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

Spider.propTypes = {
  spider: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Spider
