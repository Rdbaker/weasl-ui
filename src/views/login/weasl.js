import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Button } from 'carbon-components-react';


import Header from 'components/Header';
import './style.css';

class WeaslLogin extends Component {
  onSignupClick = () => {
    global.weasl.signup()
      .then(({ data }) => this.props.onLogin(data))
      .catch(console.warn)
  }

  onLoginClick = () => {
    global.weasl.login()
      .then(({ data }) => this.props.onLogin(data))
      .catch(console.warn)
  }

  render() {
    const {
      waitingOnWeasl,
    } = this.props;

    return (
      <div>
        <Header />
        <main id="main-content" className="with-header">
          <Paper elevation={0} square={true} className="wsl-heading">
            <div className="constrain-width">
              <Typography variant={'h4'}>Login</Typography>
            </div>
          </Paper>
          <div className="constrain-width">
            {waitingOnWeasl && <div>Loading</div>}
            {!waitingOnWeasl && <div><Button onClick={this.onLoginClick}>Login</Button><Button onClick={this.onSignupClick}>Signup</Button></div>}
          </div>
        </main>
      </div>
    );
  }
}

export default WeaslLogin;
