import React, { Component } from 'react'
import { Tag, Row, Col, Icon } from 'antd'
import { ColProps, TipBtn } from '../../common/index'
import styles from './card.less'

export default class Cards extends Component {
  render() {
    const { list = [], constant, onDeleteItem, onEditItem } = this.props
    if ((list && list.length === 0) || !list) {
      return <span>暂无数据</span>
    }
    return (
      <Row type="flex" gutter={24}>
        {list &&
          list.map((item = {}, index) => (
            <Col {...ColProps} xl={6} key={index}>
              <div className={styles.contentWrap}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div className={styles.textOverWidth}>{item.siteName}</div>
                  <div>
                    <Icon type="edit" onClick={() => onEditItem(item)} />
                    <TipBtn onOk={() => onDeleteItem(item.id)}>
                      <Icon type="delete" />
                    </TipBtn>
                  </div>
                </div>
                <div className={styles.textOverWidth}>
                  <a target="__blank" href={`http://${item.siteUrl}`}>
                    {item.siteUrl}
                  </a>
                </div>
                <div>
                  <Tag>{constant.siteType[item.siteType]}</Tag>
                  <Tag>{constant.siteAbroad[item.siteAbroad]}</Tag>
                  <Tag>{constant.siteGfw[item.siteGfw]}翻墙</Tag>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    )
  }
}
