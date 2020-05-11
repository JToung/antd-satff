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
      title: '单品ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '单品名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '单品简介',
      dataIndex: 'itemIntroduction',
      key: 'itemIntroduction',
    },
    {
      title: '单品状态',
      dataIndex: 'itemState',
      key: 'itemState',
      render(val) {
        // return <Badge status={statusMap[val]} text={status[val]} />;
        return <Badge status={'success'} text={'已上架'} />;
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
      render: val => (
        <Fragment>
          {console.log('val',val)}
          <Link to={`/item/editor-item/${val._id}`}>审核</Link>
          <Divider type="vertical" />
          <Link to={`/item/view-item/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          {/* <Link to={`/item/delete-item/${val._id}`}>删除</Link>
          <Divider type="vertical" />
          {this.initialValue(val)} */}
        </Fragment>
      ),
    },
  ];

  initialValue(val){
    if(val.itemState =="0"){
      return <Link to={`/item/uporoff-item/${val._id}`}>上架</Link>
    }else if(val.itemState =="1"){
      return <Link to={`/item/uporoff-item/${val._id}`}>下架</Link>
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
      type: 'item/fetchItem',
      payload: params,
    }).then( res => {
      console.log('res',res);
      this.setState({ Item : res.findResult})
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      console.log('key', key);
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      operatorID: localStorage.getItem('userId'),
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // dispatch({
    //   type: 'rule/fetch',
    //   payload: params,
    // });
    dispatch({
      type: 'item/fetchItem',
      payload: params,
    }).then( res => {
      this.setState({ Item : res.findResult})
    });
  };

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
      type: 'item/fetchItem',
      payload: params,
    }).then( res => {
      this.setState({ Item : res.findResult})
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
      console.log('payload',payload);
      dispatch({
        type: 'item/fetchItem',
        payload: payload,
      }).then( res => {
        this.setState({ Item : res.findResult})
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
            <FormItem label="审核状态">
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
    if (item.data != null) {
      this.setState()
      return item.data.findResult;
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
            {/* <div className={styles.tableListOperator}>
              <Link to="/item/new-item">
                <Button icon="plus" type="primary">
                  {console.log(this.props.history)}
                  新建
                </Button>
              </Link>

            </div> */}
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={this.queryDate(Item)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            {console.log('categoryList', item.data.res)}
          </div>
        </Card>
      </div>
    );
  }
}

export default TableListItem;
