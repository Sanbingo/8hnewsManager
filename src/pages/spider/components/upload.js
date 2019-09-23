import React from 'react';
import { Modal, Tabs, Upload, Input, Pagination } from 'antd';
import { isArray } from 'lodash'
import style from './upload.less'

const { TabPane } = Tabs;
const { Search } = Input;

export default class UploadComponent extends React.Component {
  state = {
    pageNum: 1
  }
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
  renderPagination = (data) => {
    if (isArray(data) && data.length) {
      return <Pagination style={{ marginTop: '10px' }} current={this.state.pageNum} total={200} onChange={(current) => {
          this.setState({
            pageNum: current,
          })
          this.props.onSearch(this.state.value, { pageNum: current })
        }
      } />
    }
  }
  render() {
    const { search = [], loading, dispatch} = this.props;
    return (
      <Modal {...this.props} onCancel={() => {
        this.setState({
          value: '',
          pageNum: 1,
        })
        dispatch({
          type: 'posts/closeUpload',
        })
      }}
      >
        <Tabs>
          <TabPane tab="在线查找" key="1">
            <div style={{display: 'flex', alignContent: ''}}>
            <Search
              placeholder="请输入关键字，多个关键字用逗号分开"
              enterButton="搜索"
              onSearch={value => {
                this.setState({
                  value,
                  pageNum: 1
                })
                this.props.onSearch(value, { pageNum: 1})
              }}
            />
            </div>
            <div>
              <div class={style.hotWord}>推荐热词: 华为、5G、Xbox、Switch、Steam、谷歌、微软</div>
              <div class={style.picArea}>
              {this.renderPictures(search)}
              </div>
              {this.renderPagination(search)}
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
