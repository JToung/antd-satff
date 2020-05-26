import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Home.less';
import PageLoading from '@/components/PageLoading';
import moment from 'moment';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const CashFlowCard = React.lazy(() => import('./CashFlowCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class OperatorHome extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    Totalamout: 0,
    Volume: 0,
    Profit: 0,
    Debt: 0,
    //日增长率
    simpleRatioSale: 0,
    simpleRatioVolume: 0,
    simpleRatioProfit: 0,
    simpleRatioDebt: 0,
    //日额
    SaleOneDay: 0,
    VolumeOneDay: 0,
    ProfitOneDay: 0,
    DebtOneDay: 0,
    //趋势图data
    VolumeDate: [],
    SaleDate: [],
    //趋势图
    Data: {},
    //现金流表
    Cash01: [],
    //运营商排行
    OperatorRank: [],
    total: 0,
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
    console.log('user', JSON.parse(localStorage.getItem('user')));
    console.log(localStorage.getItem('userId'));
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });

    //获取总销售额
    dispatch({
      type: 'staff/queryTotalamout',
    }).then(res => {
      if (res.status == '1') {
        this.setState({ Totalamout: res.result[0].totalAmount });
        // console.log("res",res.result[0].totalAmount)
      }
    });
    //获取日销售额
    dispatch({
      type: 'staff/querySaleonday',
    }).then(res => {
      this.setState({ SaleOneDay: res.result[0].totalAmount, simpleRatioSale: res.simpleRatio });
    });

    //获取月销售额
    dispatch({
      type: 'staff/querySaleMonth',
    }).then(res => {
      const SaleDate1 = [];
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
          SaleDate1.push({
            x: i + '日',
            y: 0,
          });
        }
        for (let j = 1; j < data.length + 1; j += 1) {
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = {
            x: data[data.length - j]._id.dayOfMonth + '日',
            y: data[data.length - j].totalAmount,
          };
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1.push({
            x: moment(new Date(beginDay - 1000 * 60 * 60 * 24 * (data.length - i))).format(
              'YYYY-MM-DD'
            ),
            y: data[data.length - i].totalAmount,
          });
        }
      }
      const { SaleDate } = this.state;
      this.setState({ SaleDate: [...SaleDate1] });
    });

    //queryVolume
    dispatch({
      type: 'staff/queryVolume',
    }).then(res => {
      this.setState({ Volume: res[0].count });
    });

    //queryVolumeOneday
    dispatch({
      type: 'staff/queryVolumeOneday',
    }).then(res => {
      this.setState({ VolumeOneDay: res.result[0].count, simpleRatioSale: res.simpleRatio });
      const VolumeDate1 = [];
      const data = res.result;
      console.log('data', data);
      const beginDay = new Date().getTime();
      // console.log('beginDay', beginDay);
      for (let i = 1; i < data.length + 1; i += 1) {
        console.log('data.length-i', data.length - i);
        VolumeDate1.push({
          x: moment(new Date(beginDay - 1000 * 60 * 60 * 24 * (data.length - i))).format(
            'YYYY-MM-DD'
          ),
          y: data[data.length - i].count,
        });
      }
      const { VolumeDate } = this.state;
      this.setState({ VolumeDate: [...VolumeDate1] });
      console.log('VolumeDate1', VolumeDate1);
    });
    //获取总利润
    dispatch({
      type: 'staff/queryProfit',
    }).then(res => {
      if (res.status == '1') {
        this.setState({ Profit: res.result[0].totalAmount });
        // console.log("res",res.result[0].totalAmount)
      }
    });

    //获取单日利润及日环比
    dispatch({
      type: 'staff/queryProfitMonth',
    }).then(res => {
      this.setState({ simpleRatioProfit: res.simpleRatio, ProfitOneDay: res.monthData[0].profit });
    });

    // 获取总应付
    dispatch({
      type: 'staff/queryDebt',
    }).then(res => {
      this.setState({ Debt: res[0].debt });
    });

    //获取单日应付及日环比
    dispatch({
      type: 'staff/queryDebtMonth',
    }).then(res => {
      this.setState({ simpleRatioDebt: res.simpleRatio, DebtOneDay: res.monthData[0].debt });
    });

    //默认Data
    this.getYearData();

    //获取现金流
    dispatch({
      type: 'staff/queryCash01',
    }).then(res => {
      if (res.status == '1') {
        this.setState({ Cash01: res.findResult });
      }
    });

    //运营商排行
    dispatch({
      type: 'staff/queryOperatorRank',
    }).then(res => {
      res.map(res => {
        const params1 = {
          _id: res._id.operator[0],
        };
        // this.setState({ total: res.saleAmount });
        // console.log('total',total)
        // console.log('res.saleAmount',res.saleAmount)
        const total = res.saleAmount;
        dispatch({
          type: 'operator/fetchOperator',
          payload: params1,
        }).then(res => {
          const { OperatorRank } = this.state;
          if (res.status == '1') {
            const rankingListData = [];
            rankingListData.push({
              title: res.foundData[0].operatorName,
              total: total,
            });
            console.log('rankingListData', rankingListData);
            this.setState({ OperatorRank: [...OperatorRank, rankingListData[0]] });
          }
        });
      });
    });
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
    //载入销售额 ydata1
    dispatch({
      type: 'staff/querySaleMonth',
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
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].totalAmount;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].totalAmount;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata1: SaleDate1 } });
    });
    //载入成交量 ydata2
    dispatch({
      type: 'staff/queryVolumeMonth',
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
      this.setState({ Data: { ...Data, ydata2: SaleDate1 } });
    });
    //载入平台利润 ydata3
    dispatch({
      type: 'staff/queryProfitMonth',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.monthData;
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
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].profit;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].profit;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata3: SaleDate1 } });
    });
    //载入应付账款 ydata4
    dispatch({
      type: 'staff/queryDebtMonth',
    }).then(res => {
      var SaleDate1 = [];
      const data = res.monthData;
      console.log('data', data);
      const beginDay = new Date().getTime();
      //获取当月天数
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var d = new Date(year, month, 0);
      // console.log('beginDay', beginDay);
      if (d.getDate() + 1 - data.length != 0) {
        //载入31个0
        for (let i = 1; i < d.getDate() + 1; i += 1) {
          SaleDate1 = [...SaleDate1, 0];
        }
        //填充数据
        for (let j = 1; j < data.length + 1; j += 1) {
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].debt;
        }
      } else {
        for (let i = 1; i < data.length + 1; i += 1) {
          console.log('data.length-i', data.length - i);
          SaleDate1[data[data.length - j]._id.dayOfMonth - 1] = data[data.length - j].debt;
        }
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata4: SaleDate1 } });
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
    //载入销售额 ydata1
    dispatch({
      type: 'staff/querySaleYear',
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
        SaleDate1[data[data.length - j]._id.month - 1] = data[data.length - j].totalAmount;
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata1: SaleDate1 } });
    });
    //载入成交量 ydata2
    dispatch({
      type: 'staff/queryVolumeYear',
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
      this.setState({ Data: { ...Data, ydata2: SaleDate1 } });
    });
    //载入平台利润 ydata3
    dispatch({
      type: 'staff/queryProfitYear',
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
      this.setState({ Data: { ...Data, ydata3: SaleDate1 } });
    });
    //载入应付 ydata4
    dispatch({
      type: 'staff/queryDebtYear',
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
        SaleDate1[data[data.length - j]._id.month - 1] = data[data.length - j].debt;
      }
      const { Data } = this.state;
      this.setState({ Data: { ...Data, ydata4: SaleDate1 } });
    });
  };
  selectDate = type => {
    if (type == 'month') {
      this.getMonthData();
    } else if (type == 'year') {
      this.getYearData();
    }
    this.setState({
      rangePickerValue: getTimeDistance(type),
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
      Totalamout,
      simpleRatioSale,
      SaleOneDay,
      Volume,
      simpleRatioVolume,
      VolumeOneDay,
      VolumeDate,
      SaleDate,
      Profit,
      Data,
      simpleRatioProfit,
      ProfitOneDay,
      simpleRatioDebt,
      Debt,
      DebtOneDay,
      Cash01,
      OperatorRank,
    } = this.state;
    console.log(VolumeDate);
    console.log('OperatorRank', OperatorRank);

    console.log('ProfitOneDay', ProfitOneDay);
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    console.log(visitData);
    console.log('SaleDate', SaleDate);
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
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

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow
            loading={loading}
            visitData={VolumeDate}
            Totalamout={Totalamout}
            simpleRatioSale={simpleRatioSale}
            SaleOneDay={SaleOneDay}
            Volume={Volume}
            Profit={Profit}
            simpleRatioVolume={simpleRatioVolume}
            VolumeOneDay={VolumeOneDay}
            ProfitOneDay={ProfitOneDay}
            simpleRatioProfit={simpleRatioProfit}
            simpleRatioDebt={simpleRatioDebt}
            Debt={Debt}
            DebtOneDay={DebtOneDay}
          />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={SaleDate}
            VolumeDate={VolumeDate}
            isActive={this.isActive}
            Data={Data}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            dataDD={Cash01}
            OperatorRank={OperatorRank}
          />
        </Suspense>
        {/* <div>
          <Suspense fallback={null}>
            <CashFlowCard />
          </Suspense>
        </div> */}
      </GridContent>
    );
  }
}

export default OperatorHome;
