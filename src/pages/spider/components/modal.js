import React from 'react'
import { Modal, Row, Col, Tabs, Input, Icon, Button, Checkbox, Form } from 'antd'
import ReactQuill, { Quill } from 'react-quill'
import { isEmpty } from 'lodash'
import Upload from './upload'
import Reference from './common/reference'
// import { MAX_CONTENT_LENGTH, CATEGORY_TEST_DATA } from '../consts'
import 'react-quill/dist/quill.snow.css';

const { TabPane } = Tabs;
const FormItem = Form.Item;

export default class PostModal extends React.Component {
  state = {
    toggle: false,
  }
  modules = {
    toolbar: {
      container:[
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers:{
          'image':this.showUploadBox.bind(this)
      }
    }
  }
  showUploadBox() {
    this.props.onOpenUpload()
  }
  handleChange = (field, value) => {
    this.props.onFormChange({ [field]: value })
  }
  renderOriginContent(content) {
    const arr = content.split('\r\n');
    return  arr.map(item => <div style={{marginBottom: '20px'}}><span>{item}</span></div>)
  }
  imageHandler = (url) => {
    let quill=this.refs.reactQuillRef.getEditor();//获取到编辑器本身
    const lastRange =  quill.selection.lastRange
    const cursorPosition = lastRange ? lastRange.index : 0;
    // const cursorPosition =quill.getSelection().index;//获取当前光标位置
    quill.insertEmbed(cursorPosition, "image",url, Quill.sources.USER);//插入图片
    quill.setSelection(cursorPosition + 1);//光标位置加1
  }

  uploadProps() {
    const { dispatch, post } = this.props;
    const { uploadVisible, search } = post;
    return {
      title: '添加媒体',
      width: 680,
      search,
      visible: uploadVisible,
      onOk: (val) => {
        this.imageHandler(val);
        dispatch({
          type: 'post/closeUpload'
        })
      },
      onSearch: (value) => {
        dispatch({
          type: 'post/search',
          payload: {
            keyword: value
          }
        })
      },
      onCancel: () => {
        dispatch({
          type: 'post/closeUpload'
        })
      }
    }
  }
  render() {
    const { detail={}, translation={}, base={} } = this.props;
    const { toggle } = this.state;
    const { categories=[] } = base
    const CATEGORY_TEST_DATA = categories.map(item => ({
      label: item.name,
      value: item.id
    }))
    return (
      <Modal {...this.props}>
        <Reference title={detail.title} content={detail.content} url={detail.downloadUrl} />
      </Modal>
    )
    /*
    return (
      <Modal
        {...this.props}
      >
        <Row gutter={24}>
          <Col span={toggle ? 12 : 0}>
            <Reference title={detail.title} content={detail.content} url={detail.downloadUrl} />
          </Col>
          <Col span={toggle ? 12: 16}>
            <div style={{ marginBottom: '10px' }}>
              <Button onClick={() => this.setState({
                toggle: !this.state.toggle
              })}><Icon type="read" /></Button>
            </div>
            <Input value={translation.title} onChange={(e) => this.handleChange('title', e.target.value)} style={{ marginBottom: '10px' }}/>
            <ReactQuill ref="reactQuillRef" value={isEmpty(translation.content) ? '' : translation.content} modules={this.modules} onChange={(val) => this.handleChange('content', val)} />
          </Col>
          <Col span={toggle ? 0 : 8}>
            <Form>
              <FormItem label="分类目录">
                <Checkbox.Group options={CATEGORY_TEST_DATA} onChange={(val) => this.handleChange('categories', val)}/>
              </FormItem>
              <FormItem label="关键字">
                <Input placeholder="文章关键字，多个以英文逗号分隔" />
              </FormItem>
              <FormItem label="文章封面">
                <Button onClick={() => this.props.onOpenUpload()}>添加封面</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Upload {...this.uploadProps()} />
      </Modal>
    )
    */
  }
}
