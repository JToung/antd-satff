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
      pt: localStorage.getItem('userId'),
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
      pt: localStorage.getItem('userId'),
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
          结果：
          <Badge status="success" text="通过" />
        </div>
      );
    } else if (val == '2') {
      return (
        <div>
          结果：
          <Badge status="error" text="未通过" />
        </div>
      );
    } else {
      return (
        <div>
          结果：
          <Badge status="warning" text="未处理" />
        </div>
      );
    }
  };

  //获取发送标识
  getObject = val => {
    console.log('val.object', val.object);
    switch (val.object) {
      case 'o':
        return <font>运营商</font>;
        break;
      case 'p':
        return <font>平台管理员</font>;
        break;
      case 'z':
        return <font>专才</font>;
        break;
      case 'y':
        return <font>用户</font>;
        break;
    }
  };

  //获取动作标识 处理动作标识 t:提交审核，q:确认审核，p:派单，j:接单
  getAction = val => {
    console.log('action', val.action);
    switch (val.action) {
      case 't':
        return <font>提交审核</font>;
        break;
      case 'q':
        return <font>确认审核</font>;
        break;
      case 'p':
        return <font>派单</font>;
        break;
      case 'j':
        return <font>接单</font>;
        break;
    }
  };

  // 获取具体处理对象标识 c:品类	t:任务  o:运营商	z:专才 I:单品	log:工作日志  p:分区	g:工单
  getDetailObject = val => {
    console.log('detailObject', val.detailObject);
    switch (val.detailObject) {
      case 'c':
        return <font>品类</font>;
        break;
      case 't':
        return <font>任务</font>;
        break;
      case 'o':
        return <font>运营商</font>;
        break;
      case 'z':
        return <font>专才</font>;
        break;
      case 'I':
        return <font>单品</font>;
        break;
      case 'log':
        return <font>工作日志</font>;
        break;
      case 'p':
        return <font>分区</font>;
        break;
      case 'g':
        return <font>工单</font>;
        break;
    }
  };

  //获取列表内容
  getNew = item => {
    if (item._id == null) {
      return;
    } else {
      console.log('item', item);
      return (
        <List.Item key={item._id}>
          <div>
            {this.getObject(item)} {item.auditorName}于{' '}
            {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} 对 {this.getDetailObject(item)}
            {item.detailObjectId}
            执行{this.getAction(item)} 操作
            {this.getResult(item.result)}
            <div>
              <Link to={`/messages/view/${item._id}`}>查看详情</Link>
            </div>
          </div>
        </List.Item>
      );
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
                showSizeChanger: true,
                showQuickJumper: true,
                total: messageListData0.length, // 数据总数
                pageSize: 3, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
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
                showSizeChanger: true,
                showQuickJumper: true,
                total: messageListData1.length, // 数据总数
                pageSize: 3, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
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
