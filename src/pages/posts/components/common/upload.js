import React from 'react';
import { Modal, Tabs, Input, Spin, Pagination } from 'antd';
import { isArray } from 'lodash'
import style from './upload.less'

const { TabPane } = Tabs;
const { Search } = Input;

export default class UploadComponent extends React.Component {
  state = {
    pageNum: 1
  }
  renderPictures = (data) => {
    if (isArray(data) && data.length) {
      return data.filter(_ => !!_.middleURL).map(item => (
        <span style={{ position: 'relative', display: 'inline-block'}}>
          <img src={item.middleURL} style={{ width: '100px', height: '100px', cursor: 'pointer' }} onDoubleClick={(e) => {
            console.log('double Click', item)
            this.props.onOk(item.middleURL)
          }}/>
          <span style={{ position: 'absolute', bottom: 0, right: 0, padding: '0 2px', background: 'rgba(0,0,0,.6)', color: 'white'}}>{item.width}*{item.height}</span>
        </span>
      ))
    }
    return (
      <div>
        <p class={style.addIcon}>暂无图片</p>
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
          <TabPane tab="在线查找|双击选择" key="1">
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
              <Spin spinning={!!loading.effects['posts/search']}>
                {this.renderPictures(search)}
              </Spin>
              </div>
              {this.renderPagination(search)}
            </div>
          </TabPane>
          <TabPane tab="本地上传" key="2">
            <div>
              <p style={{ textAlign: 'center', padding: '10px 0'}}>功能陆续开放中...敬请期待</p>
              <p class={style.addIcon}></p>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    )
  }
}
