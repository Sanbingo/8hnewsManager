import React from 'react'
import { Modal, Row, Col } from 'antd'
import { MAX_CONTENT_LENGTH } from '../consts'

export default class PostModal extends React.Component {
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
    return (
      <Modal
        {...this.props}
      >
        <Row gutter={12}>
          <Col span={12}>
            <p>标题：{detail.title}</p>
            <p>内容：{this.renderOriginContent(detail.content || '')}</p>
            <p><a target="__blank" href={detail.downloadUrl}>查看原文</a></p>
          </Col>
          <Col span={12}>
            <p>标题：{translation.title}</p>
            <p>内容：{translation.content}</p>
          </Col>
        </Row>
      </Modal>
    )
  }
}
