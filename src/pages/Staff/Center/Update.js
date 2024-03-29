import React, { PureComponent } from 'react';
import {
  Upload,
  Select,
  Row,
  Col,
  Form,
  Input,
  Descriptions,
  Badge,
  Card,
  Button,
  message,
} from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import { UploadOutlined } from '@ant-design/icons';
import { IdCodeValid } from '@/utils/utils';
import { OPERATOR_URL, platform_URL } from '@/utils/Constants';
import UploadlegalPersonPhoto from './UploadlegalPersonPhoto';

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff/fetchStaff'],
  //model
}))
@Form.create()
class Update extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
    staff: {},
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
    console.log(localStorage.getItem('userId'));
    const { dispatch, match } = this.props;
    const { params } = match;
    // const { dispatch } = this.props;
    dispatch({
      type: 'staff/fetchStaff',
      payload: params.id || localStorage.getItem('userId'),
    }).then(res => {
      if (res.status == '1') {
        this.setState({ staff: res.result });
      }
    });
    // console.log('this.props.data',this.props.data);
  }

  //点击保存的时候进行验证
  handleSubmit = e => {
    const { dispatch, match } = this.props;
    const { params } = match;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const payload = {
        ...values,
        staffReviseTime: new Date().getTime(),
        id: localStorage.getItem('userId'),
        account: values.email,
      };

      console.log('values', values);
      if (err) {
        console.log('err' + err);
        return;
      }
      // if (!err) {
      //   console.log('receive the value of input ' + values);
      // }
      console.log('参数', payload);

      dispatch({
        type: 'staff/updatetaff',
        payload,
      }).then(res => {
        console.log('res', res);
        if (res != null) {
          message.success('编辑成功！');
          this.props.history.push('/staff/center');
        } else {
          message.error('编辑失败，请重试!');
        }
      });
    });
  };

  render() {
    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    };
    const tailLayout = {
      wrapperCol: { offset: 2, span: 8 },
    };
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { staff } = this.state;
    console.log(staff);
    return (
      // 加头部
      <Card bordered={false} title="平台管理人员基础信息修改">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="平台管理人员ID">
                <span className="ant-form-text">{staff._id}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="平台管理人员姓名">
                {getFieldDecorator('name', {
                  initialValue: staff.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入平台管理人员姓名',
                    },
                    { max: 100, message: '名称过长！' },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="平台管理人员证件照">
                {getFieldDecorator('photo', {
                  rules: [{ required: true, message: '请上传平台管理人员证件照' }],
                })(<UploadlegalPersonPhoto name={'photo'} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{ span: 12 }} lg={{ span: 24 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="注册时间">
                <span className="ant-form-text">{staff.joinTime}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 12 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="平台管理人员邮箱">
                {getFieldDecorator('email', {
                  initialValue: staff.email,
                  rules: [
                    { required: true, message: '请输入平台管理人员邮箱' },
                    {
                      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                      message: '请输入正确的平台管理人员邮箱',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {/* <Col lg={12} md={12} sm={24}>
              <Form.Item label="平台管理人员身份证">
                {getFieldDecorator('legalPersonIdNo', {
                  initialValue: staff.legalPersonIdNo,
                  rules: [
                    { required: true, message: '请输入平台管理人员身份证' },
                    {
                      validator: IdCodeValid,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col> */}
            <Col xl={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="平台管理人员联系方式">
                {getFieldDecorator('phone', {
                  initialValue: staff.phone,
                  rules: [
                    { required: true, message: '请输入平台管理人员联系方式' },
                    {
                      pattern: /(^[1]([3-9])[0-9]{9}$)|(^\d{3}-\d{8}|\d{4}-\d{7})/,
                      message: '请输入正确的平台管理人员联系方式',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.ButtonRight}
                  loading={loading}
                >
                  确认修改
                </Button>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.ButtonLeft}
                  onClick={() => {
                    this.props.history.push('/staff/center');
                  }}
                  loading={loading}
                >
                  返回首页
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Update;
