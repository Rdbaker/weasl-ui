import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { CodeSnippet } from 'carbon-components-react';

import { OrgsAPI } from 'api/org';

import './style.css';

const getSnippet = (clientId) => (`(function(window, document) {
  if (window.weasl) console.error('Weasl embed already included');
  window.weasl = {}, m = ['init', 'login', 'signup', 'setAttribute', 'getCurrentUser', 'logout', 'debug']; window.weasl._c = [];
  m.forEach(me => window.weasl[me] = function() {window.weasl._c.push([me, arguments])});
  var elt = document.createElement('script');
  elt.type = "text/javascript"; elt.async = true;
  elt.src = "https://js.weasl.in/embed/shim.js";
  var before = document.getElementsByTagName('script')[0];
  before.parentNode.insertBefore(elt, before);
})(window, document, undefined);
weasl.init('${clientId}');`)

class AccountSnippet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgData: null,
      clientId: null,
    };
  }

  componentDidMount() {
    this.doFetchMyOrg();
  }

  doFetchMyOrg = async () => {
    const response = await OrgsAPI.getMyOrg();
    const { data } = await response.json();
    this.setState({
      orgData: data,
      clientId: data.client_id,
    });
  }

  copySnippet = () => {
    this.textArea.focus();
    this.textArea.select();
    document.execCommand('copy');
  }

  render() {
    const {
      clientId,
    } = this.state;

    return (
      <div>
        <Typography variant={'body1'}>
            To add Weasl to your app, copy the snippet of code below and paste it where you would like to manage authentication. You can then use Weasl's API to authenticate users!
        </Typography>
        {!clientId &&
          <div>Loading your snippet</div>
        }
        {clientId &&
          <CodeSnippet className="wsl-snippet" type="multi" onClick={this.copySnippet}>
            {getSnippet(clientId)}
          </CodeSnippet>
        }
        <textarea id="weasl-snippet" className="wsl-snippet-textarea" ref={elt => this.textArea = elt} defaultValue={getSnippet(clientId)} />
      </div>
    );
  }
}

export default AccountSnippet;
