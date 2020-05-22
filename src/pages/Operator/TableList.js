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
import { IdCodeValid } from '@/utils/utils';

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
const statusMap = ['error', 'success'];
const status = ['未运行', '正在运行'];

/*
  返回新建运营商model
*/
const NewForm = Form.create()(props => {
  const { newViewVisible, form, handleNewViewOk, handleNewViewCancel } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err,fieldsValue) => {
      if (err) return;
      handleNewViewOk(fieldsValue);
      console.log('fieldsValue', fieldsValue);
    });
  };

  return (
    <Modal
      title="填写新建运营商内容"
      visible={newViewVisible}
      onOk={okHandle}
      onCancel={handleNewViewCancel}
      width={720}
    >
      <Form layout="vertical">
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="运营商名">
                {getFieldDecorator('operatorName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入运营商名',
                    },
                    { max: 100, message: '名称过长！' },
                  ],
                })(<Input placeholder="请输入运营商名" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="运营商法人">
                {getFieldDecorator('legalPerson', {
                  rules: [{ required: true, message: '请输入运营商法人名' }],
                })(<Input placeholder="请输入运营商法人名" />)}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="法人身份证信息">
                {getFieldDecorator('legalPersonIdNo', {
                  rules: [
                    { required: true, message: '请输入法人身份证信息' },
                    {
                      validator: IdCodeValid,
                    },
                  ],
                })(<Input placeholder="请输入法人身份证信息" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="法人联系方式">
                {getFieldDecorator('legalPersonPhone', {
                  rules: [
                    { required: true, message: '请输入法人联系方式' },
                    {
                      pattern: /(^[1]([3-9])[0-9]{9}$)|(^\d{3}-\d{8}|\d{4}-\d{7})/,
                      message: '请输入正确的法人联系方式',
                    },
                  ],
                })(<Input placeholder="请输入法人联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label="法人邮箱">
                {getFieldDecorator('legalPersonEmail', {
                  rules: [
                    { required: true, message: '请输入法人邮箱' },
                    {
                      pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                      message: '请输入正确的法人邮箱',
                    },
                  ],
                })(<Input placeholder="请输入法人邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="初始密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入初始密码' }],
                })(<Input.Password placeholder="请输入初始密码" />)}
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
    newViewVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    operator: [],
  };

  columns = [
    {
      title: '运营商ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '运营商名称',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '运营商加入时间',
      dataIndex: 'operatorAddTime',
      key: 'operatorAddTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '运营商法人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
    },
    {
      title: '运营商状态',
      dataIndex: 'operatorState',
      key: 'operatorState',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link to={`/operator/center/view-operator/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          {this.initialValue(val)}
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.state == '2') {
      return <Link to={`/workorder/assign-workorder/${val._id}`}>审核</Link>;
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
    dispatch({
      type: 'operator/fetchOperator',
    }).then(res => {
      console.log(res);
      this.setState({ operator: res.foundData });
    });
    console.log('operator:', this.state.operator);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'operator/fetchOperator',
    }).then(res => {
      this.setState({ operator: res.foundData });
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
        type: 'operator/fetchOperator',
        payload: payload,
      }).then(res => {
        if(res.status != '0'){
          this.setState({ operator: res.foundData });
        }
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
            <FormItem label="运营商名">
              {getFieldDecorator('operatorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运营商状态">
              {getFieldDecorator('operatorState')(
                <Select placeholder="请选择">
                  <Option value="0">未运行</Option>
                  <Option value="1">正在运行</Option>
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
              <Button
                onClick={() => this.showNewViewModal()}
                icon="plus"
                type="danger"
                style={{ marginLeft: 8 }}
              >
                新建
              </Button>
              <NewForm
                newViewVisible={this.state.newViewVisible}
                handleNewViewOk={this.handleNewViewOk}
                handleNewViewCancel={this.handleNewViewCancel}
              />
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //新建运营商
  handleNewViewOk = (values, e) => {
    const { dispatch } = this.props;
    console.log(e);
    const payload = {
      ...values,
      operatorAddTime: new Date().getTime(),
      account: values.legalPersonEmail,
      operatorState: "0",
    };

    console.log('values', payload);
    if (e) {
      console.log('err' + e);
      return;
    }
    // if (!err) {
    //   console.log('receive the value of input ' + values);
    // }
    console.log('参数', payload);

    dispatch({
      type: 'operator/addOperator',
      payload,
    }).then(res => {
      console.log('res', res);
      if (res != null) {
        message.success('添加运营商成功！');
        location.reload(true);
      } else {
        message.error('添加失败，请重试!');
      }
    });

    this.setState({
      newViewVisible: false,
    });
  };

  showNewViewModal = e => {
    console.log(e);
    this.setState({
      newViewVisible: true,
    });
  };

  handleNewViewCancel = e => {
    console.log(e);
    this.setState({
      newViewVisible: false,
    });
  };

  queryDate(item) {
    if (item != null) {
      this.setState();
      return item;
    } else {
      return item;
    }
  }

  render() {
    const { loading } = this.props;
    const { operator } = this.state;
    console.log('Workorder', operator);
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
              dataSource={this.queryDate(operator)}
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
