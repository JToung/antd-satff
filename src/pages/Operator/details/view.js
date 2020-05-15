import React, { PureComponent } from 'react';
import { Descriptions, Badge, Card, Button, message, Modal, Upload } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import OPERATOR_USER from '@/utils/memoryUtils';
import { OPERATOR_URL } from '@/utils/Constants';
import moment from 'moment';

@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
class Center extends PureComponent {
  state = {
    previewVisible: false,
    operator:{},
  };


  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    // const { dispatch } = this.props;
    console.log('参数', localStorage.getItem('userId'));

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

    const params1 = {
      _id: this.props.match.params._id,
    };

    dispatch({
      type: 'operator/fetchOperator',
      payload: params1,
    }).then(res => {
      this.setState({ operator: res.foundData[0] });
    });

    // console.log('this.props.data',this.props.data);
  }

  onOperatorState(operatorState) {
    if (operatorState == '1') {
      return <Badge status="success" text="运行中" />;
    } else {
      return <Badge status="error" text="已停止运行" />;
    }
  }

  onExamineState(examineState) {
    if (examineState == '1') {
      return <Badge status="success" text="已通过" />;
    } else if (examineState == '0') {
      return <Badge status="error" text="未通过" />;
    } else {
      return <Badge status="warning" text="审核中" />;
    }
  }

  render() {
    const { previewVisible, previewImage, operator } = this.state;
    const {  loading } = this.props;
    console.log('loading',loading)
    // console.log('operator.date',operator);
    return (
      // 加头部
      <Card bordered={false}>
        <Descriptions title="运营商基础信息管理" bordered loading={loading}>
          <Descriptions.Item label="运营商ID">{operator._id}</Descriptions.Item>
          <Descriptions.Item label="运营商名">{operator.operatorName}</Descriptions.Item>
          <Descriptions.Item label="系统分成">在合约表（运营商约束）中</Descriptions.Item>
          <Descriptions.Item label="入驻时间" span={2}>
            {moment(operator.operatorAddTime)
                  .subtract(8, 'hours')
                  .format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="运营商凭证"></Descriptions.Item>
          <Descriptions.Item label="运营商简介" span={3}>
            {operator.operatorIntroduction}
          </Descriptions.Item>
          <Descriptions.Item label="运营商介绍" span={3}>
            {operator.content}
          </Descriptions.Item>
          <Descriptions.Item label="运行状态" span={3}>
            {this.onOperatorState(operator.operatorState)}
          </Descriptions.Item>
          <Descriptions.Item label="运营商法人">{operator.legalPerson}</Descriptions.Item>
          <Descriptions.Item label="法人身份信息">
            {operator.legalPersonIdNo}
          </Descriptions.Item>
          <Descriptions.Item label="法人联系方式">
            {operator.legalPersonPhone}
          </Descriptions.Item>
          <Descriptions.Item label="法人证件照">
            <img
              alt="example"
              style={{ width: 70, height: 70 }}
              src={OPERATOR_URL + operator.legalPersonPhoto}
            />
          </Descriptions.Item>
          <Descriptions.Item label="法人邮箱">{operator.legalPersonEmail}</Descriptions.Item>
          <Descriptions.Item label="法人地址">{operator.legalPersonAdress}</Descriptions.Item>
          {/* <Descriptions.Item label="审核状态" span={3}>
            {this.onExamineState(operator.operatorState)}
          </Descriptions.Item> */}
        </Descriptions>
        <Card>
          <Button
            type="primary"
            onClick={() => {
              this.props.history.push('/operator/list');
            }}
            className={styles.ButtonCenter}
          >
            返回列表
          </Button>
        </Card>
      </Card>
    );
  }
}

export default Center;
