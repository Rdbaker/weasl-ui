import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { WEASL_ON_WEASL_CLIENT_ID, WEASL_ON_WEASL_SHIM_URL, DEBUG } from 'constants/resources';
import { CurrentUser } from 'utils/contexts';

import Home from './views/home';
import AccountHome from './views/account';
import { EmailLogin, VerifyEmail, WeaslLogin } from 'views/login';
import './App.css';

global.WEASL_ON_WEASL_CLIENT_ID = WEASL_ON_WEASL_CLIENT_ID;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      waitingOnWeasl: false,
    };
  }

  makeWeaslOnloadFunc = () => {
    const component = this;
    this.setState({
      waitingOnWeasl: true,
    });
    return weaslApi => {
      weaslApi
        .getCurrentUser()
        .then((user) => {
          component.setState({
            isLoggedIn: true,
            waitingOnWeasl: false,
            currentUser: user,
          })
        })
        .catch(() => {
          component.setState({
            isLoggedIn: false,
            waitingOnWeasl: false,
          })
        })
    }
  }

  makeWeaslOnEmailVerifyFunc = () => {
    const component = this;
    return weaslApi => {
      weaslApi
        .getCurrentUser()
        .then((user) => {
          component.setState({
            isLoggedIn: true,
            waitingOnWeasl: false,
            currentUser: user,
          })
        })
        .catch(() => {
          component.setState({
            isLoggedIn: false,
            waitingOnWeasl: false,
          })
        })
    }
  }

  componentDidMount() {
    this.mountWeasl();
    global.weasl.onload = this.makeWeaslOnloadFunc();
    global.weasl.onEmailVerify = this.makeWeaslOnEmailVerifyFunc();
  }

  mountWeasl = () => {
    if (global.weasl) return;
    global.weasl = {};
    const m = ['init', 'login', 'signup', 'setAttribute', 'getCurrentUser', 'logout', 'debug']; global.weasl._c = [];
    m.forEach(me => global.weasl[me] = function() {global.weasl._c.push([me, arguments])});
    var elt = document.createElement('script');
    elt.type = "text/javascript"; elt.async = true;
    elt.src = WEASL_ON_WEASL_SHIM_URL;
    var before = document.getElementsByTagName('script')[0];
    before.parentNode.insertBefore(elt, before);
    global.weasl.init(WEASL_ON_WEASL_CLIENT_ID);
  }

  makeLoginRequiredComponent(AuthedComponent) {
    const {
      isLoggedIn,
      currentUser,
      waitingOnWeasl,
    } = this.state;

    return () => {
      if (isLoggedIn) {
        global.Sentry && global.Sentry.configureScope && global.Sentry.configureScope((scope) => {
          scope.setUser(currentUser);
        });

        return <AuthedComponent currentUser={currentUser} />;
      } else {
        return <WeaslLogin onLogin={(user) => {
          this.setState({
            isLoggedIn: true,
            currentUser: user,
          })
        }} waitingOnWeasl={waitingOnWeasl}/>;
      }
    }
  }

  render() {

    const {
      currentUser,
    } = this.state;

    return (
      <BrowserRouter>
        <div className="App">
          <CurrentUser.Provider value={currentUser}>
            <Route exact={true} path="/" render={this.makeLoginRequiredComponent(Home)} />
            <Route path="/login" component={EmailLogin}/>
            <Route path="/account" render={this.makeLoginRequiredComponent(AccountHome)} />
            <Route path="/verify-token/:token" render={() => <VerifyEmail checkLogin={this.checkLogin} />} />
            <Route path="/verify" render={() => <WeaslLogin checkLogin={this.checkLogin} />} />
          </CurrentUser.Provider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
