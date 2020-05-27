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
  Table
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
const statusMap = ['error', 'success'];
const status = ['未上架', '已上架'];

/* eslint react/no-multi-comp:0 */
@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['item'],
  //model
}))
@Form.create()
class TableListItem extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    Item:[],
  };

  columns = [
    {
      title: '单品名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '单品状态',
      dataIndex: 'itemState',
      key: 'itemState',
      width:120,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '单品产生时间',
      dataIndex: 'itemAddTime',
      key: 'itemAddTime',
      render: val => (
        <span>
          {moment(val)
            .subtract(8, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      width:200,
      render: val => (
        <Fragment>
          <Divider type="vertical" />
          <Link to={`/item/v/view-item/${val._id}`}>查看</Link>
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
      type: 'item/queryItemList',
    }).then( res => {
      this.setState({ Item : res})
    });
  }

  
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });

    dispatch({
      type: 'item/queryItemList',
    }).then( res => {
      this.setState({ Item : res})
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

      const payload = {
        ...values,
      };
      console.log('payload',payload);
      dispatch({
        type: 'item/fetchItem',
        payload: payload,
      }).then( res => {
        this.setState({ Item : res})
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
            <FormItem label="单品包名">
              {getFieldDecorator('itemName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="上架状态">
              {getFieldDecorator('itemState')(
                <Select placeholder="请选择">
                  <Option value="0">未上架</Option>
                  <Option value="1">已上架</Option>
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
    if (item != null) {
      this.setState()
      return item;
    } else {
      return item;
    }
  }

  render() {
    const { item = {}, loading } = this.props;
    const { Item } = this.state;
    console.log('Item', Item);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
            </div>
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={this.queryDate(Item)}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: this.queryDate(Item).length, // 数据总数
                pageSize: 6, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
              }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
            {/* {console.log('categoryList', item.data.res)} */}
          </div>
        </Card>
      </div>
    );
  }
}

export default TableListItem;
