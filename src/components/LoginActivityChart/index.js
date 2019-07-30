import React, { Component } from 'react';


import { EndUsersAPI } from 'api/endUsers';
import ChartWrapper from 'components/ChartWrapper';
import LoadingDots from 'components/LoadingDots';

import './style.css';

const formatter = Intl.NumberFormat();

const tooltipFormatter = ({
  chart: {
    hoverPoint: point,
  }
}) => {
  return `
    <div class="line-chart-tooltip-container">
      <h4>${point.series.name}</h4>
      <div>${(new Date(point.x)).toLocaleDateString()}</div>
      <div>${formatter.format(point.y)} login${point.y !== 1 ? 's' : ''}</div>
    </div>
  `
}


class LoginActivityChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fetchErr: null,
      data: {sms_logins: [], email_logins: []},
    };

    this.doFetchData();
  }

  doFetchData = () => {
    EndUsersAPI.getEndUserAggregateLogins()
      .then(this.fetchSuccess)
      .catch(this.fetchFailed)
  }

  fetchSuccess = async (res) => {
    try {
      const { data } = await res.json();
      this.setState({
        loading: false,
        data,
      });
    } catch (err) {
      this.fetchFailed(err);
    }
  }

  fetchFailed = (err) => {
    this.setState({
      loading: false,
      fetchErr: err,
    })
  }

  getSMSLoginData = () => {
    const {
      data,
    } = this.state;

    return data.sms_logins.map(([value, date]) => ({ x: Date.parse(date), y: value }));
  }

  getEmailLoginData = () => {
    const {
      data,
    } = this.state;

    return data.email_logins.map(([value, date]) => ({ x: Date.parse(date), y: value }));
  }

  dataIsEmpty = () => {
    const {
      data,
    } = this.state;

    return data.email_logins.length === 0 && data.sms_logins.length === 0;
  }

  render() {
    const {
      loading,
    } = this.state;


    if (loading) {
      return (<div><div>Loading data</div><LoadingDots /></div>);
    }

    if (this.dataIsEmpty()) {
      return null;
    }

    return (
      <ChartWrapper
        series={[{ name: 'Email Logins', data: this.getEmailLoginData() }, { name: 'SMS Logins', data: this.getSMSLoginData() }]}
        chartType="line"
        container="solar-gen-container"
        options={
          {
            colors: ['#6EE4D1'],
            tooltip: {
              borderWidth: 0,
              backgroundColor: null,
              useHTML: true,
              shared: true,
              formatter: tooltipFormatter,
            },
            xAxis: {
              labels: {
                formatter: ({ value }) => new Date(value).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
              },
              tickInterval: 3600 * 1000,
            },
          }
        }
      />
    )
  }
}

export default LoginActivityChart