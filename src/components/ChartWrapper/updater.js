export const UpdateChart = {
  line: (chart, series) => {
    series.forEach((singleSeries, i) => {
      chart.series[i].setData(series[i].data)
    })

    chart.redraw()
  },
  bar: (chart, series) => {
    chart.xAxis[0].setCategories(series.categories)
    
    series.values.forEach((singleSeries, i) => {
      chart.series[i].setData(series.values[i].data)
    })

    chart.redraw()
  }
}