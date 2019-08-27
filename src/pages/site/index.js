import React, { PureComponent } from 'react';
import { Page } from 'components';
import { connect } from 'dva'
import Filter from './components/filter';
import List from './components/list';

@connect(({ sites, loading }) => ({ sites, loading }))
class SiteComponent extends PureComponent {
  render() {
    return (
      <Page inner>
        <Filter />
        <List />
      </Page>
    );
  }
}

export default SiteComponent
