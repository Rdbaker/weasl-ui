import React, { Component } from 'react';
import Home from './views/home';
import AccountHome from './views/account';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <Home />
            </div>
          )}/>
          <Route path='/account' render={() => (
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
