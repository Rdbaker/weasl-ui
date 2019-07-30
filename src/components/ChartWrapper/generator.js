const lineConfig = (series, options) => {
  return {
    chart: {
      height: options.height || window.innerHeight - 232,
      margin: options.margins || [10, 40, 70, 65],
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
      },
      zoomType: 'x',
      type: 'spline',
      backgroundColor: '#EDF3F3',
    },

    title: {
      text: options.title || ''
    },

    legend: options.legend || {
      enabled: false,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      backgroundColor: '#EDF3F3',
      margin: 16,
      floating: false,
      x: 0,
      y: 0,
    },

    time: options.time || {
      useUTC: false
    },

    yAxis: options.yAxis || {
      allowDecimals: false,
      title: {
        text: null,
      },
      minRange: 1
    },

    xAxis: options.xAxis || {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%m/%d',
      },
      minPadding: 0.05,
      maxPadding: 0.05,
      minorTickLength: 0,
      tickLength: 0,
      labels: {
        y: 25,
      },
    },

    plotOptions: options.plotOptions || {
      spline: {
        pointInterval: 1000 * 60 * 60, // one hour
      },
      series: {
        label: {
          connectorAllowed: true,
        },
        pointStart: 2010,
        lineWidth: 4,
      },
    },

    credits: {
      enabled: false,
    },

    series: series.map((data, i) => {
      return {
        name: data.name,
        type: data.type,
        data: data.data.sort(sortXValues),
        color: options.color ? options.color : options.colors[i],
        zIndex: i + 1,
        pointInterval: 24 * 3600 * 1000
      }
    }),
    tooltip: options.tooltip || {formatter: blankFormatter()}
  }
}
const sortXValues = (a, b) => {
  return a.x === b.x ? 0 : (a.x > b.x ? 1 : -1)
}

const blankFormatter = () => {}

const barConfig = (series, options) => {
  return {
    chart: {
      type: 'column',
      height: options.height || 350,
      margin: options.margins || [10, 40, 70, 65],
      style: {
        fontFamily: 'ProximaSoft-Regular'
      }
    },
    title: {
      text: options.title || ''
    },
    yAxis: options.yAxis || {
      allowDecimals: false,
      min: 0,
      title: {
        text: ''
      }
    },
    credits: {
      enabled: false,
    },
    plotOptions: options.plotOptions || {
      column: {
        stacking: 'normal'
      }
    },
    xAxis: {
      categories: series.categories || [],
      labels: {
        formatter: options.xLabelFormatter || blankFormatter
      }
    },
    series: series.values,
    tooltip: options.tooltip || {formatter: blankFormatter()}
  }
}

const config = {
  line: lineConfig,
  bar: barConfig,
  step: lineConfig,
}

export const ConfigGenerator = (type, series, options) => {
  return config[type](series, options)
}