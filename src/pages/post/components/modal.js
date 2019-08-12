import React from 'react'
import { Modal, Row, Col, Tabs, Input, Icon, Button, Checkbox, Form } from 'antd'
import ReactQuill from 'react-quill'
import { MAX_CONTENT_LENGTH, CATEGORY_TEST_DATA } from '../consts'
import 'react-quill/dist/quill.snow.css';

const { TabPane } = Tabs;
const FormItem = Form.Item;

export default class PostModal extends React.Component {
  state = {
    toggle: false,
    text: '123'
  }
  handleChange = (value) => {
    // this.setState({ text: value })
  }
  renderOriginContent(content) {
    const styleObj = { color: 'red' }
    if (content.length > MAX_CONTENT_LENGTH) {
      return (
        <span>
          <span>{content.slice(0, MAX_CONTENT_LENGTH)}</span>
          <span style={styleObj}>{content.slice(MAX_CONTENT_LENGTH)}</span>
          <span>（<span style={styleObj}>{content.length}</span>/{MAX_CONTENT_LENGTH}）</span>
        </span>
      )
    }
    return content
  }
  render() {
    const { detail={}, translation={} } = this.props;
    const { toggle } = this.state;
    return (
      <Modal
        {...this.props}
      >
        <Row gutter={24}>
          <Col span={toggle ? 12 : 0}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="正文" key="1">
                <p>标题：{detail.title}</p>
                <p>内容：{this.renderOriginContent(detail.content || '')}</p>
              </TabPane>
              <TabPane tab="原文" key="2">
                <iframe src={detail.downloadUrl} width="100%" height="500" />
                <a target="__blank" href={detail.downloadUrl}>查看原文</a>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={toggle ? 12: 16}>
            <div style={{ marginBottom: '10px' }}>
              <Button onClick={() => this.setState({
                toggle: !this.state.toggle
              })}><Icon type="read" /></Button>
            </div>
            <Input value="Hello World!" style={{ marginBottom: '10px' }}/>
            <ReactQuill value={this.state.text}
                  onChange={this.handleChange} />
          </Col>
          <Col span={toggle ? 0 : 8}>
            <Form>
              <FormItem label="分类目录">
                <Checkbox.Group options={CATEGORY_TEST_DATA} />
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
      </Modal>
    )
  }
}
