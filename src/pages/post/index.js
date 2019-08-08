import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { router } from 'utils'
import { stringify } from 'qs'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import List from './components/List'
import Filter from './components/filter'
import Modal from './components/modal'

const { TabPane } = Tabs

const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Post extends PureComponent {
  handleTabClick = key => {
    const { pathname } = this.props.location

    router.push({
      pathname,
      search: stringify({
        status: key,
      }),
    })
  }

  get filterProps() {
    const { dispatch } = this.props
    return {
      onSearch: value => {
        dispatch({
          type: 'post/query',
          payload: value,
        })
      },
    }
  }

  get listProps() {
    const { post, loading, location, dispatch } = this.props
    const { list, pagination, expandData } = post
    const { query, pathname } = location

    return {
      pagination,
      dataSource: list,
      expandData,
      loading: loading.effects['post/query'],
      getExpandedRow: value => {
        dispatch({
          type: 'post/expanded',
          payload: value
        })
      },
      onTranslate(payload) {
        dispatch({
          type: 'post/showModal',
          payload: {
            id: payload
          },
        })
        dispatch({
          type: 'post/detail',
          payload: {
            id: payload
          }
        })
      },
      onChange(page) {
        router.push({
          pathname,
          search: stringify({
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      },
    }
  }

  get modalProps() {
    const { dispatch, post } = this.props;
    const { modalVisible, detail, translation } = post
    return {
      detail,
      translation,
      title: '正文',
      width: 1200,
      visible: modalVisible,
      onOk: data => {
        dispatch({
          type: 'post/create',
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'post/hideModal',
        })
      },
    }
  }

  render() {
    const { location, i18n } = this.props
    const { query } = location

    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} style={{ marginTop: '10px' }} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Post
