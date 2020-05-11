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
@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchCategory'],
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
  };

  columns = [
    {
      title: '品类ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '品类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '品类简介',
      dataIndex: 'categoryIntrod',
      key: 'categoryIntrod',
    },
    {
      title: '上架状态',
      dataIndex: 'categoryState',
      key: 'categoryState',
      render(val) {
        // return <Badge status={statusMap[val]} text={status[val]} />;
        return <Badge status={'success'} text={'已上架'} />;
      },
    },
    {
      title: '品类产生时间',
      dataIndex: 'categoryAddTime',
      key: 'categoryAddTime',
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
          <Link to={`/category/editor-categroy/${val._id}`}>审核</Link>
          <Divider type="vertical" />
          <Link to={`/category/view-categroy/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          {/* <Link to={`/category/delete-categroy/${val._id}`}>删除</Link>
          <Divider type="vertical" />
          {this.initialValue(val)} */}
        </Fragment>
      ),
    },
  ];

  initialValue(val){
    if(val.categoryState =="0"){
      return <Link to={`/category/uporoff-categroy/${val._id}`}>上架</Link>
    }else if(val.categoryState =="1"){
      return <Link to={`/category/uporoff-categroy/${val._id}`}>下架</Link>
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      categoryOperator: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'category/fetchCategory',
      payload: params,
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
      categoryOperator: localStorage.getItem('userId'),
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
      type: 'category/fetchCategory',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      categoryOperator: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'category/fetchCategory',
      payload: params,
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
        categoryOperator: localStorage.getItem('userId'),
      };
      dispatch({
        type: 'category/fetchCategory',
        payload: payload,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    // dispatch({
    //   type: 'rule/update',
    //   payload: {
    //     query: formValues,
    //     body: {
    //       name: fields.name,
    //       desc: fields.desc,
    //       key: fields.key,
    //     },
    //   },
    // });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      category = {},
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="品类包名">
              {getFieldDecorator('categoryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('categoryState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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

  queryDate(category) {
    if (category.data != null) {
      return category.data.res;
    } else {
      return category;
    }
  }

  render() {
    const { category = {}, loading } = this.props;
    console.log('categoryListrender', category);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {/* <div className={styles.tableListOperator}>
              <Link to="/category/new-categroy">
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
              dataSource={this.queryDate(category)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            {console.log('categoryList', category.data.res)}
          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </div>
    );
  }
}

export default TableList;
