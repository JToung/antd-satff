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
const statusMap = [ 'warning', 'success','error'];
const status = ['未审核', '审核通过','审核未通过' ];

/* eslint react/no-multi-comp:0 */
@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchAdjust'],
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
    queryadjust: [],
  };

  columns = [
    {
      title: '品类ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '品类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
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
      title: '品类申请审核时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: val => (
        <span>
          {/* {moment(val)
            .subtract(8, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')} */}
          {moment(val).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          {console.log('val', val)}
          {this.getCz(val)}
          <Divider type="vertical" />
          <Link to={`/category/e/view-categroy/${val._id}`}>查看</Link>
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      object: 'c',
    };
    dispatch({
      type: 'category/fetchAdjust',
      payload: params,
    }).then(res => {
      console.log('res：', res);
      console.log('queryadjust', this.state.queryadjust);
      res.findResult.map(findResult => {
        const findResultD = {
          categoryName: findResult.changedData.categoryName,
          auditTime: findResult.auditTime,
          id: findResult.objectId,
          auditStatus: findResult.auditStatus,
          timestamp: findResult.timestamp,
          _id: findResult._id,
        };
        const { queryadjust } = this.state;
        this.setState({ queryadjust: [...queryadjust, findResultD] }, () => {
          console.log('测试');
        });
      });
      console.log('queryadjust', this.state.queryadjust);
    });
    console.log('queryadjust', this.state.queryadjust);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      object: 'c',
    };
    dispatch({
      type: 'category/fetchAdjust',
      payload: params,
    }).then(res => {
      console.log('res：', res);
      console.log('queryadjust', this.state.queryadjust);
      this.setState({ queryadjust: [] }, () => {
        console.log('handleFormReset');
      });
      res.findResult.map(findResult => {
        const findResultD = {
          categoryName: findResult.changedData.categoryName,
          auditTime: findResult.auditTime,
          id: findResult.objectId,
          auditStatus: findResult.auditStatus,
          timestamp: findResult.timestamp,
          _id: findResult._id,
        };
        const { queryadjust } = this.state;
        this.setState({ queryadjust: [...queryadjust, findResultD] }, () => {
          console.log('测试');
        });
      });
      console.log('queryadjust', this.state.queryadjust);
    });
  };

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

  getCz(val) {
    console.log(val);
    switch (val.auditStatus) {
      case '0':
        return (
          <span>
            <Divider type="vertical" />
            <Link to={`/category/e/examine-categroy/${val._id}`}>审核</Link>
          </span>
        );
        break;
      default:
        return (
          <span>
            <Divider type="vertical" />
            已审
          </span>
        );
    }
  }

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
        object: 'c',
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
      dispatch({
        type: 'category/fetchAdjust',
        payload: payload,
      }).then(res => {
        console.log('res：', res);
        console.log('queryadjust', this.state.queryadjust);
        this.setState({ queryadjust: [] }, () => {
          console.log('handleSearch');
        });
        if (res.status == '3') {
          this.setState({ queryadjust: [] }, () => {
            console.log('handleSearch2');
          });
        } else {
          res.findResult.map(findResult => {
            const findResultD = {
              categoryName: findResult.changedData.categoryName,
              auditTime: findResult.auditTime,
              id: findResult.objectId,
              auditStatus: findResult.auditStatus,
              timestamp: findResult.timestamp,
              _id: findResult._id,
            };
            const { queryadjust } = this.state;
            this.setState({ queryadjust: [...queryadjust, findResultD] }, () => {
              console.log('handleSearch');
            });
          });
        }
        console.log('handleSearch', this.state.queryadjust);
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
              {getFieldDecorator('auditStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未审核</Option>
                  <Option value="1">审核已通过</Option>
                  <Option value="2">审核未通过</Option>
                </Select>
              )}
              {console.log}
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
    const { queryadjust } = this.state;
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
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              // dataSource={this.queryDate(category)}
              dataSource={queryadjust}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
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
