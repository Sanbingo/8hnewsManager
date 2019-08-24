import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Page } from 'components'
import { Tabs } from 'antd'
import Youdao from './components/youdao'

const { TabPane } = Tabs;

@connect(({ app, setting, loading }) => ({ app, setting, loading }))
class SettingComponent extends PureComponent {
  get youdaoProps() {
    const { dispatch, app, loading, setting } = this.props;
    const { base } = app;
    const { validation } = setting;
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
          type: 'setting/validate',
          payload
        })
      },
    }
  }
  render() {
    return (
      <Page inner>
        <Tabs>
          <TabPane tab="有道">
            <Youdao
              {...this.youdaoProps}
            />
          </TabPane>
        </Tabs>
      </Page>
    );
  }
}

export default SettingComponent
