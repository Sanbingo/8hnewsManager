import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { Button, message } from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Filter from './components/filter'
import List from './components/list'
import Modal from './components/modal'

@connect(({ posts, loading, app }) => ({ posts, loading, app }))
class Posts extends React.PureComponent {
  get filterProps() {
    const { dispatch, posts, app } = this.props
    const { initData = {}, siteDomains = [], searchForm = {}, empower={} } = posts
    const tags = app.tags || {}
    return {
      initData,
      empower,
      siteDomains,
      searchForm,
      tags,
      onChange: payload => {
        dispatch({
          type: 'posts/changeSearchForm',
          payload,
        })
      },
      onSearch: payload => {
        dispatch({
          type: 'posts/pagination',
          payload: {
            current: 1,
          },
        })
        dispatch({
          type: 'posts/query',
          payload,
        })
      },
    }
  }
  get listProps() {
    const { dispatch, posts, loading, app } = this.props
    const { list = [], initData = {}, pagination = {}, searchForm = {} } = posts
    const tags = app.tags || {}
    return {
      tags,
      loading,
      list,
      initData,
      pagination,
      onHandlePagination: page => {
        dispatch({
          type: 'posts/pagination',
          payload: page,
        })
        dispatch({
          type: 'posts/query',
          payload: searchForm,
          pageNum: page.current,
          pageSize: page.pageSize,
        })
      },
      onHandleTranslate: value => {
        dispatch({
          type: 'posts/showModal',
          payload: value,
        })
        dispatch({
          type: 'posts/detail',
          payload: {
            id: value,
          },
        })
      },
    }
  }
  renderModalHeader(){
    const { posts: { translation } } = this.props
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>翻译</div>
          <div style={{ marginRight: '50px' }}>
            <CopyToClipboard text={translation.title} style={{ marginRight: '5px' }}
              onCopy={() => message.success('复制成功~')}>
              <Button>
                标题复制
              </Button>
            </CopyToClipboard>
            <CopyToClipboard text={translation.content}
              onCopy={() => message.success('复制成功~')}>
              <Button>
                内容复制
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      );
  }
  setQuillEditortDefaultStatus = () => {
    let quill = this.refs.postmodal.refs.quillEditRef.refs.reactQuillRef.getEditor() //获取到编辑器本身
    quill.setSelection(0) //关闭发布对话框把光标置为0
  }
  get modalProps() {
    const { dispatch, posts, loading, app } = this.props
    const { modalVisible, detail, translation, base, translateType } = posts
    const { dstCategory } = app
    return {
      ...this.props,
      loading,
      detail,
      base,
      translation,
      dstCategory,
      translateType,
      okText: '发布',
      title: this.renderModalHeader(),
      width: 1200,
      visible: modalVisible,
      footer: [
        <Button
          onClick={() => {
            this.setQuillEditortDefaultStatus()
            dispatch({
              type: 'posts/hideModal',
            })
            dispatch({
              type: 'posts/query',
            })
            dispatch({
              type: 'posts/translateType',
              payload: 'jinshan'
            })
          }}
        >
          取消
        </Button>,
        <Button
          type="primary"
          onClick={() => {
            this.setQuillEditortDefaultStatus()
            dispatch({
              type: 'posts/create',
              payload: {},
            })
            dispatch({
              type: 'posts/translateType',
              payload: 'jinshan'
            })
          }}
        >
          发布
        </Button>,
        <Button
          type="primary"
          onClick={() => {
            this.setQuillEditortDefaultStatus()
            dispatch({
              type: 'posts/create',
              payload: {
                publishType: 1
              },
            })
            dispatch({
              type: 'posts/translateType',
              payload: 'jinshan'
            })
          }}
        >
          草稿
        </Button>,
      ],
      // onOk: data => {
      //   dispatch({
      //     type: 'posts/create',
      //     payload: {},
      //   })
      //   dispatch({
      //     type: 'posts/translateType',
      //     payload: 'jinshan'
      //   })
      // },
      onCancel() {
        dispatch({
          type: 'posts/hideModal',
        })
        dispatch({
          type: 'posts/query',
        })
        dispatch({
          type: 'posts/translateType',
          payload: 'jinshan'
        })
      },
      onOpenUpload(position) {
        console.log('position', position)
        dispatch({
          type: 'posts/openUpload',
          payload: {
            position
          }
        })
      },
      onFormChange(payload) {
        dispatch({
          type: 'posts/formChange',
          payload,
        })
      },
      switchTranslate(type) {
        dispatch({
          type: 'posts/translateType',
          payload: type
        })
        if (type === 'jinshan') {
          // 默认
          dispatch({
            type: 'posts/translate',
            payload: {},
          })
        } else if (type === 'youdaopay') {
          dispatch({
            type: 'posts/translateByYoudao',
            payload: {},
          })
        } else if (type === 'so') {
          dispatch({
            type: 'posts/translateBySo',
            payload: {},
          })
        } else {
          message.warning('请选择翻译来源！')
        }
      },
    }
  }

  render() {
    return (
      <Page inner>
        <div style={{ marginBottom: '10px'}}>
          <Filter {...this.filterProps} />
        </div>
        <List {...this.listProps} />
        <Modal {...this.modalProps} ref="postmodal" />
      </Page>
    )
  }
}

export default Posts
