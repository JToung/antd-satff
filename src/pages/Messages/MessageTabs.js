import React, { PureComponent } from 'react';
import { Card, message, Tabs, List } from 'antd';
import 'antd/dist/antd.css';

import { connect } from 'dva';

const { TabPane } = Tabs;
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    content: 'id',
  });
}

@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
class MessageTabs extends PureComponent {
  state = {
    previewVisible: false,
  };
  componentDidMount() {
    if (JSON.parse(localStorage.getItem('user')) === null) {
      message.error('未登录！！请登录！');
      this.props.history.push('/');
    }
    if (JSON.parse(localStorage.getItem('user')) != null) {
      if (JSON.parse(localStorage.getItem('user')) === 'guest') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
      if (JSON.parse(localStorage.getItem('user')).status === 'false') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
    }
  }

  render() {
    return (
      // 加头部
      <Card bordered={false}>
        <Tabs defaultActiveKey="noRead">
          <TabPane tab="未读信息" key="noRead">
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={listData}
              renderItem={item => (
                <List.Item key={item.title}>
                  {item.content} <a>操作</a>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="已读信息" key="read">
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={listData}
              renderItem={item => (
                <List.Item key={item.title}>
                  {item.content} <a>操作</a>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default MessageTabs;
