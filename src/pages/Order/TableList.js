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
const statusMap = ['lime', 'yellow', 'cyan', 'geekblue','red','green' ];
const status = ['接单尚未变为工单', '已接单且已变为便为工单', '已接单且已分配专才', '订单确认开始','订单取消', '订单完成'];

/* eslint react/no-multi-comp:0 */
@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order'],
  //model
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    order: [],
  };

  columns = [
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '订单应付款',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: '订单开始时间',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '订单状态',
      dataIndex: 'orderState',
      key: 'orderState',
      render(val) {
        return <Badge color={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link to={`/order/view-order/${val._id}`}>查看</Link>
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
      type: 'order/queryOrder',
    }).then(res => {
      this.setState({ order: res.findResult });
    });
    console.log('order:', this.state.order);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'order/queryOrder',
    }).then(res => {
      this.setState({ order: res.findResult });
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

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
      const payload = {
        ...values,
      };
      console.log('payload', payload);
      dispatch({
        type: 'order/queryOrder',
        payload: payload,
      }).then(res => {
        this.setState({ order: res.findResult });
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
            <FormItem label="订单ID">
              {getFieldDecorator('orderId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderState')(
                <Select placeholder="请选择">
                  <Option value="0">已接单尚未变为工单</Option>
                  <Option value="1">已接单且已变为便为工单</Option>
                  <Option value="2">已接单且已分配专才</Option>
                  <Option value="3">订单确认开始</Option>
                  <Option value="4">订单取消</Option>
                  <Option value="5">订单完成</Option>
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
    if (item.data != null) {
      this.setState();
      return item.data.findResult;
    } else {
      return item;
    }
  }

  render() {
    const { loading } = this.props;
    const { order } = this.state;
    console.log('order', order);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              selectedRows={selectedRows}
              rowKey="orderId"
              loading={loading}
              dataSource={this.queryDate(order)}
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
