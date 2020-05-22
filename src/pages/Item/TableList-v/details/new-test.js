import React, { PureComponent } from 'react';
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
  Tooltip,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { TweenOneGroup } from 'rc-tween-one';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LinkButton from '@/components/link-button';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;

@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category'],
  //model
}))
@Form.create()
class New extends PureComponent {
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
    // const { dispatch } = this.props;

    // dispatch({
    //   type: 'category/fetchOperator',
    //   payload: params.id || '5e6465051c4635383c381f5e',
    // });

    // console.log('this.props.data',this.props.data);
  }

  state = {
    // tags: [],
    interruptRequest: [],
    stage: [],
    //interruptRequest
    editorData: [],
    inputVisible: false,
    inputValue: '',
    newVisible: false,
    editorVisible: false,
    deleteVisible: false,
  };

  handleClose = removedTag => {
    const stage = this.state.stage.filter(tag => tag !== removedTag);
    console.log(stage);
    this.setState({ stage });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { stage } = this.state;
    if (inputValue && stage.indexOf(inputValue) === -1) {
      stage = [...stage, inputValue];
    }
    console.log(stage);
    this.setState({
      stage,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  setNewVisible = newVisible => {
    this.setState({
      newVisible,
    });
  };
  setEditorVisible = editorVisible => {
    this.setState({
      editorVisible,
    });
  };
  setDeleteVisible = deleteVisible => {
    this.setState({
      deleteVisible,
    });
  };

  handleNewOk = e => {
    //新建任务成功，这里写入任务表！
    console.log(e);
    this.setNewVisible(false);
  };

  handleNewCancel = e => {
    console.log(e);
    this.setNewVisible(false);
  };

  handleEditorOk = e => {
    console.log(e);
    this.setEditorVisible(false);
  };

  handleEditorCancel = e => {
    console.log(e);
    this.setEditorVisible(false);
  };

  handleDeleteOk = e => {
    console.log(e);
    this.setDeleteVisible(false);
  };

  handleDeleteCancel = e => {
    console.log(e);
    this.setDeleteVisible(false);
  };
  onOperatorState(operatorState) {
    if (operatorState == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  render() {
    const {
      operator = {},
      loading,
      editorData,
      form: { getFieldDecorator },
    } = this.props;
    const { stage, interruptRequest, inputVisible, inputValue } = this.state;
    const tagChild = stage.map(this.forMap);
    const columns = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: '_id',
      },
      {
        title: '任务进行的阶段',
        key: 'stage',
        dataIndex: 'stage',
        render: stage => (
          <span>
            {stage.map(tag => {
              return (
                <Tag color="geekblue" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: '收取的比例',
        dataIndex: 'receivable',
        key: 'receivable',
      },
      {
        title: '操作',
        key: 'action',
        render: interruptRequest => (
          <span>
            <LinkButton
              onClick={() => {
                this.editorData = interruptRequest; // 保存当前任务要求, 其它地方都可以读取到
                // this.setState({ showStatus: 2})
                this.setEditorVisible(true);
              }}
            >
              修改
            </LinkButton>
            <Modal
              title="任务中断要求修改"
              visible={this.state.editorVisible}
              onOk={this.handleEditorOk}
              onCancel={this.handleEditorCancel}
            >
              <Form layout="vertical">
                <Form.Item label="收取的比例">
                  {getFieldDecorator('receivable', {
                    rules: [{ required: true, message: '请输入收取的比例' }],
                  })(<Input placeholder="请输入收取的比例" />)}
                </Form.Item>
                <Form.Item label="任务进行的阶段">
                  
                </Form.Item>
              </Form>
            </Modal>
            <LinkButton
              onClick={() => {
                // this.deleteCategorys(category);
                this.setDeleteVisible(true);
              }}
            >
              删除
            </LinkButton>
            <Modal
              title="任务中断要求删除"
              visible={this.state.deleteVisible}
              onOk={this.handleDeleteOk}
              onCancel={this.handleDeleteCancel}
            >
              <p>是否确认删除</p>
            </Modal>
          </span>
        ),
      },
    ];
    // console.log('operator.date',operator);
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
        <Card bordered={false} title="新建品类包">
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="品类包名">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入品类包名' }],
                    })(<Input placeholder="请输入品类包名" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={10} md={12} sm={24}>
                  <Form.Item label="类别标签">
                    {getFieldDecorator('label', {
                      rules: [{ required: true, message: '请选择类别标签' }],
                    })(
                      <Select placeholder="请选择类别标签">
                        <Option value="0">设计</Option>
                        <Option value="1">类别二</Option>
                        <Option value="3">类别三</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="品类包介绍">
                    {getFieldDecorator('introduction', {
                      rules: [
                        {
                          required: true,
                          message: '请输入品类包介绍',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入品类包介绍"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card bordered={false} title="品类规范（用于品类下级单品规范）">
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="规范必要说明">
                    {getFieldDecorator('explanation', {
                      rules: [
                        {
                          required: true,
                          message: '请输入规范必要说明',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入规范必要说明"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="名称最小字数">
                    {getFieldDecorator('minName', {
                      rules: [{ required: true, message: '请输入名称最小字数' }],
                    })(<Input placeholder="请输入名称最小字数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="简介最小字数">
                    {getFieldDecorator('minIntroduction', {
                      rules: [{ required: true, message: '请输入简介最小字数' }],
                    })(<Input placeholder="请输入简介最小字数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="详情最小字数">
                    {getFieldDecorator('minContent', {
                      rules: [{ required: true, message: '请输入详情最小字数' }],
                    })(<Input placeholder="请输入详情最小字数" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="名称最大字数">
                    {getFieldDecorator('maxName', {
                      rules: [{ required: true, message: '请输入名称最大字数' }],
                    })(<Input placeholder="请输入名称最大字数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="简介最大字数">
                    {getFieldDecorator('maxIntroduction', {
                      rules: [{ required: true, message: '请输入简介最大字数' }],
                    })(<Input placeholder="请输入简介最大字数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="详情最大字数">
                    {getFieldDecorator('maxContent', {
                      rules: [{ required: true, message: '请输入详情最大字数' }],
                    })(<Input placeholder="请输入详情最大字数" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="最少分区数">
                    {getFieldDecorator('minPartition', {
                      rules: [{ required: true, message: '请输入最少分区数' }],
                    })(<Input placeholder="请输入最少分区数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="最少任务数">
                    {getFieldDecorator('minTasks', {
                      rules: [{ required: true, message: '请输入最少任务数' }],
                    })(<Input placeholder="请输入最少任务数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="最小评分（若未达标，给予惩罚）">
                    {getFieldDecorator('minScore', {
                      rules: [{ required: true, message: '请输入最小评分' }],
                    })(<Input placeholder="请输入最小评分" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="最大分区数">
                    {getFieldDecorator('maxPartition', {
                      rules: [{ required: true, message: '请输入最大分区数' }],
                    })(<Input placeholder="请输入最大分区数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="最大任务数">
                    {getFieldDecorator('maxTasks', {
                      rules: [{ required: true, message: '请输入最大任务数' }],
                    })(<Input placeholder="请输入最大任务数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="任务最长时间">
                    {getFieldDecorator('maxTaskTime', {
                      rules: [{ required: true, message: '请输入任务最长时间' }],
                    })(<Input placeholder="请输入任务最长时间" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={10} md={12} sm={24}>
                  <Form.Item label="最大分区数">
                    {getFieldDecorator('maxPartition', {
                      rules: [{ required: true, message: '请输入最大分区数' }],
                    })(<Input placeholder="请输入最大分区数" />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="最大任务数">
                    {getFieldDecorator('maxTasks', {
                      rules: [{ required: true, message: '请输入最大任务数' }],
                    })(<Input placeholder="请输入最大任务数" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Card bordered={false} title="任务中断要求">
                    <Button
                      type="dashed"
                      style={{ width: '100%', marginBottom: 8 }}
                      icon="plus"
                      onClick={() => this.setNewVisible(true)}
                      // ref={component => {
                      //   /* eslint-disable */
                      //   this.addBtn = findDOMNode(component);
                      //   /* eslint-enable */
                      // }}
                    >
                      添加
                    </Button>
                    <Modal
                      title="新建任务中断要求"
                      visible={this.state.newVisible}
                      onOk={this.handleNewOk}
                      onCancel={this.handleNewCancel}
                    >
                      <Form layout="vertical">
                        <Form.Item label="收取的比例">
                          {getFieldDecorator('receivable', {
                            rules: [{ required: true, message: '请输入收取的比例' }],
                          })(<Input placeholder="请输入收取的比例" />)}
                        </Form.Item>
                        <Form.Item label="任务进行的阶段">
                          <div>
                            <div style={{ marginBottom: 16 }}>
                              <TweenOneGroup
                                enter={{
                                  scale: 0.8,
                                  opacity: 0,
                                  type: 'from',
                                  duration: 100,
                                  onComplete: e => {
                                    e.target.style = '';
                                  },
                                }}
                                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                appear={false}
                              >
                                {tagChild}
                              </TweenOneGroup>
                            </div>
                            {inputVisible && (
                              <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                              />
                            )}
                            {!inputVisible && (
                              <Tag onClick={this.showInput} className="site-tag-plus">
                                <PlusOutlined /> 新建
                              </Tag>
                            )}
                          </div>
                          {/* {data.stage.map((tag, index) => {
                            const isLongTag = tag.length > 20;
                            const tagElem = (
                              <Tag
                                key={tag}
                                closable={index !== 0}
                                onClose={() => this.handleClose(tag)}
                              >
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                              </Tag>
                            );
                            return isLongTag ? (
                              <Tooltip title={tag} key={tag}>
                                {tagElem}
                              </Tooltip>
                            ) : (
                              tagElem
                            );
                          })}
                          {inputVisible && (
                            <Input
                              ref={this.saveInputRef}
                              type="text"
                              size="small"
                              style={{ width: 78 }}
                              value={inputValue}
                              onChange={this.handleInputChange}
                              onBlur={this.handleInputConfirm}
                              onPressEnter={this.handleInputConfirm}
                            />
                          )}
                          {!inputVisible && (
                            <Tag className="site-tag-plus" onClick={this.showInput}>
                              <PlusOutlined /> 添加
                            </Tag>
                          )} */}
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Table
                      rowKey="ID"
                      className="Table1"
                      columns={columns}
                      dataSource={interruptRequest}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
            <Card bordered={false}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  this.props.history.push('/category/list');
                }}
                className={styles.ButtonCenter}
              >
                添加
              </Button>
            </Card>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default New;
