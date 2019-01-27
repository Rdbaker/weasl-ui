import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { AuthAPI } from 'api/auth';
import { getToken } from 'utils/auth';
import { CurrentUser } from 'utils/contexts';

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
      currentUser: null,
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
          currentUser: data,
        });
      }
    }
  }

  componentDidMount() {
    this.checkLogin();
    this.mountDrift();
  }

  mountDrift = () => {
    !function() {
      var t = window.driftt = window.drift = window.driftt || [];
      if (!t.init) {
        if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
        t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
        t.factory = function(e) {
          return function() {
            var n = Array.prototype.slice.call(arguments);
            return n.unshift(e), t.push(n), t;
          };
        }, t.methods.forEach(function(e) {
          t[e] = t.factory(e);
        }), t.load = function(t) {
          var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
          o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
          var i = document.getElementsByTagName("script")[0];
          i.parentNode.insertBefore(o, i);
        };
      }
    }();
    drift.SNIPPET_VERSION = '0.3.1';
    drift.load('2b7p8yk2aw3x');
  }

  makeLoginRequiredComponent(AuthedComponent) {
    const {
      isLoggedIn,
      checkingLoggedIn,
      currentUser,
    } = this.state;

    return () => {
      if (isLoggedIn) {
        return <AuthedComponent currentUser={currentUser} />;
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
          </CurrentUser.Provider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
