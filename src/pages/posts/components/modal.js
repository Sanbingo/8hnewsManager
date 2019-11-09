import React from 'react'
import { Modal, Row, Col, Input, Checkbox, Spin } from 'antd'
import { Quill } from 'react-quill'
import { isEmpty } from 'lodash'
import QuillEdit from './common/quilledit'
import Upload from './common/upload'
import Reference from '../../spider/components/common/reference'
import 'react-quill/dist/quill.snow.css';


export default class PostModal extends React.Component {
  handleChange = (field, value) => {
    this.props.onFormChange({ [field]: value })
  }

  imageHandler = (url) => {
    let quill=this.refs.quillEditRef.refs.reactQuillRef.getEditor();//获取到编辑器本身
    const lastRange =  quill.selection.lastRange
    const cursorPosition = lastRange ? lastRange.index : 0;//获取当前光标位置
    quill.insertEmbed(cursorPosition, "image",url, Quill.sources.USER);//插入图片
    quill.setSelection(cursorPosition + 1);//光标位置加1
  }

  get uploadProps() {
    const { dispatch, posts, loading } = this.props;
    const { uploadVisible, search } = posts;
    return {
      dispatch,
      loading,
      title: '添加媒体',
      width: 680,
      search,
      visible: uploadVisible,
      footer: null,
      onOk: (val) => {
        this.imageHandler(val);
        dispatch({
          type: 'posts/closeUpload'
        })
      },
      onSearch: (value, { pageNum=1 }) => {
        dispatch({
          type: 'posts/search',
          payload: {
            keyword: value,
            pageNum,
          }
        })
      },
      // onCancel: () => {
      //   dispatch({
      //     type: 'posts/closeUpload'
      //   })
      // }
    }
  }
  render() {
    const { detail={}, translation={}, base={}, loading } = this.props;
    const { categories=[] } = base
    const CATEGORY_TEST_DATA = categories.map(item => ({
      label: item.name,
      value: item.id
    }))
    const categorieStyle = {
      marginBottom: '10px',
      border: '1px solid lightgray',
      borderRadius: '3px',
      padding: '5px'
    }

    return (
      <Modal
        {...this.props}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Spin spinning={loading.effects['posts/detail']}>
              <Reference title={detail.title} content={detail.content} url={detail.downloadUrl} />
            </Spin>
          </Col>
          
          {/*<Col span={12}>
            <Spin spinning={loading.effects['posts/translate']}>
              <div style={categorieStyle}>
                <Checkbox.Group options={CATEGORY_TEST_DATA} value={translation.categories || []} onChange={(val) => this.handleChange('categories', val)}/>
              </div>
              <Input value={translation.title} onChange={(e) => this.handleChange('title', e.target.value)} style={{ marginBottom: '10px' }}/>
              <div style={{ maxHeight: '450px', overflowY: 'scroll'}}>
                <QuillEdit
                  ref="quillEditRef"
                  content={isEmpty(translation.content) ? '' : translation.content}
                  handleChange={this.handleChange}
                  onOpenUpload={this.props.onOpenUpload}
                />
              </div>
            </Spin>
          </Col>*/}
        </Row>
        <Upload {...this.uploadProps} />
      </Modal>
    )
  }
}
