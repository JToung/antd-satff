import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';

@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchCategory'],
  //model
}))
class View extends PureComponent {
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

    console.log('params_id', this.props.match.params._id);

    const params1 = {
      _id: params._id,
    };

    dispatch({
      type: 'category/fetchCategory',
      payload: params1,
    });
  }

  onCategoryState(categoryState) {
    if (categoryState == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  render() {
    const { category = {}, loading } = this.props;
    // console.log('operator.date',operator);
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      return (
        // 加头部
        <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
          <Card bordered={false}>
            <Descriptions title="服务品类包信息" bordered loading={loading}>
              <Descriptions.Item label="品类包ID">{category.data.res[0]._id}</Descriptions.Item>
              <Descriptions.Item label="品类包名">
                {category.data.res[0].categoryName}
              </Descriptions.Item>
              <Descriptions.Item label="品类包上架时间">
                {moment(category.data.res[0].categoryAddTime)
                  .subtract(8, 'hours')
                  .format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="运营商ID" span={2}>
                {category.data.res[0].categoryOperator}
              </Descriptions.Item>
              <Descriptions.Item label="品类包介绍" span={3}>
                {category.data.res[0].categoryIntrod}
              </Descriptions.Item>
              <Descriptions.Item label="品类包状态" span={3}>
                {this.onCategoryState(category.data.res[0].categoryState)}
              </Descriptions.Item>
            </Descriptions>
            <br />
            <Descriptions title="品类规范（用于品类下级单品规范）" bordered loading={loading}>
              <Descriptions.Item label="规范必要说明" span={3}>
                {category.data.res[0].categoryExplanation}
              </Descriptions.Item>
              <Descriptions.Item label="名称最小字数">{category.data.res[0].categoryMinName}</Descriptions.Item>
              <Descriptions.Item label="简介最大字数">{category.data.res[0].categoryMaxIntroduction}</Descriptions.Item>
              <Descriptions.Item label="详情最大字数">{category.data.res[0].categoryMaxContent}</Descriptions.Item>
              <Descriptions.Item label="名称最大字数">{category.data.res[0].categoryMaxName}</Descriptions.Item>
              <Descriptions.Item label="简介最小字数">{category.data.res[0].categoryMinIntroduction}</Descriptions.Item>
              <Descriptions.Item label="详情最小字数">{category.data.res[0].categoryMinContent}</Descriptions.Item>
              <Descriptions.Item label="最大分区数">{category.data.res[0].categoryMaxPartition}</Descriptions.Item>
              <Descriptions.Item label="最少任务数">{category.data.res[0].categoryMinTasks}</Descriptions.Item>
              <Descriptions.Item label="最小评分">{category.data.res[0].categoryMinScore}</Descriptions.Item>
              <Descriptions.Item label="最小分区数">{category.data.res[0].categoryMinPartition}</Descriptions.Item>
              <Descriptions.Item label="最大任务数">{category.data.res[0].categoryMaxTasks}</Descriptions.Item>
              <Descriptions.Item label="任务最长时间">{category.data.res[0].categoryMaxTaskTime}</Descriptions.Item>
              <Descriptions.Item label="单个分区最低价格">{category.data.res[0].categoryMinPrice}</Descriptions.Item>
              <Descriptions.Item label="单个分区最高价格" span={2}>
              {category.data.res[0].categoryMaxPrice}
              </Descriptions.Item>
            </Descriptions>
            <Card>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/category/list');
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
}

export default View;
