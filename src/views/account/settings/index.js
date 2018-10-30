import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Form,
         TextInput,
         Button } from 'carbon-components-react';
import './style.css';

class AccountSettings extends Component {
  render() {
    return (
      <div>
        <Typography variant={'body1'}>
            Welcome to your settings! Here you can update information related to your Weasl profile.
        </Typography>
        <Form className="wsl-form">
            <TextInput labelText="App Name"></TextInput>
            <TextInput labelText="Login Description"></TextInput>
            <TextInput labelText="Logout Description"></TextInput>
            <Button type="submit">Save</Button>
        </Form>
      </div>
    );
  }
}

export default AccountSettings;
