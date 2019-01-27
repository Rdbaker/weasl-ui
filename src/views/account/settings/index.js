import React, { Component, Fragment } from 'react';
import { OrgsAPI } from 'api/org';
import Typography from '@material-ui/core/Typography';
import {
  Form,
  TextInput,
  Button,
  Toggle,
} from 'carbon-components-react';
import './style.css';

const hasGate = (orgData, gateName) => {
  if (!gateName) return false;
  if (!orgData) return false;
  if (!orgData.properties.length) return false;
  const gate = orgData.properties.find(property => {
    return property.namespace === 'OrgPropertyNamespaces.GATES' && property.name === gateName
  });
  return gate && gate.value;
}

const getSettingValue = (orgData, settingName) => {
  if (!settingName) return false;
  if (!orgData) return false;
  if (!orgData.properties.length) return false;
  const setting = orgData.properties.find(property => {
    return property.namespace === 'OrgPropertyNamespaces.SETTINGS' && property.name === settingName
  });
  return setting && setting.value;
}

const getThemeValue = (orgData, themeName) => {
  if (!themeName) return false;
  if (!orgData) return false;
  if (!orgData.properties.length) return false;
  const theme = orgData.properties.find(property => {
    return property.namespace === 'OrgPropertyNamespaces.THEME' && property.name === themeName
  });
  return theme && theme.value;
}


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
    this.setState({
      orgData: data,
      appName: getThemeValue(data, 'company_name'),
      textLoginMessage: getThemeValue(data, 'text_login_message'),
      emailMagiclink: getThemeValue(data, 'email_magiclink'),
      smsLoginEnabled: !getThemeValue(data, 'sms_login_disabled'),
      hasSocialLogin: hasGate(data,'has_social_login'),
      googleLoginEnabled: getThemeValue(data, 'google_login_enabled'),
      googleClientId: getSettingValue(data, 'google_client_id'),
      updateFailed: false,
      updateSuccess: false,
    });
  }

  doSave = async () => {
    const {
      appName,
      textLoginMessage,
      emailMagiclink,
      smsLoginEnabled,
      googleLoginEnabled,
      hasSocialLogin,
      googleClientId,
    } = this.state;

    try {
      OrgsAPI.updateThemeProperty('company_name', appName);
      OrgsAPI.updateThemeProperty('text_login_message', textLoginMessage);
      OrgsAPI.updateThemeProperty('email_magiclink', emailMagiclink);
      OrgsAPI.updateThemeProperty('sms_login_disabled', !smsLoginEnabled, 'BOOLEAN');
      if (hasSocialLogin) {
        OrgsAPI.updateThemeProperty('google_login_enabled', googleLoginEnabled, 'BOOLEAN');
        OrgsAPI.updateSettingProperty('google_client_id', googleClientId);
      }
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
  onToggleSmsLogin = e => this.setState({ smsLoginEnabled: e.target.checked })
  onToggleGoogleLogin = e => this.setState({ googleLoginEnabled: e.target.checked })
  onGoogleClientIdChange = e => this.setState({ googleClientId: e.target.value })

  render() {
    const {
      orgData,
      appName,
      textLoginMessage,
      emailMagiclink,
      updateFailed,
      updateSuccess,
      smsLoginEnabled = true,
      hasSocialLogin,
      googleLoginEnabled,
      googleClientId,
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
              <label>
                Enable SMS Login
                <Toggle id="toggle-1" onChange={this.onToggleSmsLogin} defaultToggled={smsLoginEnabled} />
              </label>
              {hasSocialLogin &&
                <Fragment>
                  <label>
                    Enable Google Login
                    <Toggle id="toggle-2" onChange={this.onToggleGoogleLogin} defaultToggled={googleLoginEnabled} />
                  </label>
                  <TextInput labelText="Google Client ID" id="google_client_id" value={googleClientId} onChange={this.onGoogleClientIdChange} />
                </Fragment>
              }
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
