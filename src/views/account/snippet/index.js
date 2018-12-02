import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { CodeSnippet } from 'carbon-components-react';
import './style.css';

class AccountSnippet extends Component {
  render() {
    var snippet = 'Weasl.add(plugin).go().activate();';
    return (
      <div>
        <Typography variant={'body1'}>
            To add Weasl to your app, copy the snippet of code below and paste it where you would like to manage authentication. You can then use Weasl's API to authenticate users!
        </Typography>
        <CodeSnippet type="multi" className="wsl-snippet" onClick={() => { alert("implement copy"); }}>
            {snippet}
        </CodeSnippet>
      </div>
    );
  }
}

export default AccountSnippet;
