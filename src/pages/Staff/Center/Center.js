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

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff/fetchStaff'],
  //model
}))
class Center extends PureComponent {
  state = {
    previewVisible: false,
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

    dispatch({
      type: 'staff/fetchStaff',
      // payload: params.id || localStorage.getItem('userId'),
      payload: params.id || localStorage.getItem('userId'),
    });

    console.log('this.props.data', localStorage.getItem('userId'));
  }

  render() {
    const { previewVisible, previewImage } = this.state;
    const { staff = {}, loading } = this.props;
    console.log('staff', staff);
    console.log('this.props.data', localStorage.getItem('userId'));
    // console.log('operator.date',operator);
    if (staff.data.result == null) {
      return  <Card bordered={false} />;
    } else {
      return(
        // 加头部
        <Card bordered={false}>
          <Descriptions title="平台管理人员基础信息管理" bordered loading={loading}>
            <Descriptions.Item label="平台管理人员ID">{staff.data.result._id}</Descriptions.Item>
            <Descriptions.Item label="平台管理人员名">{staff.data.result.name}</Descriptions.Item>
            <Descriptions.Item label="平台管理人员证件照">
              {/* <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={OPERATOR_URL + staff.data.legalPersonPhoto}
              /> */}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {moment(staff.data.result.joinTime)
                .subtract(8, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员身份证号">
              {staff.data.result.legalPersonIdNo}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员联系方式">
              {staff.data.result.phone}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员邮箱" span={3}>
              {staff.data.result.email}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员地址" span={3}>
              {staff.data.result.legalPersonAdress}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员详细信息" span={3}>
              {staff.data.result.introduction}
            </Descriptions.Item>
          </Descriptions>
          <Card>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push('/staff/center/update');
              }}
              className={styles.ButtonCenter}
            >
              修改基础信息
            </Button>
          </Card>
        </Card>
      );
    }
  }
}

export default Center;
