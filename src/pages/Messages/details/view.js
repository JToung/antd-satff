import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';
import Link from 'umi/link';

@connect(({ message, loading }) => ({
  message,
  loading: loading.effects['message/queryNews'],
  //model
}))
class View extends PureComponent {
  state = {
    previewVisible: false,
    messageData: {},
  };
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

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

    console.log('params_id', this.props.match.params._id);

    const params0 = {
      id: params._id,
    };
    dispatch({
      type: 'message/queryOneNews',
      payload: params0,
    }).then(res => {
      console.log('res0', res);
      if (res.status != '0') {
        setTimeout(
          () =>
            this.setState({ messageData: res.findresult[0] }, () => {
              console.log('messageData', this.state.messageData);
            }),
          0
        );
      }
    });

    const params1 = {
      id: params._id,
    };
    dispatch({
      type: 'message/setRead',
      payload: params1,
    });
  }

  //获取审核状态
  getResult = val => {
    if (val == '1') {
      return <Badge status="success" text="通过" />;
    } else if (val == '2') {
      return <Badge status="error" text="未通过" />;
    }else {
      return (
        <div>
          <Badge status="warning" text="未处理" />
        </div>
      );
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

  //具体信息按分类跳转
  getLable = () => {
    const { messageData } = this.state;
    switch (messageData.detailObject) {
      case 'c':
        console.log('messageData.detailObjectId',messageData.detailObjectId)
        return (
          <a
            onClick={() => {
              this.props.history.push(`/category/e/examine-categroy/${messageData.verifiedData._id}`);
            }}
          >
            查看
          </a>
        );
        break;
      case 'o':
        return (
          <a
            onClick={() => {
              this.props.history.push(`/operator/center/info`);
            }}
          >
            查看
          </a>
        );
        break;
      case 'I':
        return (
          <a
            onClick={() => {
              this.props.history.push(`/item/view-item/${messageData.detailObjectId}`);
            }}
          >
            查看
          </a>
        );
        break;
    }
  };

  getReason = () => {
    const { messageData } = this.state;
    console.log('messageData.detailObject',messageData.detailObject)
    switch (messageData.detailObject) {
      case 'c':
        if(messageData.object == 'o'){
          return messageData.verifiedData.changedData.categoryReason;
        }else if(messageData.object == 'p'){
          return messageData.verifiedData.reason;
        }
        break;
      case 'o':
        console.log('messageData111',messageData.verifiedData.changedData)
        return messageData.verifiedData.changedData.categoryReason;
        break;
      case 'I':
        return " ";
        break;
    }
  };

  render() {
    const { loading } = this.props;
    const { messageData } = this.state;
    // console.log('operator.date',operator);
    if (this.props.match.params._id == null) {
      this.props.history.push('/messages');
    } else if (messageData._id != null) {
      return (
        // 加头部
        <PageHeaderWrapper title={<FormattedMessage id="app.messages.basic.title" />}>
          <Card bordered={false}>
            <Descriptions title="消息详细信息" bordered loading={loading} layout="vertical">
              <Descriptions.Item label="消息ID">{messageData._id}</Descriptions.Item>
              <Descriptions.Item label="发送消息人名">{messageData.auditorName}</Descriptions.Item>
              <Descriptions.Item label="消息发送时间">
                {moment(messageData.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="处理结果">
                {this.getResult(messageData.result)}
              </Descriptions.Item>
              <Descriptions.Item label="处理动作" span={2}>
                {this.getAction(messageData)}
              </Descriptions.Item>
              <Descriptions.Item label="消息内容" span={3}>
              {this.getReason()}
              </Descriptions.Item>
              <Descriptions.Item label="具体信息" span={3}>
                {this.getLable()}
              </Descriptions.Item>
            </Descriptions>
            <Card>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/messages');
                }}
                className={styles.ButtonCenter}
              >
                返回
              </Button>
            </Card>
          </Card>
        </PageHeaderWrapper>
      );
    } else {
      return (
        // 加头部
        <PageHeaderWrapper title={'消息管理'}>
          <Card bordered={false}>
            <Card>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/category/list');
                }}
                className={styles.ButtonCenter}
              >
                返回
              </Button>
            </Card>
          </Card>
        </PageHeaderWrapper>
      );
    }
  }
}

export default View;
