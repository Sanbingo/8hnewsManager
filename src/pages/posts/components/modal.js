import React from 'react'
import { Modal, Row, Col, Input, Button, Spin, Radio } from 'antd'
import { Quill } from 'react-quill'
import { isEmpty } from 'lodash'
import QuillEdit from './common/quilledit'
import Upload from './common/upload'
import Reference from '../../spider/components/common/reference'
import 'react-quill/dist/quill.snow.css'

const { TextArea } = Input;

export default class PostModal extends React.Component {
  handleChange = (field, value) => {
    this.props.onFormChange({ [field]: value })
  }

  imageHandler = url => {
    let quill = this.refs.quillEditRef.refs.reactQuillRef.getEditor() //获取到编辑器本身
    const lastRange = quill.selection.lastRange
    const cursorPosition = lastRange ? lastRange.index : 0 //获取当前光标位置
    quill.insertEmbed(cursorPosition, 'image', url, Quill.sources.USER) //插入图片
    quill.setSelection(cursorPosition + 1) //光标位置加1
  }

  get uploadProps() {
    const { dispatch, posts, loading } = this.props
    const { uploadVisible, search } = posts
    return {
      dispatch,
      loading,
      title: '添加媒体',
      width: 1280,
      search,
      visible: uploadVisible,
      footer: null,
      onOk: val => {
        this.imageHandler(val)
        dispatch({
          type: 'posts/closeUpload',
        })
      },
      onSearch: (value, { pageNum=1 }) => {
        dispatch({
          type: 'posts/search',
          payload: {
            keyword: value,
            pageNum,
          },
        })
      },
      // onCancel: () => {
      //   dispatch({
      //     type: 'posts/closeUpload',
      //   })
      // },
    }
  }
  // WordPress网站
  // renderColumns() {
  //   const { base = {} } = this.props
  //   const { categories = [] } = base
  //   const CATEGORY_TEST_DATA = categories.map(item => ({
  //     label: item.name,
  //     value: item.id,
  //   }))
  //   const categorieStyle = {
  //     marginBottom: '10px',
  //     border: '1px solid lightgray',
  //     borderRadius: '3px',
  //     padding: '5px',
  //   }
  //   return (
  //     <div style={categorieStyle}>
  //       <Checkbox.Group
  //         options={CATEGORY_TEST_DATA}
  //         onChange={val => this.handleChange('categories', val)}
  //       />
  //     </div>
  //   )
  // }
  renderColumns() {

    const { dstCategory=[], translation } = this.props
    const CATEGORY_TEST_DATA = dstCategory.map(item => ({
      label: item.dstCategoryName,
      value: item.dstCategoryId,
    }))
    const categorieStyle = {
      marginBottom: '10px',
      border: '1px solid lightgray',
      borderRadius: '3px',
      padding: '5px',
    }
    return (
      <div style={categorieStyle}>
        <Radio.Group
          value={translation.categories}
          options={CATEGORY_TEST_DATA}
          onChange={val => this.handleChange('categories', val.target.value)}
        />
      </div>
    )
  }
  translateApiChange = e => {
    this.props.switchTranslate(e.target.value)
  }
  renderTranslate() {
    const categorieStyle = {
      marginBottom: '10px',
      border: '1px solid lightgray',
      borderRadius: '3px',
      padding: '10px',
    }
    return (
      <div style={categorieStyle}>
        <span>翻译来源：</span>
        <Radio.Group onChange={this.translateApiChange} defaultValue="jinshan">
          <Radio key="1" value="jinshan">
            金山词霸
          </Radio>
          {/*<Radio key="2" value="youdaopay">
            有道云
          </Radio>*/}
          <Radio key="3" value="so">
            360翻译
          </Radio>
        </Radio.Group>
      </div>
    )
  }
  /*
  <Spin spinning={loading.effects['posts/detail']}>
    <Reference
      title={detail.title}
      content={detail.content}
      url={detail.downloadUrl}
    />
  </Spin>
  */
  render() {
    const { detail = {}, translation = {}, loading } = this.props
    return (
      <Modal {...this.props}>
        <Row gutter={24}>
          <Col span={12}>
            {this.renderTranslate()}
            <Spin spinning={loading.effects['posts/translate']}>
              {this.renderColumns()}
              <Input
                id="title"
                value={translation.title}
                onChange={e => this.handleChange('title', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Input
                id="keywords"
                value={translation.keywords}
                onChange={e => this.handleChange('keywords', e.target.value)}
                style={{ marginBottom: '10px' }}
                placeholder="关键词|多关键词用空格或,隔开"
              />
              <TextArea
                id="description"
                value={translation.description}
                onChange={e => this.handleChange('description', e.target.value)}
                style={{ marginBottom: '10px' }}
                placeholder="文章摘要"
              />
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading.effects['posts/translate']}>
              <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <QuillEdit
                  ref="quillEditRef"
                  id="content"
                  content={
                    isEmpty(translation.content) ? '' : translation.content
                  }
                  handleChange={this.handleChange}
                  onOpenUpload={this.props.onOpenUpload}
                />
              </div>
            </Spin>
          </Col>
        </Row>
        <Upload {...this.uploadProps} />
      </Modal>
    )
  }
}
