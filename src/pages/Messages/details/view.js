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
    }
  };

  //具体信息按分类跳转
  getLable = () => {
    const { messageData } = this.state;
    switch (messageData.verifiedData.object) {
      case 'c':
        return (
          <a
            onClick={() => {
              this.props.history.push(`/category/view-categroy/${messageData.verifiedData.id}`);
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
              this.props.history.push(`/item/view-item/${messageData.verifiedData.id}`);
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
    switch (messageData.verifiedData.object) {
      case 'c':
        return messageData.verifiedData.categoryReason;
        break;
      case 'o':
        return " ";
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
              <Descriptions.Item label="审核人名">{messageData.auditorName}</Descriptions.Item>
              <Descriptions.Item label="消息发送时间">
                {moment(messageData.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="审核申请" span={3}>
                {this.getReason()}
              </Descriptions.Item>
              <Descriptions.Item label="审核结果" span={3}>
                {this.getResult(messageData.result)}
              </Descriptions.Item>
              <Descriptions.Item label="审核返回信息" span={3}>
                {messageData.reason}
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
