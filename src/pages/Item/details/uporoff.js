import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Descriptions, Badge, Card, Button, message } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';

import moment from 'moment';

@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchCategory'],
  //model
}))
@Form.create()
class UPOROFFItem extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

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
      _id: this.props.match.params._id,
    };

    dispatch({
      type: 'category/fetchCategory',
      payload: params1,
    });
  }

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('values', values);
      if (err) {
        console.log('err' + err);
        return;
      }
      // if (!err) {
      //   console.log('receive the value of input ' + values);
      // }
      const params1 = {
        _id: this.props.match.params._id,
      };

      dispatch({
        type: 'category/fetchCategory',
        payload: params1,
      }).then(res => {
        const res1 = res.res[0];
        const payload = {
          ...values,
          categoryName: res1.categoryName,
          categoryAddTime: res1.categoryAddTime,
          categoryOperator: res1.categoryOperator,
          categoryIntrod: res1.categoryIntrod,
          categoryState: res1.categoryState,
          categoryExplanation: res1.categoryExplanation,
          categoryMinName: res1.categoryMinName,
          categoryMaxIntroduction: res1.categoryMaxIntroduction,
          categoryMaxContent: res1.categoryMaxContent,
          categoryMaxName: res1.categoryMaxName,
          categoryMinIntroduction: res1.categoryMinIntroduction,
          categoryMaxPartition: res1.categoryMaxPartition,
          categoryMinTasks: res1.categoryMinTasks,
          categoryMinScore: res1.categoryMinScore,
          categoryMinPartition: res1.categoryMinPartition,
          categoryMaxTasks: res1.categoryMaxTasks,
          categoryMaxTaskTime: res1.categoryMaxTaskTime,
          categoryMinPrice: res1.categoryMinPrice,
          categoryMaxPrice: res1.categoryMaxPrice,
          categoryDeleteTime: new Date(),
          id: this.props.match.params._id,
        };
        console.log('参数', payload);
        dispatch({
          type: 'category/uporoffCategory',
          payload,
        }).then(res => {
          console.log('res', res);
          if (res != null) {
            if (res.upInstance.changedData.categoryState == '0') {
              message.success('申请上架成功！');
              this.props.history.push('/category/list');
            } else if (res.upInstance.changedData.categoryState == '1') {
              message.success('申请下架成功！');
              this.props.history.push('/category/list');
            }
          } else {
            if (res.upInstance.changedData.categoryState == '0') {
              message.error('申请上架失败，请重试!');
            } else if (res.upInstance.changedData.categoryState == '1') {
              message.error('申请下架失败，请重试!');
            }
          }
        });
      });
    });
  };

  onCategoryState(categoryState) {
    if (categoryState == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  initialValue(category) {
    console.log('category.data.res', category.data.res);
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      const {
        category = {},
        loading,
        form: { getFieldDecorator },
      } = this.props;
      return (
        <div>
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
              <Descriptions.Item label="名称最小字数">
                {category.data.res[0].categoryMinName}
              </Descriptions.Item>
              <Descriptions.Item label="简介最大字数">
                {category.data.res[0].categoryMaxIntroduction}
              </Descriptions.Item>
              <Descriptions.Item label="详情最大字数">
                {category.data.res[0].categoryMaxContent}
              </Descriptions.Item>
              <Descriptions.Item label="名称最大字数">
                {category.data.res[0].categoryMaxName}
              </Descriptions.Item>
              <Descriptions.Item label="简介最小字数">
                {category.data.res[0].categoryMinIntroduction}
              </Descriptions.Item>
              <Descriptions.Item label="详情最小字数">
                {category.data.res[0].categoryMinContent}
              </Descriptions.Item>
              <Descriptions.Item label="最大分区数">
                {category.data.res[0].categoryMaxPartition}
              </Descriptions.Item>
              <Descriptions.Item label="最少任务数">
                {category.data.res[0].categoryMaxTasks}
              </Descriptions.Item>
              <Descriptions.Item label="最小评分">
                {category.data.res[0].categoryMinScore}
              </Descriptions.Item>
              <Descriptions.Item label="最小分区数">
                {category.data.res[0].categoryMinPartition}
              </Descriptions.Item>
              <Descriptions.Item label="最大任务数">
                {category.data.res[0].categoryMaxTasks}
              </Descriptions.Item>
              <Descriptions.Item label="任务最长时间">
                {category.data.res[0].categoryMaxTaskTime}
              </Descriptions.Item>
              <Descriptions.Item label="单个分区最低价格">
                {category.data.res[0].categoryMinPrice}
              </Descriptions.Item>
              <Descriptions.Item label="单个分区最高价格" span={2}>
                {category.data.res[0].categoryMaxPrice}
              </Descriptions.Item>
            </Descriptions>
            {this.tfSJcategory(category)}
          </Card>
        </div>
      );
    }
  }

  tfSJcategory(category) {
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      const {
        category = {},
        loading,
        form: { getFieldDecorator },
      } = this.props;
      if (category.data.res[0].categoryState == '1') {
        return (
          <div>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label="下架理由">
                  {getFieldDecorator('categoryReason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入下架理由',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入下架理由"
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      } else if (category.data.res[0].categoryState == '0') {
        return (
          <div>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label="上架理由">
                  {getFieldDecorator('categoryReason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入上架理由',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入上架理由"
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      }
    }
  }

  tfSJcategoryName(category) {
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      if (category.data.res[0].categoryState == '1') {
        const Name = "下架品类包";
        return Name
      } else if (category.data.res[0].categoryState == '0') {
        const Name = "上架品类包";
        return Name
      }
    }
  }

  tfSJcategoryButton(category) {
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      if (category.data.res[0].categoryState == '1') {
        const Name = "确认下架";
        return Name
      } else if (category.data.res[0].categoryState == '0') {
        const Name = "确认上架";
        return Name
      }
    }
  }

  render() {
    const {
      category = {},
      loading,
      form: { getFieldDecorator },
    } = this.props;

    console.log('categotyData', category);
    // console.log('operator.date',operator);

    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
        <Card bordered={false} title={this.tfSJcategoryName(category)}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            {this.initialValue(category)}
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.ButtonRight}
                      loading={loading}
                    >
                      {this.tfSJcategoryButton(category)}
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
                        this.props.history.push('/category/list');
                      }}
                      loading={loading}
                    >
                      返回列表
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

export default UPOROFFItem;
