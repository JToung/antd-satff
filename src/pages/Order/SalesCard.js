import React, { memo } from 'react';
import { Table, Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './style.less';
import { Bar } from '@/components/Charts';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import TestECharst from '@/components/TestECharts/TestECharts';


const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}


const SalesCard = memo(
  ({
    rangePickerValue,
    isActive,
    handleRangePickerChange,
    loading,
    selectDate,
    Data,
    PartitonRank,
  }) => (
    <Card loading={loading} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
                </a>
              </div>
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.analysis.order" defaultMessage="Order" />}
            key="Order"
          >
            <Row>
              <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <TestECharst
                    data={Data}
                    DataName={['订单数', '订单意外终止数', '订单完成数']}
                    legend={['订单数', '订单意外终止数', '订单完成数']}
                    echartsTitle="趋势图"
                  />
                  {console.log('ceshiData', Data)}
                </div>
              </Col>
              <Col xl={{ span: 7, offset: 2 }} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.PartitonRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.order-ranking"
                      defaultMessage="Order Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {PartitonRank.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.total).format('0,0')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;
