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
import { OPERATOR_URL } from '@/utils/Constants';
import UploadlegalPersonPhoto from './UploadlegalPersonPhoto';

@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
@Form.create()
class Update extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
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
      type: 'operator/fetchOperator',
      payload: params.id || localStorage.getItem('userId'),
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
        operatorReviseTime: new Date(),
        id: localStorage.getItem('userId'),
        account: values.legalPersonEmail,
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
        type: 'operator/upOperator',
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
      operator = {},
      loading,
      form: { getFieldDecorator },
    } = this.props;
    console.log(operator);
    return (
      // 加头部
      <Card bordered={false} title="运营商基础信息修改">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运营商ID">
                <span className="ant-form-text">{operator.data._id}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="运营商名">
                {getFieldDecorator('operatorName', {
                  initialValue: operator.data.operatorName,
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商名',
                    },
                    { max: 100, message: '名称过长！' },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="系统分成">
                <span className="ant-form-text">在合约表（运营商约束）中</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运行状态">
                {getFieldDecorator('states', {
                  initialValue: operator.data.operatorState,
                  rules: [
                    {
                      required: true,
                      message: '请选择运行状态',
                    },
                  ],
                })(
                  <Select>
                    <Option value="1">正在运行中</Option>
                    <Option value="0">已停止运行</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="入驻时间">
                <span className="ant-form-text">{operator.data.operatorAddTime}</span>
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item name="operatorProof" label="营销凭证" valuePropName="fileList">
                {getFieldDecorator('operatorProof', {
                  // rules: [{ required: true, message: '请上传凭证' }],
                })(
                  <Upload name="operatorProof" action="/upload.do" listType="picture">
                    <Button>
                      <UploadOutlined /> 请上传营销凭证
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="运营商简介">
                {getFieldDecorator('operatorIntroduction', {
                  initialValue: operator.data.operatorIntroduction,
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商简介',
                    },
                  ],
                })(<Input.TextArea style={{ minHeight: 32 }} rows={2} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="运营商介绍">
                {getFieldDecorator('content', {
                  initialValue: operator.data.content,
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商介绍',
                    },
                  ],
                })(
                  <Input.TextArea
                    style={{ minHeight: 32 }}
                    placeholder={operator.data.content}
                    rows={4}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="运营商法人">
                {getFieldDecorator('legalPerson', {
                  initialValue: operator.data.legalPerson,
                  rules: [{ required: true, message: '请输入运营商法人名' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人身份信息">
                {getFieldDecorator('legalPersonIdNo', {
                  initialValue: operator.data.legalPersonIdNo,
                  rules: [
                    { required: true, message: '请输入法人身份信息' },
                    {
                      validator: IdCodeValid,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人联系方式">
                {getFieldDecorator('legalPersonPhone', {
                  initialValue: operator.data.legalPersonPhone,
                  rules: [
                    { required: true, message: '请输入法人联系方式' },
                    {
                      pattern: /(^[1]([3-9])[0-9]{9}$)|(^\d{3}-\d{8}|\d{4}-\d{7})/,
                      message: '请输入正确的法人联系方式',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="法人证件照">
                {getFieldDecorator('legalPersonPhoto', {
                  rules: [{ required: true, message: '请上传法人证件照' }],
                })(<UploadlegalPersonPhoto name={'legalPersonPhoto'} />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人邮箱">
                {getFieldDecorator('legalPersonEmail', {
                  initialValue: operator.data.legalPersonEmail,
                  rules: [
                    { required: true, message: '请输入法人邮箱' },
                    {
                      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                      message: '请输入正确的法人邮箱',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item label="法人地址">
                {getFieldDecorator('legalPersonAdress', {
                  initialValue: operator.data.legalPersonAdress,
                  rules: [{ required: true, message: '请输入法人地址' }],
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
            <Col xl={{ span: 6}} lg={{ span: 12}} md={{ span: 12 }} sm={24}>
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
