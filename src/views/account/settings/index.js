import React, { Component } from 'react';
import { OrgsAPI } from 'api/org';
import Typography from '@material-ui/core/Typography';
import {
  Form,
  TextInput,
  Button
} from 'carbon-components-react';
import './style.css';

class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgData: null,
    };
  }

  componentDidMount() {
    this.doFetchMyOrg();
  }

  doFetchMyOrg = async () => {
    const response = await OrgsAPI.getMyOrg();
    const { data } = await response.json();
    const properties = data.properties;
    this.setState({
      orgData: data,
      appName: properties.find(property => property.name === 'company_name').value,
      textLoginMessage: properties.find(property => property.name === 'text_login_message').value,
      emailMagiclink: properties.find(property => property.name === 'email_magiclink').value,
      updateFailed: false,
      updateSuccess: false,
    });
  }

  doSave = async () => {
    const {
      appName,
      textLoginMessage,
      emailMagiclink,
    } = this.state;

    try {
      OrgsAPI.updateThemeProperty('company_name', appName);
      OrgsAPI.updateThemeProperty('text_login_message', textLoginMessage);
      OrgsAPI.updateThemeProperty('email_magiclink', emailMagiclink);
      this.setState({
        updateFailed: false,
        updateSuccess: true,
      });
      setTimeout(this.unsetSuccessState, 3000);
    } catch (e) {
      this.setState({
        updateFailed: true,
        updateSuccess: false,
      });
      setTimeout(this.unsetFailState, 3000);
    }
  }


  onSubmit = e => {
    e.preventDefault();
    this.doSave();
  }

  unsetSuccessState = () => this.setState({ updateSuccess: false })
  unsetFailState = () => this.setState({ updateFailed: false })
  onAppNameChange = e => this.setState({ appName: e.target.value })
  onTextMsgChange = e => this.setState({ textLoginMessage: e.target.value })
  onEmailLinkChange = e => this.setState({ emailMagiclink: e.target.value })

  render() {
    const {
      orgData,
      appName,
      textLoginMessage,
      emailMagiclink,
      updateFailed,
      updateSuccess,
    } = this.state;

    return (
      <div>
        <Typography variant={'body1'}>
            Welcome to your settings! Here you can update information related to your Weasl profile.
        </Typography>
        {!!orgData &&
          <div>
            {updateFailed && <div className="form-notification-update-failed">The update failed</div>}
            {updateSuccess && <div className="form-notification-update-success">Update successful!</div>}
            <Form className="wsl-form" onSubmit={this.onSubmit}>
              <TextInput labelText="App Name" id="company_name" value={appName} onChange={this.onAppNameChange} />
              <TextInput labelText="Text Login Message" id="text_login_message" value={textLoginMessage} onChange={this.onTextMsgChange} />
              <TextInput labelText="Email Magiclink" id="email_magiclink" value={emailMagiclink} onChange={this.onEmailLinkChange} />
              <Button type="submit" onClick={this.onSubmit}>Save</Button>
            </Form>
          </div>
        }
        {!orgData &&
          <div>Loading your settings</div>
        }
      </div>
    );
  }
}

export default AccountSettings;
