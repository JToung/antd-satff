import React, { PureComponent } from 'react';
import { Descriptions, Badge, Card, Button, message, Modal, Upload } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import OPERATOR_USER from '@/utils/memoryUtils';
import { OPERATOR_URL, platform_URL } from '@/utils/Constants';
import moment from 'moment';

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff/fetchStaff'],
  //model
}))
class Center extends PureComponent {
  state = {
    previewVisible: false,
    photoVisible: false,
    staff: {},
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
    }).then(res => {
      if (res.status == '1') {
        this.setState({ staff: res.result });
      }
    });

    console.log('this.props.data', localStorage.getItem('userId'));
  }

  Out = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  //证件照查看

  showPhotoModal = () => {
    this.setState({
      photoVisible: true,
    });
  };

  handPhotoOk = e => {
    // console.log(e);
    this.setState({
      photoVisible: false,
    });
  };

  handPhotoCancel = e => {
    // console.log(e);
    this.setState({
      photoVisible: false,
    });
  };

  render() {
    const { previewVisible, previewImage, staff, photoVisible } = this.state;
    const { loading } = this.props;
    console.log('staff', staff);
    console.log('this.props.data', localStorage.getItem('userId'));
    // console.log('operator.date',operator);
    if (staff._id == null) {
      return (
        <Card bordered={false}>
          <Button
            type="danger"
            onClick={() => this.Out()}
            className={styles.ButtonCenter}
          >
            退出登录
          </Button>
        </Card>
      );
    } else {
      return (
        // 加头部
        <Card bordered={false}>
          <Descriptions title="平台管理人员基础信息管理" bordered loading={loading}>
            <Descriptions.Item label="平台管理人员ID">{staff._id}</Descriptions.Item>
            <Descriptions.Item label="平台管理人员姓名">{staff.name}</Descriptions.Item>
            <Descriptions.Item label="平台管理人员证件照">
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={platform_URL + staff.photo}
                onClick={this.showPhotoModal}
              />
              <Modal
                title="法人证件照"
                visible={photoVisible}
                footer={null}
                onCancel={this.handPhotoCancel}
                onOk={this.handPhotoOk}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={platform_URL + staff.photo}
                />
              </Modal>
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {moment(staff.joinTime)
                .subtract(8, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {/* <Descriptions.Item label="平台管理人员身份证号">
              {staff.legalPersonIdNo}
            </Descriptions.Item> */}
            <Descriptions.Item label="平台管理人员联系方式">{staff.phone}</Descriptions.Item>
            <Descriptions.Item label="平台管理人员邮箱" span={3}>
              {staff.email}
            </Descriptions.Item>
            <Descriptions.Item label="平台管理人员详细信息" span={3}>
              {staff.introduction}
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
