import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Modal, Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';
import Link from 'umi/link';

@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchAdjust'],
  //model
}))
class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adjust: [],
    };
  }
  componentWillMount() {
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

    const params1 = {
      _id: params._id,
    };

    setTimeout(
      () =>
        dispatch({
          type: 'category/fetchAdjust',
          payload: params1,
        }).then(res => {
          const adjust = res.findResult[0];
          console.log('componentDidMountres123：', res);
          setTimeout(
            () =>
              this.setState({ adjust: adjust }, () => {
                console.log('componentDidMountres111：' + this.state.adjust);
              }),
            0
          );
        }),
      0
    );
  }

  onState(categoryState) {
    // if (categoryState == '1') {
    //   return <Badge status="success" text="已上架" />;
    // } else {
    //   return <Badge status="error" text="未上架" />;
    // }
    switch (categoryState) {
      case '0':
        return <Badge status="warning" text="未审核" />;
        break;
      case '1':
        return <Badge status="success" text="审核通过" />;
        break;
      case '2':
        return <Badge status="error" text="审核未通过" />;
        break;
      default:
        return null;
    }
  }

  render() {
    const { loading } = this.props;
    const { adjust } = this.state;
    // console.log('operator.date',operator);
    if (adjust._id == null) {
      return (
        // 加头部
        <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
          <Card bordered={false}>
            <Descriptions title="服务品类包信息" bordered loading={loading}>
              
            </Descriptions>
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
    } else if (adjust._id != null) {
      return (
        // 加头部
        <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
          <Card bordered={false}>
            <Descriptions title="服务品类包信息" bordered loading={loading} layout="vertical">
              <Descriptions.Item label="品类包ID">{adjust._id}</Descriptions.Item>
              <Descriptions.Item label="品类包名">
                {adjust.changedData.categoryName}
              </Descriptions.Item>
              <Descriptions.Item label="品类包申请审核时间" span={3}>
                {moment(adjust.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="品类包介绍" span={3}>
                {adjust.changedData.categoryIntrod}
              </Descriptions.Item>
              <Descriptions.Item label="品类包申请状态" span={3}>
                {this.onState(adjust.auditStatus)}
              </Descriptions.Item>
            </Descriptions>
            <br />
            <Descriptions title="品类规范（用于品类下级单品规范）" bordered loading={loading} layout="vertical">
              <Descriptions.Item label="规范必要说明" span={3}>
                {adjust.changedData.categoryExplanation}
              </Descriptions.Item>
              <Descriptions.Item label="名称最小字数">
                {adjust.changedData.categoryMinName}
              </Descriptions.Item>
              <Descriptions.Item label="简介最大字数">
                {adjust.changedData.categoryMaxIntroduction}
              </Descriptions.Item>
              <Descriptions.Item label="详情最大字数">
                {adjust.changedData.categoryMaxContent}
              </Descriptions.Item>
              <Descriptions.Item label="名称最大字数">
                {adjust.changedData.categoryMaxName}
              </Descriptions.Item>
              <Descriptions.Item label="简介最小字数">
                {adjust.changedData.categoryMinIntroduction}
              </Descriptions.Item>
              <Descriptions.Item label="详情最小字数">
                {adjust.changedData.categoryMinContent}
              </Descriptions.Item>
              <Descriptions.Item label="最大分区数">
                {adjust.changedData.categoryMaxPartition}
              </Descriptions.Item>
              <Descriptions.Item label="最少任务数">
                {adjust.changedData.categoryMinTasks}
              </Descriptions.Item>
              <Descriptions.Item label="最小评分">
                {adjust.changedData.categoryMinScore}
              </Descriptions.Item>
              <Descriptions.Item label="最小分区数">
                {adjust.changedData.categoryMinPartition}
              </Descriptions.Item>
              <Descriptions.Item label="最大任务数">
                {adjust.changedData.categoryMaxTasks}
              </Descriptions.Item>
              <Descriptions.Item label="任务最长时间">
                {adjust.changedData.categoryMaxTaskTime}
              </Descriptions.Item>
              <Descriptions.Item label="单个分区最低价格">
                {adjust.changedData.categoryMinPrice}
              </Descriptions.Item>
              <Descriptions.Item label="单个分区最高价格" span={2}>
                {adjust.changedData.categoryMaxPrice}
              </Descriptions.Item>
              <Descriptions.Item label="审核理由" span={3}>
                {adjust.changedData.categoryReason}
              </Descriptions.Item>
            </Descriptions>
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
