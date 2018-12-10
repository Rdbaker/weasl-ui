import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { OrgsAPI } from 'api/org';

import Home from './views/home';
import AccountHome from './views/account';
import './App.css';

class App extends Component {
  async componentDidMount() {
    const data = OrgsAPI.getMyOrg();
    console.log('got here', data)
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path="/" render={() => (
            <div className="App">
              <Home />
            </div>
          )}/>
          <Route path="/account" render={() => (
            <div className="App">
              <AccountHome />
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
