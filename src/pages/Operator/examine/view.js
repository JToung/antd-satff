import React, { PureComponent } from 'react';
import {
  Descriptions,
  Select,
  Row,
  Col,
  Input,
  Badge,
  Card,
  Button,
  message,
  Modal,
  Upload,
  Form,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import OPERATOR_USER from '@/utils/memoryUtils';
import { OPERATOR_URL } from '@/utils/Constants';
import moment from 'moment';
import Link from 'umi/link';
const statusMap = ['warning', 'success', 'error'];
const status = ['未审核', '审核通过', '审核未通过'];

/*
  返回审核model
*/
const ExamineForm = Form.create()(props => {
  const { examineViewVisible, form, handleExamineViewOk, handleExamineViewCancel } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleExamineViewOk(fieldsValue);
      console.log('fieldsValue', fieldsValue);
    });
  };

  return (
    <Modal
      title="填写审核内容"
      visible={examineViewVisible}
      onOk={okHandle}
      onCancel={handleExamineViewCancel}
      width={720}
    >
      <Form layout="vertical">
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="审核结果">
                {getFieldDecorator('auditStatus', {
                  rules: [{ required: true, message: '请选择审核结果' }],
                })(
                  <Select placeholder="请选择审核结果">
                    <Option value="1">审核通过</Option>
                    <Option value="2">审核不通过</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="审核理由">
                {getFieldDecorator('reason', {
                  rules: [
                    {
                      required: true,
                      message: '请输入审核理由',
                    },
                  ],
                })(
                  <Input.TextArea style={{ minHeight: 32 }} placeholder="请输入审核理由" rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
});
@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
@Form.create()
class Center extends PureComponent {
  state = {
    operatorProofVisible: false,
    legalPersonPhotoVisible: false,
    operatorE: {},
    contractViewVisible: false,
    newContractViewVisible: false,
    examineViewVisible: false,
    Contract: {},
    valT: {},
  };

  componentDidMount() {
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

    const { dispatch } = this.props;
    const payload = {
      object: 'o',
      _id: this.props.match.params._id,
    };

    dispatch({
      type: 'operator/fetchAdjust',
      payload: payload,
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        const { Contract } = this.state;
        const findResultD = {
          ...res.findResult[0].changedData,
          timestamp: res.findResult[0].timestamp,
          _id: res.findResult[0]._id,
          auditTime: res.findResult[0].auditTime,
          id: res.findResult[0].objectId,
          auditStatus: res.findResult[0].auditStatus,
        };
        this.setState({ Contract: findResultD });
      } else {
        this.setState({ Contract: {} });
      }
    });
    console.log('Contract:', this.state.Contract);
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
      return <Badge status="success" text="审核通过" />;
    } else if (examineState == '2') {
      return <Badge status="error" text="审核不通过" />;
    } else {
      return <Badge status="warning" text="未审核" />;
    }
  }

  //提交审核
  handleExamineViewOk = (values, e) => {
    const { dispatch } = this.props;
    const { valT } = this.state;
    console.log('valT', valT);
    console.log(e);
    const data = {
      ...values,
      auditorID: localStorage.getItem('userId'),
      adjustId: valT._id,
      auditTime: new Date().getTime(),
    };
    console.log('data', data);

    dispatch({
      type: 'operator/verifyOperator',
      payload: data,
    }).then(res => {
      if (res.status == '1') {
        message.success(res.information);
        //刷新页面
        location.reload(true);
      } else {
        message.error(res.information);
      }
    });

    this.setState({
      examineViewVisible: false,
    });
  };

  showExamineViewModal = (val, e) => {
    console.log(e);
    this.setState({
      valT: val,
      examineViewVisible: true,
    });
  };

  handleExamineViewCancel = e => {
    console.log(e);
    this.setState({
      examineViewVisible: false,
    });
  };

  //运营凭证查看
  showProofModal = () => {
    this.setState({
      operatorProofVisible: true,
    });
  };

  handleProofOk = e => {
    // console.log(e);
    this.setState({
      operatorProofVisible: false,
    });
  };

  handleProofCancel = e => {
    // console.log(e);
    this.setState({
      operatorProofVisible: false,
    });
  };

  //证件照查看
  showPersonPhotoModal = () => {
    this.setState({
      legalPersonPhotoVisible: true,
    });
  };

  handlePersonPhotoOk = e => {
    // console.log(e);
    this.setState({
      legalPersonPhotoVisible: false,
    });
  };

  handlePersonPhotoCancel = e => {
    // console.log(e);
    this.setState({
      legalPersonPhotoVisible: false,
    });
  };

  getState = state => {
    const { Contract } = this.state;
    if (state == '0') {
      return (
        <div>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/operator/examine/list');
                }}
                className={styles.ButtonRight}
              >
                返回列表
              </Button>
            </Col>
            <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Button
                type="danger"
                onClick={() => this.showExamineViewModal(Contract)}
                className={styles.ButtonLeft}
              >
                审核
              </Button>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <Button
          type="primary"
          onClick={() => {
            this.props.history.push('/operator/examine/list');
          }}
          className={styles.ButtonCenter}
        >
          返回列表
        </Button>
      );
    }
  };
  render() {
    const {
      previewVisible,
      previewImage,
      operator,
      Contract,
      operatorProofVisible,
      legalPersonPhotoVisible,
    } = this.state;
    const { loading } = this.props;
    console.log('loading', loading);
    console.log('Contract', Contract);
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.operator.basic.title" />}>
        <Card bordered={false}>
          <Descriptions title="运营商审核信息详情" bordered layout="vertical">
            <Descriptions.Item label="运营商ID">{Contract._id}</Descriptions.Item>
            <Descriptions.Item label="运营商名">{Contract.operatorName}</Descriptions.Item>
            <Descriptions.Item label="系统分成">在合约表（运营商约束）中</Descriptions.Item>
            <Descriptions.Item label="审核状态" span={3}>
              {this.onExamineState(Contract.auditStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="运营商凭证">
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={OPERATOR_URL + Contract.operatorProof}
                onClick={this.showProofModal}
              />
              <Modal
                title="运营商凭证"
                visible={operatorProofVisible}
                footer={null}
                onCancel={this.handleProofCancel}
                onOk={this.handleProofOk}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={OPERATOR_URL + Contract.operatorProof}
                />
              </Modal>
            </Descriptions.Item>
            <Descriptions.Item label="入驻时间" span={2}>
              {moment(Contract.operatorAddTime)
                .subtract(8, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="运营商简介" span={3}>
              {Contract.introduction}
            </Descriptions.Item>
            <Descriptions.Item label="运营商介绍" span={3}>
              {Contract.content}
            </Descriptions.Item>
            <Descriptions.Item label="运行状态" span={3}>
              {this.onOperatorState(Contract.states)}
            </Descriptions.Item>
            <Descriptions.Item label="运营商法人">{Contract.legalPerson}</Descriptions.Item>
            <Descriptions.Item label="法人身份信息">{Contract.legalPersonIdNo}</Descriptions.Item>
            <Descriptions.Item label="法人联系方式">{Contract.legalPersonPhone}</Descriptions.Item>
            <Descriptions.Item label="法人证件照">
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={OPERATOR_URL + Contract.legalPersonPhoto}
                onClick={this.showPersonPhotoModal}
              />
              <Modal
                title="法人证件照"
                visible={legalPersonPhotoVisible}
                footer={null}
                onCancel={this.handlePersonPhotoCancel}
                onOk={this.handlePersonPhotoOk}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={OPERATOR_URL + Contract.legalPersonPhoto}
                />
              </Modal>
            </Descriptions.Item>
            <Descriptions.Item label="法人邮箱">{Contract.legalPersonEmail}</Descriptions.Item>
            <Descriptions.Item label="法人地址">{Contract.legalPersonAdress}</Descriptions.Item>
          </Descriptions>
          <Card>
            {this.getState(Contract.auditStatus)}
            <ExamineForm
              examineViewVisible={this.state.examineViewVisible}
              handleExamineViewOk={this.handleExamineViewOk}
              handleExamineViewCancel={this.handleExamineViewCancel}
            />
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Center;
