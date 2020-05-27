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

//审核表单
const ExamineForm = Form.create()(props => {
  const {
    examineViewVisible,
    form,
    handleExamineViewOk,
    handleExamineViewCancel,
    Item,
    getItemV,
  } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleExamineViewOk(fieldsValue);
      console.log('fieldsValue', fieldsValue);
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
      {getItemV(Item)}
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
@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['item/fetchAdjust'],
  //model
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    examineViewVisible: false,
    viewVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    queryadjust: [],
    valT: {},
  };

  columns = [
    {
      title: '单品名称',
      dataIndex: 'itemName',
      key: 'itemName',
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
      title: '单品申请审核时间',
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
          <Divider type="vertical" />
          <a onClick={() => this.showViewModal(val)}>查看</a>
          <Modal
            title="单品审核内容"
            visible={this.state.viewVisible}
            onOk={this.handleViewOk}
            onCancel={this.handleViewCancel}
            width={720}
          >
            {this.getItemV(this.state.valT)}
          </Modal>
          {this.getCz(val)}
          <ExamineForm
            examineViewVisible={this.state.examineViewVisible}
            handleExamineViewOk={this.handleExamineViewOk}
            handleExamineViewCancel={this.handleExamineViewCancel}
            Item={this.state.valT}
            getItemV={this.getItemEV}
          />
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      object: 'I',
    };
    dispatch({
      type: 'item/fetchAdjust',
      payload: params,
    }).then(res => {
      console.log('res：', res);
      console.log('queryadjust', this.state.queryadjust);
      if (res.status == '1') {
        res.findResult.map(findResult => {
          const findResultD = {
            itemName: findResult.changedData.itemName,
            auditTime: findResult.auditTime,
            id: findResult.objectId,
            auditStatus: findResult.auditStatus,
            timestamp: findResult.timestamp,
            _id: findResult._id,
            changedData: findResult.changedData,
            //字符转数组
            ImgList: findResult.changedData.imgList.split(','),
          };
          const { queryadjust } = this.state;
          this.setState({ queryadjust: [...queryadjust, findResultD] }, () => {
            console.log('测试');
          });
        });
      } else {
        this.setState({ queryadjust: [] });
      }
      console.log('queryadjust', this.state.queryadjust);
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      object: 'I',
    };
    dispatch({
      type: 'item/fetchAdjust',
      payload: params,
    }).then(res => {
      console.log('res：', res);
      console.log('queryadjust', this.state.queryadjust);
      this.setState({ queryadjust: [] }, () => {
        console.log('handleFormReset');
      });
      if (res.status == '1') {
        res.findResult.map(findResult => {
          const findResultD = {
            itemName: findResult.changedData.itemName,
            auditTime: findResult.auditTime,
            id: findResult.objectId,
            auditStatus: findResult.auditStatus,
            timestamp: findResult.timestamp,
            _id: findResult._id,
            changedData: findResult.changedData,
            ImgList: findResult.changedData.imgList.split(','),
          };
          const { queryadjust } = this.state;
          this.setState({ queryadjust: [...queryadjust, findResultD] }, () => {
            console.log('测试');
          });
        });
      }
      console.log('queryadjust', this.state.queryadjust);
    });
  };

  //查看
  getItemV(Item) {
    if (Item.id != null) {
      return (
        <Descriptions title="服务单品包信息" bordered layout="vertical">
          <Descriptions.Item label="单品包ID">{Item.changedData._id}</Descriptions.Item>
          <Descriptions.Item label="单品包名">{Item.changedData.itemName}</Descriptions.Item>
          <Descriptions.Item label="单品包添加时间">
            {moment(Item.changedData.itemAddTime)
              .subtract(8, 'hours')
              .format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Badge status={statusMap[Item.auditStatus]} text={status[Item.auditStatus]} />
          </Descriptions.Item>
          <Descriptions.Item label="单品包介绍" span={3}>
            {Item.itemIntroduction}
          </Descriptions.Item>
          <Descriptions.Item label="单品包图片" span={3}>
            <span>
              {Item.ImgList &&
                Item.ImgList.map(img => (
                  <div>
                    <img style={{ width: 600 }} key={img} src={OPERATOR_URL + img} alt="img" />
                  </div>
                ))}
            </span>
          </Descriptions.Item>
        </Descriptions>
      );
    } else {
      return <Descriptions title="服务单品包信息" bordered layout="vertical" />;
    }
  }

  getItemEV(Item) {
    if (Item.id != null) {
      return (
        <Descriptions title="服务单品包信息" bordered layout="vertical">
          <Descriptions.Item label="单品包ID">{Item.changedData._id}</Descriptions.Item>
          <Descriptions.Item label="单品包名">{Item.changedData.itemName}</Descriptions.Item>
          <Descriptions.Item label="单品包添加时间">
            {moment(Item.changedData.itemAddTime)
              .subtract(8, 'hours')
              .format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <Badge status={statusMap[Item.auditStatus]} text={status[Item.auditStatus]} />
          </Descriptions.Item>
          <Descriptions.Item label="单品包介绍" span={3}>
            {Item.itemIntroduction}
          </Descriptions.Item>
          <Descriptions.Item label="单品包图片" span={3}>
            <span>
              {Item.ImgList &&
                Item.ImgList.map(img => (
                  <div>
                    <img style={{ width: 600 }} key={img} src={OPERATOR_URL + img} alt="img" />
                  </div>
                ))}
            </span>
          </Descriptions.Item>
        </Descriptions>
      );
    } else {
      return <Descriptions title="服务单品包信息" bordered layout="vertical" />;
    }
  }
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
            <a onClick={() => this.showExamineViewModal(val)}>审核</a>
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
      type: 'item/verifyItem',
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

  //查看审核
  handleViewOk = e => {
    this.setState({
      viewVisible: false,
    });
  };

  showViewModal = (val, e) => {
    console.log(e);
    this.setState({
      valT: val,
      viewVisible: true,
    });
  };

  handleViewCancel = e => {
    console.log(e);
    this.setState({
      viewVisible: false,
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
        object: 'I',
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
        type: 'item/fetchAdjust',
        payload: payload,
      }).then(res => {
        console.log('res：', res);
        console.log('queryadjust', this.state.queryadjust);
        this.setState({ queryadjust: [] });
        if (res.status == '3') {
          this.setState({ queryadjust: [] });
        } else if (res.status == '1') {
          res.findResult.map(findResult => {
            const findResultD = {
              itemName: findResult.changedData.itemName,
              auditTime: findResult.auditTime,
              id: findResult.objectId,
              auditStatus: findResult.auditStatus,
              timestamp: findResult.timestamp,
              _id: findResult._id,
              changedData: findResult.changedData,
              ImgList: findResult.changedData.imgList.split(','),
            };
            const { queryadjust } = this.state;
            this.setState({ queryadjust: [...queryadjust, findResultD] });
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
            <FormItem label="单品包名">
              {getFieldDecorator('itemName')(<Input placeholder="请输入" />)}
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
    const { item = {}, loading } = this.props;
    const { queryadjust } = this.state;
    console.log('categoryListrender', item);
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
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: queryadjust.length, // 数据总数
                pageSize: 6, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
              }}
              dataSource={queryadjust}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
            {/* {console.log('categoryList', category.data.res)} */}
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
