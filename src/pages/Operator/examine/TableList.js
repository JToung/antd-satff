import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Descriptions,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import memoryUtils from '@/utils/memoryUtils';
import { OPERATOR_URL } from '@/utils/Constants';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
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
      console.log('fieldsValue',fieldsValue)
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

/* eslint react/no-multi-comp:0 */
@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator'],
  //model
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    examineViewVisible: false,
    viewVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    servicer: [],
    operatorE: [],
    Contract: {},
    valT: {},
  };

  columns = [
    {
      title: '运营商名称',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      width: 150,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      render: val => this.getVal(val),
    },
    {
      title: '申请审核时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: val => (
        <span>
          {moment(val).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      width: 200,
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link to={`/operator/examine/view-operator/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          {this.initialValue(val)}
          <ExamineForm
            examineViewVisible={this.state.examineViewVisible}
            handleExamineViewOk={this.handleExamineViewOk}
            handleExamineViewCancel={this.handleExamineViewCancel}
          />
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.auditStatus == '0') {
      return <a onClick={() => this.showExamineViewModal(val)}>审核</a>;
    } else {
      return <Link disabled>已审核</Link>;
    }
  }

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
    const { dispatch } = this.props;
    const payload = {
      object: 'o',
    };

    dispatch({
      type: 'operator/fetchAdjust',
      payload: payload,
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        res.findResult.map(findResult => {
          const { operatorE } = this.state;
          const findResultD = {
            ...findResult.changedData,
            timestamp: findResult.timestamp,
            _id: findResult._id,
            auditTime: findResult.auditTime,
            id: findResult.objectId,
            auditStatus: findResult.auditStatus,
          };
          this.setState({ operatorE: [...operatorE, findResultD] });
        });
      } else {
        this.setState({ operatorE: [] });
      }
    });
    console.log('operatorE:', this.state.operatorE);
  }

  /**
   * 审核状态
   * @param {*} examineState
   */
  onExamineState(examineState) {
    if (examineState == '1') {
      return <Badge status="success" text="已通过" />;
    } else if (examineState == '2') {
      return <Badge status="error" text="未通过" />;
    } else {
      return <Badge status="warning" text="审核中" />;
    }
  }
  /**
   * 运行状态
   * @param {*} operatorState
   */
  onOperatorState(operatorState) {
    if (operatorState == '1') {
      return <Badge status="success" text="运行中" />;
    } else {
      return <Badge status="error" text="已停止运行" />;
    }
  }

  /**
   * 审核时间
   * @param {*} val
   */
  getVal(val) {
    console.log(val);
    switch (val) {
      case undefined:
        return <span>未审核</span>;
        break;
      default:
        return (
          <span>
            {/* {moment(val)
              .subtract(8, 'hours')
              .format('YYYY-MM-DD HH:mm:ss')} */}
            {moment(val).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
    }
  }

  //查看审核
  handleViewOk = e => {
    console.log(e);
    this.setState({
      viewVisible: false,
    });
  };

  showViewModal = (val, e) => {
    console.log(e);
    this.setState({
      Contract: val,
      viewVisible: true,
    });
  };

  handleViewCancel = e => {
    console.log(e);
    this.setState({
      viewVisible: false,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const payload = {
      object: 'o',
    };
    dispatch({
      type: 'operator/fetchAdjust',
      payload: payload,
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        res.findResult.map(findResult => {
          const { operatorE } = this.state;
          const findResultD = {
            ...findResult.changedData,
            timestamp: findResult.timestamp,
            _id: findResult._id,
            auditTime: findResult.auditTime,
            id: findResult.objectId,
            auditStatus: findResult.auditStatus,
          };
          this.setState({ operatorE: [...operatorE, findResultD] });
        });
      } else {
        this.setState({ operatorE: [] });
      }
    });
  };

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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      console.log('fieldsValue', values);

      this.setState({
        formValues: values,
      });

      console.log('payload', payload);
      const payload = {
        ...values,
        object: 'o',
      };
      console.log('payload',payload)
      dispatch({
        type: 'operator/fetchAdjust',
        payload: payload,
      }).then(res => {
        console.log('res：', res);
        this.setState({ operatorE: [] });
        if (res.status == '1') {
          res.findResult.map(findResult => {
            const { operatorE } = this.state;
            const findResultD = {
              ...findResult.changedData,
              timestamp: findResult.timestamp,
              _id: findResult._id,
              auditTime: findResult.auditTime,
              id: findResult.objectId,
              auditStatus: findResult.auditStatus,
            };
            this.setState({ operatorE: [...operatorE, findResultD] });
          });
        } else {
          this.setState({ operatorE: [] });
        }
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="运营商名">
              {getFieldDecorator('changedData.operatorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运营商审核状态">
              {getFieldDecorator('auditStatus')(
                <Select placeholder="请选择">
                  <Option value="0">未审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  queryDate(item) {
    console.log('item', item);
    if (item != []) {
      this.setState();
      return item;
    } else {
      return item;
    }
  }

  getL(data){
    if(data != null){
      return data.length;
    }else{
      return 0;
    }
  }

  render() {
    const { loading } = this.props;
    const { operatorE } = this.state;
    console.log('operatorE', operatorE);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={operatorE}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: this.getL(operatorE), // 数据总数
                pageSize: 6, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
              }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default TableList;
