import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';

const { Column, ColumnGroup } = Table;
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
];

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
class View extends PureComponent {
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

  onOperatorState(operatorState) {
    if (operatorState == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  render() {
    const { operator = {}, loading } = this.props;
    // console.log('operator.date',operator);
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
        <Card bordered={false}>
          <Descriptions title="服务品类标识信息" bordered loading={loading}>
            <Descriptions.Item label="品类标识ID">{operator.data._id}</Descriptions.Item>
            <Descriptions.Item label="品类标识名">{operator.data.operatorName}</Descriptions.Item>
            <Descriptions.Item label="品类标识上架时间">
              {operator.data.operatorAddTime}
            </Descriptions.Item>
            <Descriptions.Item label="品类标识介绍" span={2}>
              {operator.data.content}
            </Descriptions.Item>
            <Descriptions.Item label="品类标识详情" span={4}>
              {operator.data.content}
            </Descriptions.Item>
            <Descriptions.Item label="品类标识状态" span={3}>
              {this.onOperatorState(operator.data.operatorState)}
            </Descriptions.Item>
          </Descriptions>
          <Card>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push('/category/label/list');
              }}
              className={styles.ButtonCenter}
            >
              返回
            </Button>
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default View;
