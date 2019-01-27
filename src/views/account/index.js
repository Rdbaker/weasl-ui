import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from '../../components/Header';
import RouteTabs from '../../components/RouteTabs';
import AccountSettings from './settings';
import AccountSnippet from './snippet';
import Admin from './admin';

class AccountHome extends Component {
  render() {
    var tabs = [
      { label: "Settings", route: "/account" },
      { label: "Snippet", route: "/account/snippet" }
    ];

    const currentUser = this.props.currentUser;
    if (currentUser && currentUser.is_admin) {
      tabs.push({ label: 'Admin', route: '/account/admin' });
    }

    return (
      <div>
        <Header />
        <main id='main-content' className="with-header">
          <Paper elevation={0} square={true} className="wsl-heading">
            <div className="constrain-width">
              <Typography variant={'h4'}>Manage Your Account</Typography>
              <RouteTabs tabs={tabs} />
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
                <Route exact={true} path='/account/admin' render={() => (
                  <div>
                    <Admin />
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
  router: PropTypes.object,
};

export default AccountHome;
