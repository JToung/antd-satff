import React, { PureComponent, Fragment } from 'react';
import {
  Upload,
  Select,
  Row,
  Col,
  Form,
  Input,
  Table,
  Tag,
  Descriptions,
  Badge,
  Card,
  Button,
  Divider,
  Tooltip,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import Link from 'umi/link';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { TweenOneGroup } from 'rc-tween-one';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LinkButton from '@/components/link-button';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

const { Column, ColumnGroup } = Table;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['item'],
  //model
}))
@Form.create()
class NewItem extends PureComponent {
  constructor(props) {
    super(props);
    this.interruptColumns = [
      {
        title: '中断最小节点',
        dataIndex: 'stage_from',
        width: '30%',
        editable: true,
      },
      {
        title: '中断最大节点',
        dataIndex: 'stage_end',
        width: '30%',
        editable: true,
      },
      {
        title: '收取的比例',
        dataIndex: 'receivable',
        width: '30%',
        editable: true,
      },
      {
        title: '处理',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.interruptData.length >= 1 ? (
            <Popconfirm title="是否删除?" onConfirm={() => this.handleInterruptDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.partitionColumns = [
      {
        title: '单品分区名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单品分区简介',
        dataIndex: 'introduction',
        key: 'introduction',
      },
      {
        title: '单品分区价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '单品应用场景',
        dataIndex: 'applicable',
        key: 'applicable',
      },
      {
        title: '操作',
        render: (text, record) =>
          this.state.partitions.length >= 1 ? (
            <div>
              {console.log('view', this.state.View)}
              {console.log(record.key)}
              <Link onClick={() => this.showPartitionViewModal(record.key)}>查看</Link>
              <Modal
                title="查看单品分区"
                visible={this.state.addPartitionViewVisible}
                onOk={this.handlePartitionViewOk}
                onCancel={this.handlePartitionViewCancel}
                width={720}
              >
                <Descriptions bordered layout="vertical">
                  <Descriptions.Item label="单品分区名">{this.state.View.name}</Descriptions.Item>
                  <Descriptions.Item label="价格">{this.state.View.price}</Descriptions.Item>
                  <Descriptions.Item label="单品应用场景">
                    {this.state.View.applicable}
                  </Descriptions.Item>
                  <Descriptions.Item label="风格">{this.state.View.style}</Descriptions.Item>
                  <Descriptions.Item label="行业">{this.state.View.industry}</Descriptions.Item>
                  <Descriptions.Item label="类型">{this.state.View.type}</Descriptions.Item>
                  <Descriptions.Item label="单品分区简介" span={3}>
                    {this.state.View.introduction}
                  </Descriptions.Item>
                  <Descriptions.Item label="细节" span={3}>
                    {this.state.View.detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="单品任务" span={3}>
                    <Table
                      bordered
                      dataSource={this.state.View.task}
                      columns={this.taskInstanceV}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </Modal>
              <Divider type="vertical" />
              <Link onClick={() => this.showPartitionEditorModal(record.key)}>编辑</Link>
              <Modal
                title="编辑单品分区"
                visible={this.state.addPartitionEditorVisible}
                onOk={this.handlePartitionEditorOk}
                onCancel={this.handlePartitionEditorCancel}
                width={720}
              >
                <Form layout="vertical">
                  <Card bordered={false}>
                    <Row gutter={16}>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="单品分区名">
                          {this.props.form.getFieldDecorator('name', {
                            initialValue: this.state.Editor.name,
                            rules: [{ required: true, message: '请输入单品分区名' }],
                          })(<Input placeholder="请输入单品分区名" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="单品分区价格">
                          {this.props.form.getFieldDecorator('price', {
                            initialValue: this.state.Editor.price,
                            rules: [{ required: true, message: '请输入单品分区价格' }],
                          })(<Input placeholder="请输入单品分区价格" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="单品应用场景">
                          {this.props.form.getFieldDecorator('applicable', {
                            initialValue: this.state.Editor.applicable,
                            rules: [{ required: true, message: '请输入单品应用场景' }],
                          })(<Input placeholder="请输入单品应用场景" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="单品风格">
                          {this.props.form.getFieldDecorator('style', {
                            initialValue: this.state.Editor.style,
                            rules: [{ required: true, message: '请输入单品风格' }],
                          })(<Input placeholder="请输入单品风格" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="行业">
                          {this.props.form.getFieldDecorator('industry', {
                            initialValue: this.state.Editor.industry,
                            rules: [{ required: true, message: '请输入行业' }],
                          })(<Input placeholder="请输入行业" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12} md={12} sm={24}>
                        <Form.Item label="单品类型">
                          {this.props.form.getFieldDecorator('type', {
                            initialValue: this.state.Editor.type,
                            rules: [{ required: true, message: '请输入单品类型' }],
                          })(<Input placeholder="请输入单品类型" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col lg={24} md={12} sm={24}>
                        <Form.Item label="单品分区简介">
                          {this.props.form.getFieldDecorator('introduction', {
                            initialValue: this.state.Editor.introduction,
                            rules: [
                              {
                                required: true,
                                message: '请输入单品分区简介',
                              },
                            ],
                          })(
                            <Input.TextArea
                              style={{ minHeight: 32 }}
                              placeholder="请输入单品分区简介"
                              rows={4}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col lg={24} md={12} sm={24}>
                        <Form.Item label="单品分区细节">
                          {this.props.form.getFieldDecorator('detail', {
                            initialValue: this.state.Editor.detail,
                            rules: [
                              {
                                required: true,
                                message: '请输入单品分区细节',
                              },
                            ],
                          })(
                            <Input.TextArea
                              style={{ minHeight: 32 }}
                              placeholder="请输入单品分区细节"
                              rows={4}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  <Card bordered={false} title="必要任务">
                    {this.task(this.state.Editor.task)}
                  </Card>
                </Form>
              </Modal>
              <Divider type="vertical" />
              <Popconfirm
                title="是否删除?"
                onConfirm={() => this.handlePartitionDelete(record.key)}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          ) : null,
      },
    ];

    this.taskInstanceV = [
      {
        title: '任务名',
        dataIndex: 'name',
      },
      {
        title: '任务内容',
        dataIndex: 'introduction',
      },
      {
        title: '执行条件',
        dataIndex: 'conditions',
      },
      {
        title: '最长执行任务时间',
        dataIndex: 'maxCompletionTime',
      },
      {
        title: '任务通过条件',
        dataIndex: 'passageConditions',
      },
    ];

    this.taskInstance = [
      {
        title: '任务名',
        dataIndex: 'name',
        width: '20%',
        editable: true,
      },
      {
        title: '任务内容',
        dataIndex: 'introduction',
        width: '20%',
        editable: true,
      },
      {
        title: '执行条件',
        dataIndex: 'conditions',
        width: '20%',
        editable: true,
      },
      {
        title: '最长执行任务时间',
        dataIndex: 'maxCompletionTime',
        width: '20%',
        editable: true,
      },
      {
        title: '任务通过条件',
        dataIndex: 'passageConditions',
        width: '20%',
        editable: true,
      },
      {
        title: '处理',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.task.length >= 1 ? (
            <Popconfirm title="是否删除?" onConfirm={() => this.handleTaskDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      //单品中断处理表状态
      interruptData: [],
      stage: [],
      interruptCount: 0,
      //分区汇总
      partitions: [],
      partitionCount: 0,
      addPartitionVisible: false,
      addPartitionEditorVisible: false,
      addPartitionViewVisible: false,
      keyEditor: 0,
      keyView: 0,
      Editor: {},
      View: {},
      i: 0,
      di: 0,
      ei: 0,
      //选择品类后的品类
      categorySelect: {},
      //单个单品分区任务表汇总
      task: [],
      taskCount: 0,
      //品类汇总
      categorys: [],
      //已选择品类id
      categorysId: '',
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
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
    const payload = {
      categoryOperator: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'category/fetchCategory',
      payload,
    }).then(res => {
      const categorys = res.res;
      this.setState({ categorys });
    });
    console.log('categorys', this.state.categorys);
  }

  //获取选择品类ID
  getCategoryId = e => {
    this.props.form.validateFields((err, values) => {
      const categorysId = values.categoryID;
      this.setState({ categorysId });
    });
  };
  //品类
  selectCategory = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log('categorys2', this.state.categorys);
    return (
      <div>
        {getFieldDecorator('categoryID', {
          rules: [{ required: true, message: '必须输入品类包!' }],
        })(
          <Select placeholder="请选择品类包">
            {this.state.categorys.map(c => (
              <Option value={c._id} key={c._id}>
                {c.categoryName}
              </Option>
            ))}
          </Select>
        )}
      </div>
    );
  };

  //单品中断处理
  handleInterruptDelete = key => {
    const interruptData = [...this.state.interruptData];
    this.setState({ interruptData: interruptData.filter(item => item.key !== key) });
  };

  handleInterruptAdd = () => {
    const { interruptCount, interruptData } = this.state;
    const newData = {
      key: interruptCount,
      stage_from: `请填写中断最小节点`,
      stage_end: `请填写中断最大节点`,
      receivable: 0.1,
    };
    this.setState({
      interruptData: [...interruptData, newData],
      interruptCount: interruptCount + 1,
    });
  };

  handleInterruptSave = row => {
    const newData = [...this.state.interruptData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ interruptData: newData });
  };

  interrupt = () => {
    const { interruptData } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const interruptColumns = this.interruptColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleInterruptSave,
        }),
      };
    });
    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.handleInterruptAdd}
        >
          添加单品中断处理
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={interruptData}
          columns={interruptColumns}
        />
      </div>
    );
  };

  //必要任务要求
  handleTaskDelete = key => {
    const task = [...this.state.task];
    this.setState({ task: task.filter(item => item.key !== key) });
  };

  handleTaskAdd = () => {
    const { taskCount, task } = this.state;
    const newData = {
      key: taskCount,
      name: `请填写任务名`,
      introduction: `请填写任务内容`,
      conditions: `请填写任务执行条件`,
      maxCompletionTime: 72,
      passageConditions: `请填写任务通过条件`,
      order: taskCount,
    };
    this.setState({
      task: [...task, newData],
      taskCount: taskCount + 1,
    });
  };

  handleTaskSave = row => {
    const newData = [...this.state.task];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ task: newData });
  };

  task = task1 => {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const taskInstance = this.taskInstance.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleTaskSave,
        }),
      };
    });
    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.handleTaskAdd}
        >
          添加分区必要任务
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={task1}
          columns={taskInstance}
        />
      </div>
    );
  };

  //单品分区处理

  handlePartitionDelete = key => {
    const partitions = [...this.state.partitions];
    const partitionCount = this.state.partitionCount - 1;
    this.setState({
      partitions: partitions.filter(item => item.key !== key),
      partitionCount: partitionCount,
    });
  };

  handlePartitionViewOk = e => {
    console.log(e);
    this.setState({
      addPartitionViewVisible: false,
    });
  };

  showPartitionViewModal = keyView => {
    const View = this.state.partitions[keyView];
    this.setState({ keyView: keyView, View: View });
    console.log('keyEditor', keyView);
    this.setState({
      addPartitionViewVisible: true,
    });
  };

  handlePartitionViewCancel = e => {
    console.log(e);
    this.setState({
      addPartitionViewVisible: false,
    });
  };

  handlePartitionEditorOk = e => {
    const partitions = [...this.state.partitions];
    this.props.form.validateFields((err, values) => {
      const newData = {
        key: this.state.keyEditor,
        name: values.name,
        introduction: values.introduction,
        price: parseInt(values.price),
        applicable: values.applicable,
        detail: values.detail,
        type: values.type,
        style: values.style,
        industry: values.industry,
        task: this.state.task,
      };
      console.log('newdata0', newData);
      partitions[this.state.keyEditor] = newData;
      this.setState({ partitions: partitions });
    });
    this.setState({
      task: [],
    });
    console.log(e);
    this.setState({
      addPartitionEditorVisible: false,
    });
  };

  showPartitionEditorModal = keyEditor => {
    const Editor = this.state.partitions[keyEditor];
    this.setState({ keyEditor: keyEditor, Editor: Editor });
    console.log('keyEditor', keyEditor);
    this.getCategoryId();
    const { dispatch, match } = this.props;
    const { params } = match;

    const payload = {
      _id: this.state.categorysId,
    };
    dispatch({
      type: 'category/fetchCategory',
      payload,
    }).then(res => {
      const categorySelect = res.res;
      this.setState({ categorySelect });
      console.log('categorySelect', categorySelect);
    });

    console.log('getCategoryId', this.state.categorysId);
    this.setState({
      addPartitionEditorVisible: true,
    });
  };

  handlePartitionEditorCancel = e => {
    console.log(e);
    this.setState({
      addPartitionEditorVisible: false,
    });
  };

  showPartitionModal = () => {
    this.getCategoryId();
    const { dispatch, match } = this.props;
    const { params } = match;

    const payload = {
      _id: this.state.categorysId,
    };
    dispatch({
      type: 'category/fetchCategory',
      payload,
    }).then(res => {
      const categorySelect = res.res;
      this.setState({ categorySelect });
      console.log('categorySelect', categorySelect);
    });

    console.log('getCategoryId', this.state.categorysId);
    this.setState({
      addPartitionVisible: true,
    });
  };

  handlePartitionOk = e => {
    const { partitionCount, partitions } = this.state;
    this.props.form.validateFields((err, values) => {
      const newData = {
        key: partitionCount,
        name: values.name,
        introduction: values.introduction,
        price: parseInt(values.price),
        applicable: values.applicable,
        detail: values.detail,
        type: values.type,
        style: values.style,
        industry: values.industry,
        task: this.state.task,
      };
      console.log('newdata0', newData);
      this.setState({
        partitions: [...partitions, newData],
        partitionCount: partitionCount + 1,
      });
    });
    this.setState({
      task: [],
    });
    console.log(e);
    this.setState({
      addPartitionVisible: false,
    });
  };

  handlePartitionCancel = e => {
    console.log(e);
    this.setState({
      addPartitionVisible: false,
    });
  };
  partition = () => {
    const { partitions, addPartitionVisible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          icon="plus"
          onClick={this.showPartitionModal}
        >
          添加单品分区
        </Button>
        <Modal
          title="新建单品分区"
          visible={this.state.addPartitionVisible}
          onOk={this.handlePartitionOk}
          onCancel={this.handlePartitionCancel}
          width={720}
        >
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品分区名">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入单品分区名' }],
                    })(<Input placeholder="请输入单品分区名" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品分区价格">
                    {getFieldDecorator('price', {
                      rules: [{ required: true, message: '请输入单品分区价格' }],
                    })(<Input placeholder="请输入单品分区价格" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品应用场景">
                    {getFieldDecorator('applicable', {
                      rules: [{ required: true, message: '请输入单品应用场景' }],
                    })(<Input placeholder="请输入单品应用场景" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品风格">
                    {getFieldDecorator('style', {
                      rules: [{ required: true, message: '请输入单品风格' }],
                    })(<Input placeholder="请输入单品风格" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="行业">
                    {getFieldDecorator('industry', {
                      rules: [{ required: true, message: '请输入行业' }],
                    })(<Input placeholder="请输入行业" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品类型">
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: '请输入单品类型' }],
                    })(<Input placeholder="请输入单品类型" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="单品分区简介">
                    {getFieldDecorator('introduction', {
                      rules: [
                        {
                          required: true,
                          message: '请输入单品分区简介',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入单品分区简介"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="单品分区细节">
                    {getFieldDecorator('detail', {
                      rules: [
                        {
                          required: true,
                          message: '请输入单品分区细节',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入单品分区细节"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card bordered={false} title="必要任务">
              {this.task(this.state.task)}
            </Card>
          </Form>
        </Modal>
        <Table bordered dataSource={partitions} columns={this.partitionColumns} />
      </div>
    );
  };
  handleSubmit = e => {
    const { dispatch, match } = this.props;
    const { params } = match;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const payload = {
        ...values,
        itemAddTime: new Date(),
        operatorID: localStorage.getItem('userId'),
        itemState: '0',
        itemExamineTF: '0',
      };

      console.log('values', values);
      if (err) {
        console.log('err' + err);
        return;
      }
      // if (!err) {
      //   console.log('receive the value of input ' + values);
      // }
      console.log('参数', payload);

      dispatch({
        type: 'item/addItem',
        payload,
      }).then(res => {
        console.log('res', res);
        if (res != null) {
          this.state.interruptData.map(interrupt => {
            const interruptD = {
              ...interrupt,
              itemId: res.ensure._id,
            };
            console.log('itemId: ',res.ensure._id)
            console.log('interruptD', interruptD);
            dispatch({
              type: 'item/addInterrupt',
              payload: interruptD,
            });
          });
          this.state.partitions.map(partition => {
            const partitionsD = {
              name: partition.name,
              introduction: partition.introduction,
              price: partition.price,
              applicable: partition.applicable,
              detail: partition.detail,
              type: partition.type,
              style: partition.style,
              industry: partition.industry,
              itemID: res.ensure._id,
            };
            console.log('itemId: ',res.ensure._id)
            console.log('partitionsD', partitionsD);
            dispatch({
              type: 'item/addPartition',
              payload: partitionsD,
            }).then(res => {
              partition.task.map(task => {
                const taskD = {
                  name: task.name,
                  introduction: task.introduction,
                  conditions: task.conditions,
                  maxCompletionTime: task.maxCompletionTime,
                  passageConditions: task.passageConditions,
                  partitionId: res.partitionInstance._id,
                  order: task.order,
                };
                console.log('partitionId: ',res.partitionInstance._id)
                console.log('taskD', taskD);
                dispatch({
                  type: 'item/addTask',
                  payload: taskD,
                });
              });
            });
          });
          message.success('添加成功！');
          this.props.history.push('/item/list');
        } else {
          message.error('添加失败，请重试!');
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { interruptData } = this.state;

    console.log('interruptData: ', interruptData);
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.item.basic.title" />}>
        <Card bordered={false} title="新建单品包">
          {/* <Form layout="vertical" onSubmit={this.handleSubmit}> */}
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="单品包名">
                    {getFieldDecorator('itemName', {
                      rules: [{ required: true, message: '请输入单品包名' }],
                    })(<Input placeholder="请输入单品包名" />)}
                  </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label="所属品类包">{this.selectCategory()}</Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="单品包介绍">
                    {getFieldDecorator('itemIntroduction', {
                      rules: [
                        {
                          required: true,
                          message: '请输入单品包介绍',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入单品包介绍"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card bordered={false} title="单品分区">
              {this.partition()}
            </Card>
            <Card bordered={false} title="单品中断处理">
              {this.interrupt()}
            </Card>
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.ButtonRight}
                      onClick={this.handleSubmit}
                    >
                      确认添加
                    </Button>
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.ButtonLeft}
                      onClick={() => {
                        this.props.history.push('/item/list');
                      }}
                    >
                      返回首页
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default NewItem;
