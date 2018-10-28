import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class Header extends Component {
  render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            Weasl
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
