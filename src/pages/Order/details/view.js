import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Modal, Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';
import Link from 'umi/link';

const statusMap = ['red', 'green', 'yellow', 'cyan', 'geekblue'];
const status = ['结束', '进行中', '待分配', '用户终止', '等待启动'];
@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['workorder'],
  //model
}))
class ViewItem extends PureComponent {
  constructor(props) {
    super(props);

    this.logColumns = [
      {
        title: '单品分区ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '单品分区名称',
        dataIndex: 'name',
        key: 'name',
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
              {console.log('record', record)}
              <Link onClick={() => this.showPartitionViewModal(record._id)}>查看</Link>
              <Modal
                title="查看单品分区"
                visible={this.state.partitionViewVisible}
                onOk={this.handlePartitionViewOk}
                onCancel={this.handlePartitionViewCancel}
                width={720}
              >
                <Descriptions bordered layout="vertical">
                  <Descriptions.Item label="单品分区名">{record.name}</Descriptions.Item>
                  <Descriptions.Item label="价格">{record.price}</Descriptions.Item>
                  <Descriptions.Item label="单品应用场景">{record.applicable}</Descriptions.Item>
                  <Descriptions.Item label="风格">{record.style}</Descriptions.Item>
                  <Descriptions.Item label="行业">{record.industry}</Descriptions.Item>
                  <Descriptions.Item label="类型">{record.type}</Descriptions.Item>
                  <Descriptions.Item label="单品分区简介" span={3}>
                    {record.introduction}
                  </Descriptions.Item>
                  <Descriptions.Item label="细节" span={3}>
                    {record.detail}
                  </Descriptions.Item>
                  <Descriptions.Item label="单品任务" span={3}>
                    <Table bordered dataSource={this.state.Task} columns={this.taskInstance} />
                  </Descriptions.Item>
                </Descriptions>
              </Modal>
              <Divider type="vertical" />
            </div>
          ) : null,
      },
    ];

    this.state = {
      //存储工单信息
      Workorder: {},
      //存储单品中断处理表状态
      interruptData: [],
      //分区名
      partitionsName: '',
      partitionViewVisible: false,
      View: {},
      keyView: '',
      Task: [],
      //品类名
      categoryName: '',
      //任务表汇总
      log: [],
      //所属品类名
      categoryName: '',
    };
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
    console.log('params_id', this.props.match.params._id);

    const { dispatch } = this.props;
    const params = {
      operatorID: localStorage.getItem('userId'),
      _id: this.props.match.params._id,
    };
    dispatch({
      type: 'workorder/queryWorkorder',
      payload: params,
    }).then(res => {
      this.setState({ Workorder: res.findResult[0] });
      const params1 = {
        id: res.findResult[0].itemPartition,
      };
      console.log(params1)
      dispatch({
        type: 'workorder/queryPartition',
        payload: params1,
      }).then(res => {
        this.setState({ partitionsName: res.findResult.name });
      });
    });
  }

  onState(state) {
    return <Badge color={statusMap[state]} text={status[state]} />;
  }

  //查看单品分区
  handlePartitionViewOk = e => {
    console.log(e);
    this.setState({
      partitionViewVisible: false,
    });
  };

  showPartitionViewModal = keyView => {
    this.setState({ keyView: keyView });
    console.log('keyEditor', keyView);
    const { dispatch } = this.props;

    const params = {
      id: keyView,
    };
    dispatch({
      type: 'item/fetchTask',
      payload: params,
    }).then(res => {
      const Task = res.findResult;
      this.setState({ Task: Task });
    });

    this.setState({
      partitionViewVisible: true,
    });
  };

  handlePartitionViewCancel = e => {
    console.log(e);
    this.setState({
      partitionViewVisible: false,
    });
  };

  re = () => {
    const { workorder = {}, loading } = this.props;
    const { partitions, Workorder, interruptData, partitionsName } = this.state;
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.workorder.basic.title" />}>
        <Card bordered={false}>
          <Descriptions title="工单信息" bordered loading={loading} layout="vertical">
            <Descriptions.Item label="工单ID">{Workorder._id}</Descriptions.Item>
            <Descriptions.Item label="工单名">{Workorder.name}</Descriptions.Item>
            <Descriptions.Item label="订单id">{Workorder.orderID}</Descriptions.Item>
            <Descriptions.Item label="工单起始时间" span={3}>
              {moment(Workorder.startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="工单状态">{this.onState(Workorder.state)}</Descriptions.Item>
            <Descriptions.Item label="所属分区名" span={2}>
              {this.state.partitionsName}
            </Descriptions.Item>
            <Descriptions.Item label="专才id" span={3}>
              {Workorder.servicer}
            </Descriptions.Item>
            <Descriptions.Item label="服务启动时间" span={3}>
            {moment(Workorder.serverTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="客户要求" span={3}>
              {Workorder.requirement}
            </Descriptions.Item>
            <Descriptions.Item label="客户电话" span={3}>
              {Workorder.customerPhone}
            </Descriptions.Item>
          </Descriptions>
          <div>
            <Card bordered={false}>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/workorder/list');
                }}
                className={styles.ButtonCenter}
              >
                返回
              </Button>
            </Card>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  };

  render() {
    const { workorder = {}, loading } = this.props;
    const { partitions, Workorder, interruptData } = this.state;

    console.log('workorder', Workorder);
    if (Workorder == null) {
      if (this.props.match.params._id == null) {
        this.props.history.push('/workorder/list');
      } else {
        return <div>{this.re()}</div>;
      }
    } else if (Workorder != null) {
      return <div>{this.re()}</div>;
    }
  }
}

export default ViewItem;
