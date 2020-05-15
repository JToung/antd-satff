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
class View1 extends PureComponent {
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
      type: 'message/queryNews',
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
  getLable = item => {
    switch (item.verifiedData.object) {
      case 'c':
        return <Link to={`/category/view-categroy/${item.verifiedData.id}`}>查看</Link>;
        break;
      case 'o':
        return <Link to={`operator/center/info`}>查看</Link>;
        break;
      case 'I':
        return <Link to={`/item/view-item/${item.verifiedData.id}`}>查看</Link>;
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
            <Descriptions title="消息详细信息" bordered loading={loading}>
              <Descriptions.Item label="消息ID">{messageData._id}</Descriptions.Item>
              <Descriptions.Item label="审核人名">
                {messageData.auditorName}
              </Descriptions.Item>
              <Descriptions.Item label="消息发送时间">
                {moment(messageData.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="审核结果" span={2}>
                {this.getResult(messageData.result)}
              </Descriptions.Item>
              <Descriptions.Item label="审核返回信息" span={3}>
                {messageData.reason}
              </Descriptions.Item>
              <Descriptions.Item label="具体信息" span={3}>
                {this.getLable(messageData)}
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
        <PageHeaderWrapper title={"消息管理"}>
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

export default View1;
