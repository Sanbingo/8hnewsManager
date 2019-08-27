import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Page } from 'components'
import { Tabs } from 'antd'
import Youdao from './components/youdao'
import Category from './components/category';
import Password from './components/password';

const { TabPane } = Tabs;

@connect(({ app, tool, loading }) => ({ app, tool, loading }))
class ToolComponent extends PureComponent {
  get youdaoProps() {
    const { dispatch, app, loading, tool } = this.props;
    const { base } = app;
    const { validation } = tool;
    return {
      base,
      loading,
      validation,
      handleSetting: (payload) => {
        dispatch({
          type: 'app/setting',
          payload
        })
      },
      handleValidate: (payload) => {
        dispatch({
          type: 'tool/validate',
          payload
        })
      },
    }
  }
  render() {
    return (
      <Page inner>
        <Tabs>
          <TabPane tab="有道API" key="1">
            <Youdao
              {...this.youdaoProps}
            />
          </TabPane>
          <TabPane tab="栏目管理" key="2">
            <Category />
          </TabPane>
          <TabPane tab="修改密码" key="3">
            <Password />
          </TabPane>
        </Tabs>
      </Page>
    );
  }
}

export default ToolComponent
