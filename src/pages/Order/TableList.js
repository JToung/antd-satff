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
const statusMap = ['red', 'green', 'yellow', 'cyan', 'geekblue'];
const status = ['结束', '进行中', '待分配', '用户终止', '等待启动'];

/* eslint react/no-multi-comp:0 */
@connect(({ workorder, loading }) => ({
  workorder,
  loading: loading.effects['workorder'],
  //model
}))
@Form.create()
class TableListWorkorder extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    Workorder: [],
  };

  columns = [
    {
      title: '工单ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '工单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工单启动时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '服务启动时间',
      dataIndex: 'serverTime',
      key: 'serverTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '工单状态',
      dataIndex: 'state',
      key: 'state',
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
          <Link to={`/workorder/view-workorder/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          {this.initialValue(val)}
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.state == '2') {
      return <Link to={`/workorder/assign-workorder/${val._id}`}>派单</Link>;
    } else {
      return <Link disabled>已派单</Link>;
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
    const params = {
      operatorID: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'workorder/queryWorkorder',
      payload: params,
    }).then(res => {
      this.setState({ Workorder: res.findResult });
    });
    console.log('Workorder:', this.state.Workorder);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      operatorID: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'workorder/queryWorkorder',
      payload: params,
    }).then(res => {
      this.setState({ Workorder: res.findResult });
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
        operatorID: localStorage.getItem('userId'),
      };
      console.log('payload', payload);
      dispatch({
        type: 'workorder/queryWorkorder',
        payload: payload,
      }).then(res => {
        this.setState({ Workorder: res.findResult });
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      item = {},
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="工单名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工单状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择">
                  <Option value="0">结束</Option>
                  <Option value="1">进行中</Option>
                  <Option value="2">待分配</Option>
                  <Option value="3">用户终止</Option>
                  <Option value="4">等待启动</Option>
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
    const { workorder = {}, loading } = this.props;
    const { Workorder } = this.state;
    console.log('Workorder', Workorder);
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
              dataSource={this.queryDate(Workorder)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
            {console.log('categoryList', workorder.data.res)}
          </div>
        </Card>
      </div>
    );
  }
}

export default TableListWorkorder;
