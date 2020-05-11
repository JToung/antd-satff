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
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LinkButton from '@/components/link-button';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;

const data = [
  {
    key: '1',
    ID: '1',
    receivable: '0.1',
    stage: ['1', '2'],
  },
  {
    key: '2',
    ID: '2',
    receivable: '0.5',
    stage: ['3'],
  },
  {
    key: '3',
    ID: '3',
    receivable: '0.8',
    stage: ['4', '5', '6', '7', '8'],
  },
];

@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
@Form.create()
class Editor extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    // const { dispatch } = this.props;

    dispatch({
      type: 'operator/fetchOperator',
      payload: params.id || '5e6465051c4635383c381f5e',
    });

    // console.log('this.props.data',this.props.data);
  }

  state = {
    tags: [],
    editorData:[],
    inputVisible: false,
    inputValue: '',
    newVisible: false,
    editorVisible: false,
    deleteVisible: false,
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = tags => {
    const { inputValue } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

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
    const { tags, inputVisible, inputValue } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
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
        render: (data) => (
          <span>
            <LinkButton
              onClick={() => {
                this.editorData = data // 保存当前分类, 其它地方都可以读取到
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
                <Form.Item label="ID">
                  <span className="ant-form-text">{operator.data._id}</span>
                </Form.Item>
                <Form.Item label="收取的比例">
                  {getFieldDecorator('receivable', {
                    rules: [{ required: true, message: '请输入收取的比例' }],
                  })(<Input placeholder="1" />)}
                </Form.Item>
                <Form.Item label="任务进行的阶段">
                  {console.log(data['stage'])}
                  {data['stage'].map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable={index !== 0} onClose={() => this.handleClose(tag)}>
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
                      onBlur={this.handleInputConfirm(data.stage)}
                      onPressEnter={this.handleInputConfirm(data.stage)}
                    />
                  )}
                  {!inputVisible && (
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                      <PlusOutlined /> New Tag
                    </Tag>
                  )}
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
        <Card bordered={false} title="品类标识基础信息修改">
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label="品类标识ID">
                    <span className="ant-form-text">{operator.data._id}</span>
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="品类标识名">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入品类标识名' }],
                    })(<Input placeholder={operator.data.operatorName} />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label="品类标识上架状态">
                    <span className="ant-form-text">上架</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="品类标识上架时间">
                    <span className="ant-form-text">{operator.data.operatorAddTime}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="品类标识介绍">
                    {getFieldDecorator('introduction', {
                      rules: [
                        {
                          required: true,
                          message: '请输入品类标识介绍',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder={operator.data.operatorIntroduction}
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="品类标识详情">
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: true,
                          message: '请输入品类标识详情',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder={operator.data.operatorIntroduction}
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="修改理由">
                    {getFieldDecorator('reason', {
                      rules: [
                        {
                          required: true,
                          message: '请输入品类标识修改理由',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder={operator.data.operatorIntroduction}
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card bordered={false}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  this.props.history.push('/category/label/list');
                }}
                className={styles.ButtonCenter}
              >
                发送修改申请
              </Button>
            </Card>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Editor;
