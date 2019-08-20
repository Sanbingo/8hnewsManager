import React from 'react';
import { Modal, Tabs, Upload, Input, Button } from 'antd';
import style from './upload.less'

const { TabPane } = Tabs;
const { Search } = Input;

export default class UploadComponent extends React.Component {
  renderPictures = (data) => {
    if (data.length) {
      return data.map(item => (
        <img src={item.middleURL} style={{ width: '100px', height: '100px' }} onDoubleClick={(e) => {
          console.log('double Click', item)
          this.props.onOk(item.middleURL)
        }}/>
      ))
    }
    return (
      <div>
        <p class={style.addIcon}></p>
      </div>
    )
  }
  render() {
    const { search = []} = this.props;
    return (
      <Modal {...this.props}>
        <Tabs>
          <TabPane tab="在线查找" key="1">
            <div style={{display: 'flex', alignContent: ''}}>
            <Search
              placeholder="请输入关键字，多个关键字用逗号分开"
              enterButton="搜索"
              onSearch={value => this.props.onSearch(value)}
            />
            </div>
            <div>
              <div class={style.hotWord}>推荐热词: 华为、5G、Xbox、Switch、Steam、谷歌、微软</div>
              <div class={style.picArea}>
              {this.renderPictures(search)}
              </div>
            </div>
          </TabPane>
          <TabPane tab="本地上传" key="2">
            <div>
              <p class={style.addIcon}></p>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    )
  }
}
