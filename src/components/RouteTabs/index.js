import React, { Component } from 'react';
import { Tabs, Tab } from 'carbon-components-react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

class RouteTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var activeTab = 0;
    var route = this.context.router.route.location.pathname;
    for (var i = 0; i < this.props.tabs.length; i++) {
      if (route.indexOf(this.props.tabs[i].route) >= 0) {
        activeTab = i;
      }
    }

    return (
      <div>
        <Route render={({history}) => (
          <Tabs selected={activeTab}>
            {this.props.tabs.map((tab) => (
              <Tab key={tab.label} label={tab.label} onClick={() => history.push(tab.route)}></Tab>
            ))}
          </Tabs>
        )} />
      </div>
    );
  }
}

RouteTabs.contextTypes = {
  router: PropTypes.object
};

export default RouteTabs;
