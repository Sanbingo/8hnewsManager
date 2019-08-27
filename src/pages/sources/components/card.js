import React, { Component } from 'react'
import { Tag, Row, Col, Icon, Divider, Pagination, Spin, Button, Popconfirm, Switch } from 'antd'
import { ColProps, TipBtn } from '../../common/index'
import styles from './card.less'

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
  render() {
    const { list = [], constant, onDeleteItem, onEditItem, onSpiderItem, pagination, loading } = this.props
    if ((list && list.length === 0) || !list) {
      return <span>暂无数据</span>
    }
    return (
      <div>
        <Spin spinning={loading.global}>
          <Row type="flex" gutter={24}>
            {list &&
              list.map((item = {}, index) => (
                <Col {...ColProps} xl={6} key={index}>
                  <div className={styles.contentWrap}>
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <div className={`${styles.textOverWidth} ${styles.fs24}`}>{item.siteName}</div>
                      <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                    </div>
                    <div className={`${styles.textOverWidth} ${styles.urlStringWrap}`}>
                      <a target="__blank" href={this.renderSiteUrl(item.siteUrl)}>
                        {item.siteUrl}
                      </a>
                    </div>
                    <div className={styles.tagsWrap}>
                      <ButtonGroup>
                        <Button icon="edit" onClick={() => onEditItem(item)}>编辑</Button>
                        <Button icon="bug" onClick={() => onSpiderItem(item)}>爬虫</Button>
                        <Popconfirm
                          title="确定执行这个操作"
                          onConfirm={() => {
                            console.log('sssss')
                            onDeleteItem(item.id)
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button icon="delete">
                            删除
                          </Button>
                        </Popconfirm>

                      </ButtonGroup>
                    </div>
                  </div>
                </Col>
              ))}
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
