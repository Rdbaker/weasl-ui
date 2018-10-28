import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Tabs, Tab } from 'carbon-components-react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from '../../components/header';
import AccountSettings from './settings';
import AccountSnippet from './snippet';
import PropTypes from 'prop-types';
//import './style.css';

class AccountHome extends Component {
  render() {
    var tabs = [
      { label: "Settings", route: "/account" },
      { label: "Snippet", route: "/account/snippet" }
    ];

    var activeTab = 0;
    console.log(this.context.router.route.location.pathname);
    return (
      <div>
        <Header />
        <main id='main-content' className="with-header">
          <Paper elevation={0} square={true} className="wsl-heading">
            <div className="constrain-width">
              <Typography variant={'h4'}>Manage Your Account</Typography>
              <Tabs selected={0}>
                <Tab label="Settings"></Tab>
                <Tab label="Snippet"></Tab>
              </Tabs>
            </div>
          </Paper>
          <div className="constrain-width">
              <div>
                <Route exact={true} path='/account' render={() => (
                  <div>
                    <AccountSettings />
                  </div>
                )}/>
                <Route exact={true} path='/account/snippet' render={() => (
                  <div>
                    <AccountSnippet />
                  </div>
                )}/>
              </div>
          </div>
        </main>
      </div>
    );
  }
}

AccountHome.contextTypes = {
  router: PropTypes.object
};

export default AccountHome;
