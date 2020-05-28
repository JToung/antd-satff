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
const statusMap = ['error', 'success', 'warning'];
const status = ['中止', '顺利完成', '进行中'];

/* eslint react/no-multi-comp:0 */
@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff'],
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
    servicerE: [],
    Contract: {},
    cashflow: [],
    valT: {},
  };

  columns = [
    {
      title: '现金流ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '平台应收款',
      dataIndex: 'systemReceivable',
      key: 'systemReceivable',
    },
    {
      title: '订单总金额',
      dataIndex: 'userPayable',
      key: 'userPayable',
    },
    {
      title: '现金流产生时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结算状态',
      dataIndex: 'state',
      key: 'state',
      render: val => <Badge status={statusMap[val]} text={status[val]} />,
    },
    {
      title: '操作',
      width: 250,
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link onClick={() => this.showViewModal(val)}>查看</Link>
          {this.getView()}
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

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
    dispatch({
      type: 'staff/queryCash',
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        this.setState({ cashflow: res.findResult });
      }
    });
    console.log('cashflow:', this.state.cashflow);
  }

  /*
  查看审核内容
  */
  getView = () => {
    const { Contract } = this.state;
    if (Contract._id != null) {
      return (
        <Modal
          title="查看现金流内容"
          visible={this.state.viewVisible}
          onOk={this.handleViewOk}
          onCancel={this.handleViewCancel}
          width={720}
        >
          <Descriptions bordered layout="vertical">
            <Descriptions.Item label="现金流ID">{Contract._id}</Descriptions.Item>
            <Descriptions.Item label="用户应付款">{Contract.userPayable}</Descriptions.Item>
            <Descriptions.Item label="结算状态">
              <Badge status={statusMap[Contract.state]} text={status[Contract.state]} />
            </Descriptions.Item>
            <Descriptions.Item label="订单id">{Contract.orderId}</Descriptions.Item>
            <Descriptions.Item label="产生时间">
              <span>{moment(Contract.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Descriptions.Item>
            <Descriptions.Item label="平台所得">{Contract.systemReceivable}</Descriptions.Item>
            <Descriptions.Item label="退款" span={3}>
              {Contract.refund}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      );
    } else {
      return (
        <Modal
          title="查看审核内容"
          visible={this.state.viewVisible}
          onOk={this.handleViewOk}
          onCancel={this.handleViewCancel}
          width={720}
        >
          查询错误
        </Modal>
      );
    }
  };

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
    dispatch({
      type: 'staff/queryCash',
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        this.setState({ cashflow: res.findResult });
      }
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
    this.setState({ cashflow: [] });
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
      };
      dispatch({
        type: 'staff/queryCash',
        payload: payload,
      }).then(res => {
        console.log('res：', res);
        if (res.status == '1') {
          this.setState({ cashflow: res.findResult });
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
            <FormItem label="运营商ID">
              {getFieldDecorator('operatorId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结算状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择结算状态">
                  <Option value="0">中止</Option>
                  <Option value="1">顺利完成</Option>
                  <Option value="2">正在进行</Option>
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
    const { cashflow } = this.state;
    console.log('cashflow', cashflow);
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
              dataSource={cashflow}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: this.getL(cashflow), // 数据总数
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
