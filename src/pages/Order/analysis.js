import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './style.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const ListCard = React.lazy(() => import('./ListCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: { marginBottom: 24 },
};

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class AnalysisItem extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    //总额
    orderTotal: 0,
    BadOrderTotal: 0,
    GoodOrderTotal: 0,
    //日增长率
    simpleRatioTotal: 0,
    simpleRatioBadTotal: 0,
    simpleRatioGoodTotal: 0,
    //日额
    TotalOneDay: 0,
    BadTotalOneDay: 0,
    GoodTotalOneDay: 0,
    //趋势图
    Data: {},
    //单品分区排行
    PartitonRank: [],
  };

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
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });

    // 获取总订单数
    dispatch({
      type: 'order/queryTotalOrder',
    }).then(res => {
      this.setState({ orderTotal: res[0].count });
    });
    //日订单数及环比
    dispatch({
      type: 'order/queryTotalOrderOneday',
    }).then(res => {
      this.setState({ TotalOneDay: res.result[0].count, simpleRatioTotal: res.simpleRatio });
    });

    //意外中止订单总数
    dispatch({
      type: 'order/queryBadOrder',
    }).then(res => {
      this.setState({ BadOrderTotal: res[0].count });
    });

    //本日意外中止订单 及环比
    dispatch({
      type: 'order/queryBadOrderMonth',
    }).then(res => {
      this.setState({ simpleRatioBadTotal: res.simpleRatio, BadTotalOneDay: res.today });
    });

    //获取顺利完成订单单数
    dispatch({
      type: 'order/queryGoodOrder',
    }).then(res => {
      this.setState({ GoodOrderTotal: res[0].count });
    });

    //本日顺利完成订单 及环比
    dispatch({
      type: 'order/queryGoodOrderMonth',
    }).then(res => {
      this.setState({ simpleRatioGoodTotal: res.simpleRatio, GoodTotalOneDay: res.today });
    });

    //默认Data
    this.getYearData();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  //获取月Data
  getMonthData = () => {
    const { dispatch } = this.props;
    this.setState({ Data: {} });
    //获取当月天数
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    // 载入xdata
    var dataTest = [];
    var y2 = [];
    var y3 = [];
    var y4 = [];
    for (let i = 1; i < d.getDate() + 1; i += 1) {
      dataTest = [...dataTest, i + '日'];
      y2 = [...y2, 0];
      y3 = [...y3, 0];
      y4 = [...y4, 0];
    }
    this.setState({ Data: { xdata: dataTest, ydata2: y2, ydata3: y3, ydata4: y4 } });
    const { Data } = this.state;
    console.log('DatadataTest', Data);
    //载入订单 ydata1
    dispatch({
      type: 'order/queryTotalOrderMonth',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.result;
      console.log('data', data);
      const beginDay = new Date().getTime();
      //获取当月天数
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      // console.log('beginDay', beginDay);
      if (d.getDate() + 1 - data.length != 0) {
        for (let i = 1; i < d.getDate() + 1; i += 1) {
          SaleDate1 = [...SaleDate1, 0];
        }
        for (let j = 1; j < data.length + 1; j += 1) {
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].count;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].count;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata1: SaleDate1 } });
    });
    //载入失败订单 ydata2
    dispatch({
      type: 'order/queryBadOrderMonth',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.number;
      console.log('data22', data);
      const beginDay = new Date().getTime();
      //获取当月天数
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      // console.log('beginDay', beginDay);
      if (d.getDate() + 1 - data.length != 0) {
        for (let i = 1; i < d.getDate() + 1; i += 1) {
          SaleDate1 = [...SaleDate1, 0];
        }
        for (let j = 1; j < data.length + 1; j += 1) {
          SaleDate1[data[data.length - j]._id.dayofMonth - 1] = data[data.length - j].count;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayofMonth - 1] = data[data.length - j].count;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata2: SaleDate1 } });
    });
    //载入完成订单 ydata3
    dispatch({
      type: 'order/queryGoodOrderMonth',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.number;
      console.log('data', data);
      const beginDay = new Date().getTime();
      //获取当月天数
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      // console.log('beginDay', beginDay);
      if (d.getDate() + 1 - data.length != 0) {
        for (let i = 1; i < d.getDate() + 1; i += 1) {
          SaleDate1 = [...SaleDate1, 0];
        }
        for (let j = 1; j < data.length + 1; j += 1) {
          SaleDate1[data[data.length - j]._id.dayofMonth - 1] = data[data.length - j].count;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayofMonth - 1] = data[data.length - j].count;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata3: SaleDate1 } });
    });
  };

  //获取年Data
  getYearData = () => {
    const { dispatch } = this.props;
    this.setState({ Data: {} });
    // 载入xdata
    var dataTest1 = [];
    var y2 = [];
    var y3 = [];
    var y4 = [];
    for (let i = 1; i < 13; i += 1) {
      dataTest1 = [...dataTest1, i + '月'];
      y2 = [...y2, 0];
      y3 = [...y3, 0];
      y4 = [...y4, 0];
    }
    this.setState({ Data: { xdata: dataTest1, ydata2: y2, ydata3: y3, ydata4: y4 } });
    //载入订单 ydata1
    dispatch({
      type: 'order/queryTotalOrderYear',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.result;
      console.log('data', data);
      const beginDay = new Date().getTime();
      // console.log('beginDay', beginDay);
      for (let i = 1; i < 13; i += 1) {
        SaleDate1 = [...SaleDate1, 0];
      }
      for (let j = 1; j < data.length + 1; j += 1) {
        SaleDate1[data[data.length - j]._id.month - 1] = data[data.length - j].count;
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata1: SaleDate1 } });
    });
    //载入失败订单 ydata2
    dispatch({
      type: 'order/queryBadOrderYear',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.number;
      console.log('data2', data);
      const beginDay = new Date().getTime();
      // console.log('beginDay', beginDay);
      for (let i = 1; i < 13; i += 1) {
        SaleDate1 = [...SaleDate1, 0];
      }
      for (let j = 1; j < data.length + 1; j += 1) {
        SaleDate1[data[data.length - j]._id.month - 1] = data[data.length - j].count;
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata2: SaleDate1 } });
    });
    //载入完成订单 ydata3
    dispatch({
      type: 'order/queryGoodOrderYear',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.number;
      console.log('data3', data);
      const beginDay = new Date().getTime();
      // console.log('beginDay', beginDay);
      for (let i = 1; i < 13; i += 1) {
        SaleDate1 = [...SaleDate1, 0];
      }
      for (let j = 1; j < data.length + 1; j += 1) {
        SaleDate1[data[data.length - j]._id.month - 1] = data[data.length - j].count;
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata3: SaleDate1 } });
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    if (type == 'month') {
      this.getMonthData();
    } else if (type == 'year') {
      this.getYearData();
    }

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const {
      rangePickerValue,
      salesType,
      currentTabKey,
      orderTotal,
      BadOrderTotal,
      GoodOrderTotal,
      //日增长率
      simpleRatioTotal,
      simpleRatioBadTotal,
      simpleRatioGoodTotal,
      //日额
      TotalOneDay,
      BadTotalOneDay,
      GoodTotalOneDay,
      //趋势图
      Data,
      //单品分区排行
      PartitonRank,
    } = this.state;
    const { match, chart, loading } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow
            loading={loading}
            simpleRatioTotal={simpleRatioTotal}
            simpleRatioBadTotal={simpleRatioBadTotal}
            simpleRatioGoodTotal={simpleRatioGoodTotal}
            orderTotal={orderTotal}
            BadOrderTotal={BadOrderTotal}
            GoodOrderTotal={GoodOrderTotal}
            TotalOneDay={TotalOneDay}
            BadTotalOneDay={BadTotalOneDay}
            GoodTotalOneDay={GoodTotalOneDay}
          />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            Data={Data}
            PartitonRank={PartitonRank}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default AnalysisItem;
