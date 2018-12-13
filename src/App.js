import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { AuthAPI } from 'api/auth';
import { getToken } from 'utils/auth';

import Home from './views/home';
import AccountHome from './views/account';
import { EmailLogin, VerifyEmail } from 'views/login';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkingLoggedIn: false,
      isLoggedIn: false,
    };
  }

  checkLogin = async () => {
    const token = getToken();
    if (token) {
      this.setState({
        checkingLoggedIn: true,
      });
      const response = await AuthAPI.getMe();
      const { data } = await response.json();
      if (!data) {
        this.setState({
          isLoggedIn: false,
          checkingLoggedIn: false,
        });
      } else {
        this.setState({
          isLoggedIn: true,
          checkingLoggedIn: false,
        });
      }
    }
  }

  componentDidMount() {
    this.checkLogin();
  }

  makeLoginRequiredComponent(AuthedComponent) {
    const {
      isLoggedIn,
      checkingLoggedIn,
    } = this.state;

    return () => {
      if (isLoggedIn) {
        return <AuthedComponent />;
      } else {
        if (checkingLoggedIn) {
          // TODO: render a loading screen or something
          return <AuthedComponent />;
        } else {
          return <EmailLogin/>;
        }
      }
    }
  }

  render() {
    const {
      isLoggedIn,
      checkingLoggedIn,
    } = this.state;

    return (
      <BrowserRouter>
        <div className="App">
          <Route exact={true} path="/" render={this.makeLoginRequiredComponent(Home)} />
          <Route path="/login" component={EmailLogin}/>
          <Route path="/account" render={this.makeLoginRequiredComponent(AccountHome)} />
          <Route path="/verify-token/:token" render={() => <VerifyEmail checkLogin={this.checkLogin} />} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
