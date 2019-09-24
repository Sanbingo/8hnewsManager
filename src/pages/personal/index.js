import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { Page } from 'components'

const { TabPane } = Tabs;

export default class Personal extends PureComponent {
  render() {
    return (
      <Page inner >
        <Tabs defaultActiveKey="1">
          <TabPane tab="数据统计" key="1">
            <p>数据统计</p>
            <p>根据日期范围查询发布文章数量，以及文章数量的折线图</p>
          </TabPane>
          <TabPane tab="修改密码" key="2">
            <p>修改密码</p>
          </TabPane>
        </Tabs>
      </Page>
    );
  }
}
