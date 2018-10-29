import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import './styles.css';


class Header extends Component {
  render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            <Typography className="grow" variant="h6" color="inherit">Weasl</Typography>
            <div className="wsl-main-nav">
              <NavLink to="/" exact={true} activeClassName="active">Home</NavLink>
              <NavLink to="/account" activeClassName="active">Account</NavLink>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
