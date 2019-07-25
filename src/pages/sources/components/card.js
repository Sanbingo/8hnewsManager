import React, { Component } from 'react'
import { Tag, Row, Col, Icon, Divider, Pagination, Spin } from 'antd'
import { ColProps, TipBtn } from '../../common/index'
import styles from './card.less'

export default class Cards extends Component {
  renderSiteUrl = (url) => {
    if (/^http/.test(url)) {
      return url;
    }
    return `http://${url}`
  }
  handlePaginationChange = (current) => {
    this.props.onPaginationChange(current);
  }
  render() {
    const { list = [], constant, onDeleteItem, onEditItem, pagination, loading } = this.props
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
                      <div>
                        <a onClick={() => onEditItem(item)} ><Icon type="edit"/></a>
                        <Divider type="vertical" />
                        <TipBtn onOk={() => onDeleteItem(item.id)}>
                          <Icon type="delete" />
                        </TipBtn>
                      </div>
                    </div>
                    <div className={`${styles.textOverWidth} ${styles.urlStringWrap}`}>
                      <a target="__blank" href={this.renderSiteUrl(item.siteUrl)}>
                        {item.siteUrl}
                      </a>
                    </div>
                    <div className={styles.tagsWrap}>
                      <Tag>{constant.siteType[item.siteType]}</Tag>
                      <Tag>{constant.siteAbroad[item.siteAbroad]}</Tag>
                      <Tag>{constant.siteGfw[item.siteGfw]}翻墙</Tag>
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
