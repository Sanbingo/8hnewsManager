import React, { Component } from 'react'
import { Empty, Row, Col, Icon, message, Pagination, Spin, Button, Tooltip, Popconfirm, Badge, Card, Popover } from 'antd'
import { isEqual } from 'lodash'
import { ColProps, arrayToMapObject } from '../../common/index'
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
    const tagsMap = arrayToMapObject(constant, 'categoryId', 'categoryName')
    if ((list && list.length === 0) || !list) {
      return <Empty />
    }
    return (
      <div>
        <Spin spinning={loading.global}>
          <Row type="flex" gutter={24}>
            {list &&
              list.map((item = {}, index) => {
                const title = item.siteName || '未命名'
                const columnInfos = item.sourceList && item.sourceList.length > 0 ?
                item.sourceList.map(item => <div><a href={item.siteUrl} target="__blank">{item.siteUrl}</a> | {tagsMap[item.categoryId]}</div>) :<Empty />
                return (
                  <Col {...ColProps} xl={6} key={index}>
                    <Card
                      style={{ width: '100%' }}
                      actions={[
                        <Badge dot>
                          <Tooltip title="文章">
                            <Icon type="message" key="message"  onClick={() => onViewMessage(item)}/>
                          </Tooltip>
                        </Badge>,
                        <Tooltip title="编辑">
                          <Icon type="edit" key="edit" onClick={() => onEditItem(item)} />
                        </Tooltip>,
                        <Popover placement="bottom" content={columnInfos} title="栏目">
                          <Icon type="bars" key="bars" />
                        </Popover>,
                        <Tooltip title="统计">
                          <Icon type="area-chart" key="area-chart" onClick={() => {message.warning('统计功能暂未开放')}}/>
                        </Tooltip>,
                        <Popconfirm
                          title="确定执行这个操作"
                          onConfirm={() => {
                            onDeleteItem(item.id)
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Icon type="delete" key="delete" />
                        </Popconfirm>,
                      ]}
                    >
                      <Meta
                        avatar={<div className={styles.metaAvatarStyle}><span>{title.slice(0, 1).toUpperCase()}</span></div>}
                        title={<div className={styles.textOverWidth}>{title}</div>}
                        description={
                          <div>
                            <div className={styles.textOverWidth}><a href={item.siteUrl} target="__blank">{item.siteUrl}</a></div>
                          </div>
                        }
                      />
                      <div className={styles.tagsOverWidth}><Icon type="tags" /> {item.categoryIds ? item.categoryIds.map(item => tagsMap[item]).join('、') : '暂未标签'}</div>
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
            current={pagination.current}
          />
        </div>
      </div>

    )
  }
}
