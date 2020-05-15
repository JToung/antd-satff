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
import { FormattedMessage } from 'umi-plugin-react/locale';

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
class TableListAssign extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    //合适专才列表
    candidates: [],
  };

  columns = [
    {
      title: '专才ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '专才名称',
      dataIndex: 'servicerName',
      key: 'servicerName',
    },
    {
      title: '专才电话',
      dataIndex: 'servicerPhone',
      key: 'servicerPhone',
    },
    {
      title: '专才邮箱',
      dataIndex: 'servicerEmail',
      key: 'servicerEmail',
    },
    {
      title: '专才入驻时间',
      dataIndex: 'servicerRegistrationDate',
      key: 'servicerRegistrationDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Button onClick={()=>this.assignPost(val._id)}>派单</Button>
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
    const params = {
      id: this.props.match.params._id,
    };
    dispatch({
      type: 'workorder/queryAssign',
      payload: params,
    }).then(res => {
      this.setState({ candidates: res.result.candidates });
    });
    console.log('candidates:', this.state.candidates);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      id: this.props.match.params._id,
    };
    dispatch({
      type: 'workorder/queryAssign',
      payload: params,
    }).then(res => {
      this.setState({ candidates: res.result.candidates });
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

  queryDate(item) {
    if (item.data != null) {
      return item.data.findResult;
    } else {
      return item;
    }
  }

  //派单
  assignPost = servicerId => {
    const { dispatch } = this.props;
    const params = {
      workorderId: this.props.match.params._id,
      servicerId: servicerId,
    };
    dispatch({
      type: 'workorder/assignPost',
      payload: params,
    }).then(res => {
      if (res.status == '1') {
        message.success(res.information);
        this.props.history.push('/workorder/list');
      } else {
        message.success(res.information);
      }
    });
  };

  render() {
    const { workorder = {}, loading } = this.props;
    const { candidates } = this.state;
    console.log('Workorder', candidates);
    console.log('loading', loading);
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.workorder.assign.title" />}>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={this.queryDate(candidates)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableListAssign;
