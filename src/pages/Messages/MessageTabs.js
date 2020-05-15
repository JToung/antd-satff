import React, { PureComponent } from 'react';
import { Card, message, Tabs, List, Badge } from 'antd';
import 'antd/dist/antd.css';
import styles from './style.less';
import moment from 'moment';
import Link from 'umi/link';

import { connect } from 'dva';

const { TabPane } = Tabs;
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    content: 'id',
  });
}

@connect(({ message, loading }) => ({
  message,
  loading: loading.effects['message/queryNews'],
  //model
}))
class MessageTabs extends PureComponent {
  state = {
    previewVisible: false,
    messageListData0: [],
    messageListData1: [],
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

    const { dispatch } = this.props;
    const params0 = {
      operator: localStorage.getItem('userId'),
      read: '0',
    };
    dispatch({
      type: 'message/queryNews',
      payload: params0,
    }).then(res => {
      console.log('res0', res);
      if (res.findresult != null) {
        setTimeout(
          () =>
            this.setState({ messageListData0: res.findresult }, () => {
              console.log('messageListData0', this.state.messageListData0);
            }),
          0
        );
      }
    });

    const params1 = {
      operator: localStorage.getItem('userId'),
      read: '1',
    };
    dispatch({
      type: 'message/queryNews',
      payload: params1,
    }).then(res => {
      console.log('res1', res);
      if (res.findresult != null) {
        setTimeout(
          () =>
            this.setState({ messageListData1: res.findresult }, () => {
              console.log('messageListData0', this.state.messageListData0);
            }),
          0
        );
      }
    });
  }

  //获取审核状态
  getResult = val => {
    if (val == '1') {
      return (
        <div>
          审核结果：
          <Badge status="success" text="通过" />
        </div>
      );
    } else if (val == '2') {
      return (
        <div>
          审核结果：
          <Badge status="error" text="未通过" />
        </div>
      );
    }
  };

  //获取列表内容
  getNew = item => {
    if (item._id == null) {
      return;
    } else {
      switch (item.verifiedData.object) {
        case 'c':
          console.log('item', item);
          return (
            <List.Item key={item._id}>
              <div>
                品类 {item.verifiedData.categoryName} 已于{' '}
                {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} 被平台管理员{' '}
                {item.auditorName} 审核。
                {this.getResult(item.result)}
                <div>
                  <Link to={`/messages/view/${item._id}`}>查看详情</Link>
                </div>
              </div>
            </List.Item>
          );
          break;
        case 'o':
          console.log('item', item);
          return (
            <List.Item key={item._id}>
              <div>
                运营商信息 {item.verifiedData.categoryName} 已于{' '}
                {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} 被平台管理员{' '}
                {item.auditorName} 审核。
                {this.getResult(item.result)}
                <div>
                  <Link to={`/messages/view/${item._id}`}>查看详情</Link>
                </div>
              </div>
            </List.Item>
          );
          break;
        case 'I':
          console.log('item', item);
          return (
            <List.Item key={item._id}>
              <div>
                单品 {item.verifiedData.categoryName} 已于{' '}
                {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} 被平台管理员{' '}
                {item.auditorName} 审核。
                {this.getResult(item.result)}
                <div>
                  <Link to={`/messages/view/${item._id}`}>查看详情</Link>
                </div>
              </div>
            </List.Item>
          );
          break;
      }
    }
  };

  render() {
    const { loading, dispatch } = this.props;
    const { messageListData0, messageListData1 } = this.state;
    const params0 = {
      operator: localStorage.getItem('userId'),
      read: '0',
    };
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
                pageSize: 6,
              }}
              dataSource={messageListData0}
              renderItem={item => this.getNew(item)}
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
                pageSize: 6,
              }}
              dataSource={messageListData1}
              renderItem={item => this.getNew(item)}
            />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}

export default MessageTabs;
