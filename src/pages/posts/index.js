import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { Button, message } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Filter from './components/filter'
import List from './components/list'
import Modal from './components/modal'

@connect(({ posts, loading }) => ({ posts, loading }))
class Posts extends React.PureComponent {
  get filterProps() {
    const { dispatch, posts } = this.props;
    const { initData={}, siteDomains=[], searchForm={} } = posts;

    return {
      initData,
      siteDomains,
      searchForm,
      onChange: (payload) => {
        dispatch({
          type: 'posts/changeSearchForm',
          payload
        })

      },
      onSearch: (payload) => {
        dispatch({
          type: 'posts/pagination',
          payload: {
            current: 1
          }
        })
        dispatch({
          type: 'posts/query',
          payload
        })
      }
    }
  }
  get listProps() {
    const { dispatch, posts, loading } = this.props;
    const { list=[], initData={}, pagination={}, searchForm={} } = posts;
    return {
      loading,
      list,
      initData,
      pagination,
      onHandlePagination: (page) => {
        dispatch({
          type: 'posts/pagination',
          payload: page
        })
        dispatch({
          type: 'posts/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onHandleTranslate: (value) => {
        dispatch({
          type: 'posts/showModal',
          payload: value
        })
        dispatch({
          type: 'posts/detail',
          payload: {
            id: value
          }
        })
      }
    }
  }
  renderModalHeader(){
    const { posts } = this.props
    const { detail={} } = posts;
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>查看</div>
          <div style={{ marginRight: '50px' }}>
            <CopyToClipboard text={detail.title} style={{ marginRight: '5px' }}
              onCopy={() => message.success('复制成功~')}>
              <Button>
                标题复制
              </Button>
            </CopyToClipboard>
            <CopyToClipboard text={detail.content}
              onCopy={() => message.success('复制成功~')}>
              <Button>
                内容复制
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      );
  }
  get modalProps() {
    const { dispatch, posts, loading } = this.props;
    const { modalVisible, detail, translation, base } = posts
    return {
      ...this.props,
      loading,
      detail,
      base,
      translation,
      title: this.renderModalHeader(),
      width: 600,
      visible: modalVisible,
      footer: null,
      // footer: [
      //   <Button key="draft" loading={loading.effects['posts/create']} onClick={() => {
      //     dispatch({
      //       type: 'posts/create',
      //       payload: {
      //         status: 'draft'
      //       }
      //     })
      //   }}>
      //     保存草稿
      //   </Button>,
      //   <Button key="cancel" onClick={() => {
      //     dispatch({
      //       type: 'posts/hideModal',
      //     })
      //     dispatch({
      //       type: 'posts/query',
      //     })
      //   }}>
      //     取消
      //   </Button>,
      //   <Button key="submit" type="primary" loading={loading.effects['posts/create']} onClick={() => {
      //     dispatch({
      //       type: 'posts/create',
      //       payload: {},
      //     })
      //   }}>
      //     发布
      //   </Button>,
      // ],
      onOk: (data) => {
        dispatch({
          type: 'posts/create',
          payload: {},
        })
      },
      onCancel() {
        dispatch({
          type: 'posts/hideModal',
        })
        dispatch({
          type: 'posts/query',
        })
      },
      onOpenUpload(){
        dispatch({
          type: 'posts/openUpload'
        })
      },
      onFormChange(payload) {
        dispatch({
          type: 'posts/formChange',
          payload
        })
      }
    }
  }

  render(){
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <br />
        <List {...this.listProps}/>
        <Modal {...this.modalProps}/>
      </Page>
    );
  }
}

export default Posts
