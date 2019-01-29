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

const getNamespacedPropertyValue = (orgData, name, namespace) => {
  if (!name) return false;
  if (!orgData) return false;
  if (!orgData.properties.length) return false;
  const prop = orgData.properties.find(property => property.namespace === namespace && property.name === name);
  return prop && prop.value;
}

const hasGate = (orgData, gateName) => getNamespacedPropertyValue(orgData, gateName, 'OrgPropertyNamespaces.GATES');
const getSettingValue = (orgData, settingName) => getNamespacedPropertyValue(orgData, settingName, 'OrgPropertyNamespaces.SETTINGS');
const getThemeValue = (orgData, themeName) => getNamespacedPropertyValue(orgData, themeName, 'OrgPropertyNamespaces.THEME');


class AccountSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgData: null,
      allowedDomainInput: '',
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
      allowedDomains: getSettingValue(data, 'allowed_domains'),
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
      allowedDomains = [],
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
      OrgsAPI.updateSettingProperty('allowed_domains', JSON.stringify(allowedDomains), 'JSON');
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
  onAllowedDomainInputChange = e => this.setState({ allowedDomainInput: e.target.value })
  onDomainKeyDown = e => {
    if (e.keyCode == 13) {
      this.setState(prevState => ({
        allowedDomains: prevState.allowedDomains.concat([ prevState.allowedDomainInput ]),
        allowedDomainInput: '',
      }))
      e.preventDefault();
    }
  }
  removeDomain = index => {
    this.setState(prevState => ({
      allowedDomains: prevState.allowedDomains.slice(0, index).concat(prevState.allowedDomains.slice(index + 1))
    }))
  }

  renderDomainHelperText = () => {
    const {
      allowedDomains = [],
    } = this.state;
    return (
      <div>
        <div>If you add domains here, Weasl will only be allowed to run on the provided domains. Otherwise, Weasl can run everywhere.</div>
        <div>Press enter to add another domain when editing, or press the small X to remove an added domain.</div>
        {allowedDomains.map((domain, i) => (
          <div key={domain}>{domain} <span className="domain-remove-x" onClick={() => this.removeDomain(i)}>&times;</span></div>
        ))}
      </div>
    )
  }

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
      allowedDomainInput,
    } = this.state;

    return (
      <div className="account-settings-form-container">
        <Typography variant={'body1'}>
            Welcome to your settings! Here you can update information related to your Weasl profile.
        </Typography>
        {!!orgData &&
          <div>
            {updateFailed && <div className="form-notification-update-failed">The update failed</div>}
            {updateSuccess && <div className="form-notification-update-success">Update successful!</div>}
            <Form className="wsl-form" onSubmit={this.onSubmit}>
              <TextInput
                labelText="App Name"
                id="company_name"
                helperText="This name is shown to your users in the magiclink email"
                value={appName}
                onChange={this.onAppNameChange} />
              <TextInput
                labelText="Text Login Message"
                id="text_login_message"
                helperText="This is sent in the login text message and the login code will appear at the end"
                value={textLoginMessage}
                onChange={this.onTextMsgChange} />
              <TextInput
                labelText="Email Magiclink"
                id="email_magiclink"
                helperText="This is the link that users will land on through the magiclink email- Weasl should be installed on this page"
                value={emailMagiclink}
                onChange={this.onEmailLinkChange} />
              <Toggle
                id="toggle-1"
                labelText="Enable SMS Login"
                onChange={this.onToggleSmsLogin}
                defaultToggled={smsLoginEnabled} />
              {hasSocialLogin &&
                <Fragment>
                  <Toggle
                    labelText="Enable Google Login"
                    id="toggle-2"
                    onChange={this.onToggleGoogleLogin}
                    defaultToggled={googleLoginEnabled} />
                  <TextInput
                    labelText="Google Client ID"
                    id="google_client_id"
                    helperText={<a href="" target="_blank">Learn how to set this up</a>}
                    value={googleClientId}
                    onChange={this.onGoogleClientIdChange} />
                </Fragment>
              }
              <TextInput
                helperText={this.renderDomainHelperText()}
                labelText="Allowed Domain"
                id="allowed_domains"
                value={allowedDomainInput}
                onKeyDown={this.onDomainKeyDown}
                onChange={this.onAllowedDomainInputChange} />
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
