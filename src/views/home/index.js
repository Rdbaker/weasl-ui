import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Header from 'components/Header';
import EndUserTable from 'components/EndUserTable';
import LoginActivityChart from 'components/LoginActivityChart';
import './style.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const {
    } = this.state;

    return (
      <main id="main-content" className="with-header">
        <Paper elevation={0} square={true} className="wsl-heading">
          <div className="constrain-width">
            <Typography variant={'h4'}>Home</Typography>
          </div>
        </Paper>

        <Header />
        <LoginActivityChart />
        <EndUserTable />
      </main>
    );
  }
}

export default Home;
