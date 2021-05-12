import React, { Component } from 'react'
import ReactECharts  from 'echarts-for-react'
export default class Line extends Component {
  
  option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
    }]
};
  render() {
    return (
      <div>
              <ReactECharts option={this.option} />
      </div>
    )
  }
}
