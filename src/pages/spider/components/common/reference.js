import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;


/**
 * 根据换行符，段落换行展示
 * @param {String} content
 * @return {React}
 */
const renderOriginContent = (content) => {
  const arr = content.split('\r\n');
  return  arr.map(item => <div style={{marginBottom: '20px'}}><span>{item}</span></div>)
}

export default React.memo(({ title, content, url }) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="正文" key="1">
        <p>标题：{title}</p>
        <p>内容：</p>
        <p style={{ overflowY: 'scroll', maxHeight: '400px' }}>{renderOriginContent(content || '')}</p>
        <a target="__blank" href={url}>查看原文</a>
      </TabPane>
    </Tabs>
  );
});
