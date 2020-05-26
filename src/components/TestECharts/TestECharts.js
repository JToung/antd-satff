import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';

class TestECharst extends React.Component {
  componentDidMount() {
    console.log('ceshidata111',this.props.data)
    // window.onresize = myChart.resize;
    this.initChart();
  }
  // 更新数据重新初始化视图
  componentDidUpdate() {
    console.log('ceshidata222',this.props.data)
    this.initChart();
}

  initChart = () =>{
    // 初始化
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      title: { text: this.props.echartsTitle }, //标题
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: this.props.legend, //数组类型，显示标题
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: {
            show: true,
            type: 'jpg',
          },
        },
      },
      xAxis: [
        {
          type: 'category', //X轴的英文名
          data: this.props.data.xdata,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: this.props.DataName[0],
          type: 'bar',
          data: this.props.data.ydata1,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
          },
        },
        {
          name: this.props.DataName[1],
          type: 'bar',
          data: this.props.data.ydata2,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
          },
        },
        {
          name: this.props.DataName[2],
          type: 'bar',
          data: this.props.data.ydata3,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
          },
        },
        {
          name: this.props.DataName[3],
          type: 'bar',
          data: this.props.data.ydata4,
          markPoint: {
            data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }],
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
          },
        },
      ],
    });
  }

  render() {
    return <div id="main" style={{ width: '100%', height: 360 }} />;
  }
}

export default TestECharst;
