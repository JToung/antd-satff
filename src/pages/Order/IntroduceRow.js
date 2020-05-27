import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './style.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
  style: { marginBottom: 24 },
};

const getflag = simpleRatio => {
  if (simpleRatio > 0) {
    return 'up';
  } else {
    return 'down';
  }
};

const IntroduceRow = memo(
  ({
    loading,
    simpleRatioTotal,
    simpleRatioBadTotal,
    simpleRatioGoodTotal,
    orderTotal,
    BadOrderTotal,
    GoodOrderTotal,
    TotalOneDay,
    BadTotalOneDay,
    GoodTotalOneDay,
  }) => (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          title={<FormattedMessage id="app.analysis.order" defaultMessage="Order" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => orderTotal}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="app.analysis.day-order"
                  defaultMessage="Daily Order"
                />
              }
              value={`${numeral(TotalOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag={getflag(simpleRatioTotal)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioTotal}%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          title={
            <FormattedMessage
              id="app.analysis.order-ground"
              defaultMessage="Order Ground"
            />
          }
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => BadOrderTotal}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="app.analysis.day-order-ground"
                  defaultMessage="Daily Order Ground"
                />
              }
              value={`${numeral(BadTotalOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag={getflag(simpleRatioBadTotal)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioBadTotal}%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          title={
            <FormattedMessage
              id="app.analysis.order-complete"
              defaultMessage="Order Complete"
            />
          }
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => GoodOrderTotal}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="app.analysis.day-order-complete"
                  defaultMessage="Daily Order Complete"
                />
              }
              value={`${numeral(GoodTotalOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag={getflag(simpleRatioGoodTotal)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioGoodTotal}%</span>
          </Trend>
        </ChartCard>
      </Col>
    </Row>
  )
);

export default IntroduceRow;
