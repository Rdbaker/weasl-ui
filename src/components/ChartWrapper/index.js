import React, { Component } from 'react'
import * as Highcharts from 'highcharts'

import { ConfigGenerator } from './generator'
import { UpdateChart } from './updater'


const TextLoader = () => <div>Loading</div>

class Chart extends Component {
  componentDidMount() {
    const { loading = false } = this.props
    if (!loading) {
      this.renderChart()
    }
  }

  componentDidUpdate(prevProps) {
    const { series, chartType } = this.props

    if (['line', 'step'].includes(chartType) && series.every((data, i) => data !== prevProps.series[i])) {
      UpdateChart.line(this.chart, series)
    } else if (chartType !== 'line' && series.values.every((data, i) => data !== prevProps.series.values[i]).data) {
      UpdateChart.bar(this.chart, series)
    }
  }

  renderChart() {
    const { chartType, series, options, container } = this.props
    const config = ConfigGenerator(chartType, series, options)

    this.chart = new Highcharts['Chart'](container, config)
  }

  render() {
    const { loading = false, container } = this.props
    return (
      <div>
        {loading &&
          <TextLoader text={'Grabbing graph data'} />
        }
        {!loading &&
          <div id={container}>
          </div>
        }
      </div>
    )
  }
}


export default Chart