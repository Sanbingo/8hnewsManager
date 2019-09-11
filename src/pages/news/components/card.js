import React, { Component } from 'react'
import { Tag, Row, Col, Icon, message, Pagination, Spin, Button, Popconfirm, Switch, Badge, Card, Avatar } from 'antd'
import { isEqual } from 'lodash'
import { ColProps, TipBtn } from '../../common/index'
import styles from './card.less'

const { Meta } = Card;

const ButtonGroup = Button.Group;

export default class Cards extends Component {
  renderSiteUrl = (url) => {
    if (/^http/.test(url)) {
      return url
    }
    return `http://${url}`
  }
  handlePaginationChange = (current) => {
    this.props.onPaginationChange(current);
  }
  getRandomCount = () => {
    return Math.floor(Math.random()*100);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps.list, this.props.list)) {
      return false
    }
    return true
  }
  render() {
    const { list = [], constant={}, onDeleteItem, onEditItem, onViewMessage, pagination, loading } = this.props
    const { categoryId, siteGfw } = constant
    if ((list && list.length === 0) || !list) {
      return <span>暂无数据</span>
    }
    return (
      <div>
        <Spin spinning={loading.global}>
          <Row type="flex" gutter={24}>
            {list &&
              list.map((item = {}, index) => {
                const r = 100 + Math.random() * 155;
                const g = 100 + Math.random() * 155;
                const b = 100 + Math.random() * 155;
                const metaAvatarStyle = {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bolder',
                  fontSize: '16px',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  background: `rgb(${r}, ${g}, ${b})`
                }
                const title = item.siteName || '未命名'
                return (
                  <Col {...ColProps} xl={6} key={index}>
                    <Card
                      style={{ width: '100%' }}
                      actions={[
                        <Badge dot>
                            <Icon type="message" key="message"  onClick={() => onViewMessage(item)}/>
                        </Badge>,
                        <Icon type="edit" key="edit" onClick={() => onEditItem(item)} />,
                        <Icon type="heart" key="heart" onClick={() => {message.warning('收藏功能暂未开放')}}/>,
                      ]}
                    >
                      <Meta
                        avatar={<div style={metaAvatarStyle}><span>{title.slice(0, 1).toUpperCase()}</span></div>}
                        title={title}
                        description={<div class={styles.textOverWidth}>{item.siteUrl}</div>}
                      />
                    </Card>
                  </Col>
                )
              })}
          </Row>
        </Spin>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Pagination
            total={pagination.total}
            pageSize={20}
            onChange={this.handlePaginationChange}
            style={{ float: 'right' }}
          />
        </div>
      </div>

    )
  }
}
